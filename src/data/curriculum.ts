export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type Topic =
  | 'Arrays & Hashmaps'
  | 'Two Pointers'
  | 'Sliding Window'
  | 'Stacks'
  | 'Binary Search'
  | 'Trees'
  | 'Linked Lists'
  | 'Heaps'
  | 'Backtracking'
  | 'Graphs'
  | 'Advanced Graphs'
  | 'Dynamic Programming'
  | 'DP Hard'
  | 'Tries'
  | 'Review'

export interface Problem {
  id: string
  name: string
  url: string
  difficulty: Difficulty
}

export interface Week {
  id: string
  number: number
  phase: 1 | 2 | 3
  dateRange: string
  startDate: string // YYYY-MM-DD
  topic: Topic
  problems: Problem[]
}

export const CURRICULUM: Week[] = [
  // PHASE 1
  {
    id: 'w1', number: 1, phase: 1, dateRange: 'Mar 23–28', startDate: '2026-03-23', topic: 'Arrays & Hashmaps',
    problems: [
      { id: 'w1p1', name: 'Contains Duplicate', url: 'https://neetcode.io/problems/duplicate-integer', difficulty: 'Easy' },
      { id: 'w1p2', name: 'Valid Anagram', url: 'https://neetcode.io/problems/is-anagram', difficulty: 'Easy' },
      { id: 'w1p3', name: 'Two Sum', url: 'https://neetcode.io/problems/two-integer-sum', difficulty: 'Easy' },
    ],
  },
  {
    id: 'w2', number: 2, phase: 1, dateRange: 'Mar 30–Apr 4', startDate: '2026-03-30', topic: 'Arrays & Hashmaps',
    problems: [
      { id: 'w2p1', name: 'Group Anagrams', url: 'https://neetcode.io/problems/anagram-groups', difficulty: 'Medium' },
      { id: 'w2p2', name: 'Top K Frequent Elements', url: 'https://neetcode.io/problems/top-k-elements-in-list', difficulty: 'Medium' },
      { id: 'w2p3', name: 'Product of Array Except Self', url: 'https://neetcode.io/problems/products-of-array-discluding-self', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w3', number: 3, phase: 1, dateRange: 'Apr 6–11', startDate: '2026-04-06', topic: 'Two Pointers',
    problems: [
      { id: 'w3p1', name: 'Valid Palindrome', url: 'https://neetcode.io/problems/is-palindrome', difficulty: 'Easy' },
      { id: 'w3p2', name: 'Two Sum II', url: 'https://neetcode.io/problems/two-integer-sum-ii', difficulty: 'Medium' },
      { id: 'w3p3', name: '3Sum', url: 'https://neetcode.io/problems/three-integer-sum', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w4', number: 4, phase: 1, dateRange: 'Apr 13–18', startDate: '2026-04-13', topic: 'Two Pointers',
    problems: [
      { id: 'w4p1', name: 'Container With Most Water', url: 'https://neetcode.io/problems/max-water-container', difficulty: 'Medium' },
      { id: 'w4p2', name: 'Trapping Rain Water', url: 'https://neetcode.io/problems/trapping-rain-water', difficulty: 'Hard' },
      { id: 'w4p3', name: 'Best Time to Buy/Sell Stock', url: 'https://neetcode.io/problems/buy-and-sell-crypto', difficulty: 'Easy' },
    ],
  },
  {
    id: 'w5', number: 5, phase: 1, dateRange: 'Apr 20–25', startDate: '2026-04-20', topic: 'Sliding Window',
    problems: [
      { id: 'w5p1', name: 'Longest Substring Without Repeating Characters', url: 'https://neetcode.io/problems/longest-substring-without-duplicates', difficulty: 'Medium' },
      { id: 'w5p2', name: 'Longest Repeating Character Replacement', url: 'https://neetcode.io/problems/longest-repeating-substring-with-replacement', difficulty: 'Medium' },
      { id: 'w5p3', name: 'Permutation in String', url: 'https://neetcode.io/problems/permutation-string', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w6', number: 6, phase: 1, dateRange: 'Apr 27–May 2', startDate: '2026-04-27', topic: 'Stacks',
    problems: [
      { id: 'w6p1', name: 'Valid Parentheses', url: 'https://neetcode.io/problems/validate-parentheses', difficulty: 'Easy' },
      { id: 'w6p2', name: 'Min Stack', url: 'https://neetcode.io/problems/minimum-stack', difficulty: 'Medium' },
      { id: 'w6p3', name: 'Evaluate Reverse Polish Notation', url: 'https://neetcode.io/problems/evaluate-reverse-polish-notation', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w7', number: 7, phase: 1, dateRange: 'May 4–10', startDate: '2026-05-04', topic: 'Stacks',
    problems: [
      { id: 'w7p1', name: 'Generate Parentheses', url: 'https://neetcode.io/problems/generate-parentheses', difficulty: 'Medium' },
      { id: 'w7p2', name: 'Daily Temperatures', url: 'https://neetcode.io/problems/daily-temperatures', difficulty: 'Medium' },
      { id: 'w7p3', name: 'Car Fleet', url: 'https://neetcode.io/problems/car-fleet', difficulty: 'Medium' },
    ],
  },
  // PHASE 2
  {
    id: 'w8', number: 8, phase: 2, dateRange: 'May 11–16', startDate: '2026-05-11', topic: 'Binary Search',
    problems: [
      { id: 'w8p1', name: 'Binary Search', url: 'https://neetcode.io/problems/binary-search', difficulty: 'Easy' },
      { id: 'w8p2', name: 'Search a 2D Matrix', url: 'https://neetcode.io/problems/search-2d-matrix', difficulty: 'Medium' },
      { id: 'w8p3', name: 'Koko Eating Bananas', url: 'https://neetcode.io/problems/eating-bananas', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w9', number: 9, phase: 2, dateRange: 'May 18–23', startDate: '2026-05-18', topic: 'Binary Search',
    problems: [
      { id: 'w9p1', name: 'Find Minimum in Rotated Sorted Array', url: 'https://neetcode.io/problems/find-minimum-in-rotated-sorted-array', difficulty: 'Medium' },
      { id: 'w9p2', name: 'Search in Rotated Sorted Array', url: 'https://neetcode.io/problems/find-target-in-rotated-sorted-array', difficulty: 'Medium' },
      { id: 'w9p3', name: 'Time Based Key-Value Store', url: 'https://neetcode.io/problems/time-based-key-value-store', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w10', number: 10, phase: 2, dateRange: 'May 25–30', startDate: '2026-05-25', topic: 'Trees',
    problems: [
      { id: 'w10p1', name: 'Invert Binary Tree', url: 'https://neetcode.io/problems/invert-a-binary-tree', difficulty: 'Easy' },
      { id: 'w10p2', name: 'Maximum Depth of Binary Tree', url: 'https://neetcode.io/problems/depth-of-binary-tree', difficulty: 'Easy' },
      { id: 'w10p3', name: 'Diameter of Binary Tree', url: 'https://neetcode.io/problems/binary-tree-diameter', difficulty: 'Easy' },
    ],
  },
  {
    id: 'w11', number: 11, phase: 2, dateRange: 'Jun 1–6', startDate: '2026-06-01', topic: 'Trees',
    problems: [
      { id: 'w11p1', name: 'Balanced Binary Tree', url: 'https://neetcode.io/problems/balanced-binary-tree', difficulty: 'Easy' },
      { id: 'w11p2', name: 'Same Tree', url: 'https://neetcode.io/problems/same-binary-tree', difficulty: 'Easy' },
      { id: 'w11p3', name: 'Subtree of Another Tree', url: 'https://neetcode.io/problems/subtree-of-a-binary-tree', difficulty: 'Easy' },
    ],
  },
  {
    id: 'w12', number: 12, phase: 2, dateRange: 'Jun 8–13', startDate: '2026-06-08', topic: 'Trees',
    problems: [
      { id: 'w12p1', name: 'Lowest Common Ancestor of BST', url: 'https://neetcode.io/problems/lowest-common-ancestor-in-binary-search-tree', difficulty: 'Medium' },
      { id: 'w12p2', name: 'Binary Tree Level Order Traversal', url: 'https://neetcode.io/problems/level-order-traversal-of-binary-tree', difficulty: 'Medium' },
      { id: 'w12p3', name: 'Binary Tree Right Side View', url: 'https://neetcode.io/problems/binary-tree-right-side-view', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w13', number: 13, phase: 2, dateRange: 'Jun 15–20', startDate: '2026-06-15', topic: 'Trees',
    problems: [
      { id: 'w13p1', name: 'Count Good Nodes in Binary Tree', url: 'https://neetcode.io/problems/count-good-nodes-in-binary-tree', difficulty: 'Medium' },
      { id: 'w13p2', name: 'Validate Binary Search Tree', url: 'https://neetcode.io/problems/valid-binary-search-tree', difficulty: 'Medium' },
      { id: 'w13p3', name: 'Kth Smallest Element in BST', url: 'https://neetcode.io/problems/kth-smallest-integer-in-bst', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w14', number: 14, phase: 2, dateRange: 'Jun 22–27', startDate: '2026-06-22', topic: 'Trees',
    problems: [
      { id: 'w14p1', name: 'Construct Binary Tree from Preorder and Inorder Traversal', url: 'https://neetcode.io/problems/binary-tree-from-preorder-and-inorder-traversal', difficulty: 'Medium' },
      { id: 'w14p2', name: 'Binary Tree Maximum Path Sum', url: 'https://neetcode.io/problems/binary-tree-maximum-path-sum', difficulty: 'Hard' },
      { id: 'w14p3', name: 'Serialize and Deserialize Binary Tree', url: 'https://neetcode.io/problems/serialize-and-deserialize-binary-tree', difficulty: 'Hard' },
    ],
  },
  {
    id: 'w15', number: 15, phase: 2, dateRange: 'Jun 29–Jul 4', startDate: '2026-06-29', topic: 'Linked Lists',
    problems: [
      { id: 'w15p1', name: 'Reverse Linked List', url: 'https://neetcode.io/problems/reverse-a-linked-list', difficulty: 'Easy' },
      { id: 'w15p2', name: 'Merge Two Sorted Lists', url: 'https://neetcode.io/problems/merge-two-sorted-linked-lists', difficulty: 'Easy' },
      { id: 'w15p3', name: 'Reorder List', url: 'https://neetcode.io/problems/reorder-linked-list', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w16', number: 16, phase: 2, dateRange: 'Jul 6–11', startDate: '2026-07-06', topic: 'Linked Lists',
    problems: [
      { id: 'w16p1', name: 'Remove Nth Node From End', url: 'https://neetcode.io/problems/remove-node-from-end-of-linked-list', difficulty: 'Medium' },
      { id: 'w16p2', name: 'Copy List with Random Pointer', url: 'https://neetcode.io/problems/copy-linked-list-with-random-pointer', difficulty: 'Medium' },
      { id: 'w16p3', name: 'Add Two Numbers', url: 'https://neetcode.io/problems/add-two-numbers', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w17', number: 17, phase: 2, dateRange: 'Jul 13–18', startDate: '2026-07-13', topic: 'Heaps',
    problems: [
      { id: 'w17p1', name: 'Kth Largest Element in a Stream', url: 'https://neetcode.io/problems/kth-largest-integer-in-a-stream', difficulty: 'Easy' },
      { id: 'w17p2', name: 'Last Stone Weight', url: 'https://neetcode.io/problems/last-stone-weight', difficulty: 'Easy' },
      { id: 'w17p3', name: 'K Closest Points to Origin', url: 'https://neetcode.io/problems/k-closest-points-to-origin', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w18', number: 18, phase: 2, dateRange: 'Jul 20–25', startDate: '2026-07-20', topic: 'Heaps',
    problems: [
      { id: 'w18p1', name: 'Kth Largest Element in an Array', url: 'https://neetcode.io/problems/kth-largest-element-in-an-array', difficulty: 'Medium' },
      { id: 'w18p2', name: 'Task Scheduler', url: 'https://neetcode.io/problems/task-scheduling', difficulty: 'Medium' },
      { id: 'w18p3', name: 'Find Median from Data Stream', url: 'https://neetcode.io/problems/find-median-in-a-data-stream', difficulty: 'Hard' },
    ],
  },
  {
    id: 'w19', number: 19, phase: 2, dateRange: 'Jul 27–Aug 1', startDate: '2026-07-27', topic: 'Backtracking',
    problems: [
      { id: 'w19p1', name: 'Subsets', url: 'https://neetcode.io/problems/subsets', difficulty: 'Medium' },
      { id: 'w19p2', name: 'Combination Sum', url: 'https://neetcode.io/problems/combination-target-sum', difficulty: 'Medium' },
      { id: 'w19p3', name: 'Permutations', url: 'https://neetcode.io/problems/permutations', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w20', number: 20, phase: 2, dateRange: 'Aug 3–8', startDate: '2026-08-03', topic: 'Backtracking',
    problems: [
      { id: 'w20p1', name: 'Subsets II', url: 'https://neetcode.io/problems/subsets-ii', difficulty: 'Medium' },
      { id: 'w20p2', name: 'Combination Sum II', url: 'https://neetcode.io/problems/combination-sum-ii', difficulty: 'Medium' },
      { id: 'w20p3', name: 'Word Search', url: 'https://neetcode.io/problems/search-for-word', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w21', number: 21, phase: 2, dateRange: 'Aug 10–15', startDate: '2026-08-10', topic: 'Review',
    problems: [
      { id: 'w21p1', name: 'Longest Common Subsequence (preview)', url: 'https://neetcode.io/problems/longest-common-subsequence', difficulty: 'Medium' },
      { id: 'w21p2', name: 'Number of Islands (preview)', url: 'https://neetcode.io/problems/count-number-of-islands', difficulty: 'Medium' },
      { id: 'w21p3', name: 'LRU Cache (bonus)', url: 'https://neetcode.io/problems/lru-cache', difficulty: 'Medium' },
    ],
  },
  // PHASE 3
  {
    id: 'w22', number: 22, phase: 3, dateRange: 'Aug 16–22', startDate: '2026-08-16', topic: 'Graphs',
    problems: [
      { id: 'w22p1', name: 'Number of Islands', url: 'https://neetcode.io/problems/count-number-of-islands', difficulty: 'Medium' },
      { id: 'w22p2', name: 'Clone Graph', url: 'https://neetcode.io/problems/clone-graph', difficulty: 'Medium' },
      { id: 'w22p3', name: 'Max Area of Island', url: 'https://neetcode.io/problems/max-area-of-island', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w23', number: 23, phase: 3, dateRange: 'Aug 24–29', startDate: '2026-08-24', topic: 'Graphs',
    problems: [
      { id: 'w23p1', name: 'Pacific Atlantic Water Flow', url: 'https://neetcode.io/problems/pacific-atlantic-water-flow', difficulty: 'Medium' },
      { id: 'w23p2', name: 'Surrounded Regions', url: 'https://neetcode.io/problems/surrounded-regions', difficulty: 'Medium' },
      { id: 'w23p3', name: 'Rotting Oranges', url: 'https://neetcode.io/problems/rotting-fruit', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w24', number: 24, phase: 3, dateRange: 'Aug 31–Sep 5', startDate: '2026-08-31', topic: 'Advanced Graphs',
    problems: [
      { id: 'w24p1', name: 'Course Schedule', url: 'https://neetcode.io/problems/course-schedule', difficulty: 'Medium' },
      { id: 'w24p2', name: 'Course Schedule II', url: 'https://neetcode.io/problems/course-schedule-ii', difficulty: 'Medium' },
      { id: 'w24p3', name: 'Redundant Connection', url: 'https://neetcode.io/problems/redundant-connection', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w25', number: 25, phase: 3, dateRange: 'Sep 7–12', startDate: '2026-09-07', topic: 'Advanced Graphs',
    problems: [
      { id: 'w25p1', name: 'Number of Connected Components', url: 'https://neetcode.io/problems/count-connected-components', difficulty: 'Medium' },
      { id: 'w25p2', name: 'Graph Valid Tree', url: 'https://neetcode.io/problems/valid-tree', difficulty: 'Medium' },
      { id: 'w25p3', name: 'Word Ladder', url: 'https://neetcode.io/problems/word-ladder', difficulty: 'Hard' },
    ],
  },
  {
    id: 'w26', number: 26, phase: 3, dateRange: 'Sep 14–19', startDate: '2026-09-14', topic: 'Dynamic Programming',
    problems: [
      { id: 'w26p1', name: 'Climbing Stairs', url: 'https://neetcode.io/problems/climbing-stairs', difficulty: 'Easy' },
      { id: 'w26p2', name: 'Min Cost Climbing Stairs', url: 'https://neetcode.io/problems/min-cost-climbing-stairs', difficulty: 'Easy' },
      { id: 'w26p3', name: 'House Robber', url: 'https://neetcode.io/problems/house-robber', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w27', number: 27, phase: 3, dateRange: 'Sep 21–26', startDate: '2026-09-21', topic: 'Dynamic Programming',
    problems: [
      { id: 'w27p1', name: 'House Robber II', url: 'https://neetcode.io/problems/house-robber-ii', difficulty: 'Medium' },
      { id: 'w27p2', name: 'Longest Palindromic Substring', url: 'https://neetcode.io/problems/longest-palindromic-substring', difficulty: 'Medium' },
      { id: 'w27p3', name: 'Palindromic Substrings', url: 'https://neetcode.io/problems/palindromic-substrings', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w28', number: 28, phase: 3, dateRange: 'Sep 28–Oct 3', startDate: '2026-09-28', topic: 'Dynamic Programming',
    problems: [
      { id: 'w28p1', name: 'Coin Change', url: 'https://neetcode.io/problems/coin-change', difficulty: 'Medium' },
      { id: 'w28p2', name: 'Maximum Product Subarray', url: 'https://neetcode.io/problems/maximum-product-subarray', difficulty: 'Medium' },
      { id: 'w28p3', name: 'Word Break', url: 'https://neetcode.io/problems/word-break', difficulty: 'Medium' },
    ],
  },
  {
    id: 'w29', number: 29, phase: 3, dateRange: 'Oct 5–10', startDate: '2026-10-05', topic: 'DP Hard',
    problems: [
      { id: 'w29p1', name: 'Longest Common Subsequence', url: 'https://neetcode.io/problems/longest-common-subsequence', difficulty: 'Medium' },
      { id: 'w29p2', name: 'Edit Distance', url: 'https://neetcode.io/problems/edit-distance', difficulty: 'Medium' },
      { id: 'w29p3', name: 'Distinct Subsequences', url: 'https://neetcode.io/problems/count-subsequences', difficulty: 'Hard' },
    ],
  },
  {
    id: 'w30', number: 30, phase: 3, dateRange: 'Oct 12–17', startDate: '2026-10-12', topic: 'DP Hard',
    problems: [
      { id: 'w30p1', name: 'Interleaving String', url: 'https://neetcode.io/problems/interleaving-string', difficulty: 'Hard' },
      { id: 'w30p2', name: 'Burst Balloons', url: 'https://neetcode.io/problems/burst-balloons', difficulty: 'Hard' },
      { id: 'w30p3', name: 'Regular Expression Matching', url: 'https://neetcode.io/problems/regular-expression-matching', difficulty: 'Hard' },
    ],
  },
  {
    id: 'w31', number: 31, phase: 3, dateRange: 'Oct 19–Nov 1', startDate: '2026-10-19', topic: 'Tries',
    problems: [
      { id: 'w31p1', name: 'Implement Trie', url: 'https://neetcode.io/problems/implement-prefix-tree', difficulty: 'Medium' },
      { id: 'w31p2', name: 'Design Add and Search Words', url: 'https://neetcode.io/problems/design-word-search-data-structure', difficulty: 'Medium' },
      { id: 'w31p3', name: 'Word Search II', url: 'https://neetcode.io/problems/search-for-word-ii', difficulty: 'Hard' },
    ],
  },
]

export const TOTAL_PROBLEMS = CURRICULUM.reduce((sum, w) => sum + w.problems.length, 0)

export const PHASE_COUNTS = {
  1: CURRICULUM.filter(w => w.phase === 1).reduce((s, w) => s + w.problems.length, 0),
  2: CURRICULUM.filter(w => w.phase === 2).reduce((s, w) => s + w.problems.length, 0),
  3: CURRICULUM.filter(w => w.phase === 3).reduce((s, w) => s + w.problems.length, 0),
}

// Map topics to canonical sidebar categories
export const TOPIC_CATEGORIES: Record<string, string> = {
  'Arrays & Hashmaps': 'Arrays & Hashmaps',
  'Two Pointers': 'Two Pointers',
  'Sliding Window': 'Sliding Window',
  'Stacks': 'Stacks',
  'Binary Search': 'Binary Search',
  'Trees': 'Trees',
  'Linked Lists': 'Linked Lists',
  'Heaps': 'Heaps',
  'Backtracking': 'Backtracking',
  'Graphs': 'Graphs',
  'Advanced Graphs': 'Graphs',
  'Dynamic Programming': 'Dynamic Programming',
  'DP Hard': 'Dynamic Programming',
  'Tries': 'Tries',
  'Review': 'Review',
}

export const SIDEBAR_TOPICS = [
  'Arrays & Hashmaps',
  'Two Pointers',
  'Sliding Window',
  'Stacks',
  'Binary Search',
  'Trees',
  'Linked Lists',
  'Heaps',
  'Backtracking',
  'Graphs',
  'Dynamic Programming',
  'Tries',
]
