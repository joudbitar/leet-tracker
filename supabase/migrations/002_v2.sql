-- v2: confidence levels, pattern guessing, complexity notes, profiles + target date,
-- weekly leaderboard. Run once in the Supabase SQL editor (safe to re-run).

-- ── progress: richer solve state ──────────────────────────────────────────────
alter table progress
  add column if not exists confidence text check (confidence in ('clean','hints','solution')),
  add column if not exists solved_at timestamptz,
  add column if not exists guessed_pattern text,
  add column if not exists guess_correct boolean,
  add column if not exists time_complexity text,
  add column if not exists space_complexity text;

-- v1 checkmarks become clean solves
update progress set confidence = 'clean' where checked and confidence is null;
update progress set solved_at = updated_at where confidence is not null and solved_at is null;

-- ── remap v1 week-based ids (w1p1…) to stable slugs ───────────────────────────
create temp table _idmap(old_id text primary key, new_id text not null);
insert into _idmap(old_id, new_id) values
  ('w1p1','contains-duplicate'),('w1p2','valid-anagram'),('w1p3','two-sum'),
  ('w2p1','group-anagrams'),('w2p2','top-k-frequent-elements'),('w2p3','product-of-array-except-self'),
  ('w3p1','valid-palindrome'),('w3p2','two-sum-ii'),('w3p3','3sum'),
  ('w4p1','container-with-most-water'),('w4p2','trapping-rain-water'),('w4p3','best-time-to-buy-and-sell-stock'),
  ('w5p1','longest-substring-without-repeating-characters'),('w5p2','longest-repeating-character-replacement'),('w5p3','permutation-in-string'),
  ('w6p1','valid-parentheses'),('w6p2','min-stack'),('w6p3','evaluate-reverse-polish-notation'),
  ('w7p1','generate-parentheses'),('w7p2','daily-temperatures'),('w7p3','car-fleet'),
  ('w8p1','binary-search'),('w8p2','search-a-2d-matrix'),('w8p3','koko-eating-bananas'),
  ('w9p1','find-minimum-in-rotated-sorted-array'),('w9p2','search-in-rotated-sorted-array'),('w9p3','time-based-key-value-store'),
  ('w10p1','invert-binary-tree'),('w10p2','maximum-depth-of-binary-tree'),('w10p3','diameter-of-binary-tree'),
  ('w11p1','balanced-binary-tree'),('w11p2','same-tree'),('w11p3','subtree-of-another-tree'),
  ('w12p1','lowest-common-ancestor-of-a-bst'),('w12p2','binary-tree-level-order-traversal'),('w12p3','binary-tree-right-side-view'),
  ('w13p1','count-good-nodes-in-binary-tree'),('w13p2','validate-binary-search-tree'),('w13p3','kth-smallest-element-in-a-bst'),
  ('w14p1','construct-binary-tree-from-preorder-and-inorder-traversal'),('w14p2','binary-tree-maximum-path-sum'),('w14p3','serialize-and-deserialize-binary-tree'),
  ('w15p1','reverse-linked-list'),('w15p2','merge-two-sorted-lists'),('w15p3','reorder-list'),
  ('w16p1','remove-nth-node-from-end-of-list'),('w16p2','copy-list-with-random-pointer'),('w16p3','add-two-numbers'),
  ('w17p1','kth-largest-element-in-a-stream'),('w17p2','last-stone-weight'),('w17p3','k-closest-points-to-origin'),
  ('w18p1','kth-largest-element-in-an-array'),('w18p2','task-scheduler'),('w18p3','find-median-from-data-stream'),
  ('w19p1','subsets'),('w19p2','combination-sum'),('w19p3','permutations'),
  ('w20p1','subsets-ii'),('w20p2','combination-sum-ii'),('w20p3','word-search'),
  ('w21p1','longest-common-subsequence'),('w21p2','number-of-islands'),('w21p3','lru-cache'),
  ('w22p1','number-of-islands'),('w22p2','clone-graph'),('w22p3','max-area-of-island'),
  ('w23p1','pacific-atlantic-water-flow'),('w23p2','surrounded-regions'),('w23p3','rotting-oranges'),
  ('w24p1','course-schedule'),('w24p2','course-schedule-ii'),('w24p3','redundant-connection'),
  ('w25p1','number-of-connected-components'),('w25p2','graph-valid-tree'),('w25p3','word-ladder'),
  ('w26p1','climbing-stairs'),('w26p2','min-cost-climbing-stairs'),('w26p3','house-robber'),
  ('w27p1','house-robber-ii'),('w27p2','longest-palindromic-substring'),('w27p3','palindromic-substrings'),
  ('w28p1','coin-change'),('w28p2','maximum-product-subarray'),('w28p3','word-break'),
  ('w29p1','longest-common-subsequence'),('w29p2','edit-distance'),('w29p3','distinct-subsequences'),
  ('w30p1','interleaving-string'),('w30p2','burst-balloons'),('w30p3','regular-expression-matching'),
  ('w31p1','implement-trie'),('w31p2','design-add-and-search-words'),('w31p3','word-search-ii');

-- merge old rows into slug ids (duplicates like w21p2/w22p1 collapse into one row)
insert into progress (user_id, problem_id, checked, note, updated_at, confidence, solved_at)
select p.user_id, m.new_id, bool_or(p.checked),
       coalesce(string_agg(nullif(p.note, ''), ' | '), ''),
       max(p.updated_at),
       (array_remove(array_agg(p.confidence), null))[1],
       max(p.solved_at)
from progress p
join _idmap m on m.old_id = p.problem_id
group by p.user_id, m.new_id
on conflict (user_id, problem_id) do nothing;

delete from progress where problem_id in (select old_id from _idmap);
drop table _idmap;

-- ── profiles: target date + leaderboard identity ──────────────────────────────
create table if not exists profiles (
  user_id uuid primary key references auth.users on delete cascade,
  display_name text not null default '',
  target_date date,
  core_only boolean not null default false,
  show_on_leaderboard boolean not null default true,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
drop policy if exists "Users own their profile" on profiles;
create policy "Users own their profile" on profiles
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── weekly leaderboard ────────────────────────────────────────────────────────
-- security definer so it can aggregate across users; exposes only short display
-- names + counts, and only for people who opted in. Resets every Monday.
create or replace function weekly_leaderboard()
returns table(display_name text, solved bigint)
language sql
security definer
set search_path = public
stable
as $$
  select pf.display_name, count(*) as solved
  from progress pr
  join profiles pf on pf.user_id = pr.user_id
  where pr.confidence is not null
    and pr.solved_at >= date_trunc('week', now())
    and pf.show_on_leaderboard
    and pf.display_name <> ''
  group by pf.user_id, pf.display_name
  order by solved desc, display_name
  limit 100;
$$;

grant execute on function weekly_leaderboard() to anon, authenticated;
