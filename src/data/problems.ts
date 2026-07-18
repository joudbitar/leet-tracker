export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type Confidence = 'clean' | 'hints' | 'solution'

export const PATTERNS = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees',
  'Heap / Priority Queue',
  'Backtracking',
  'Tries',
  'Graphs',
  'Advanced Graphs',
  '1-D DP',
  '2-D DP',
  'Greedy',
  'Intervals',
  'Math & Geometry',
  'Bit Manipulation',
] as const
export type Pattern = (typeof PATTERNS)[number]

export interface Problem {
  id: string
  name: string
  url: string
  difficulty: Difficulty
  pattern: Pattern
  /** part of the Blind 75 core — what the planner trims to when time is tight */
  core?: boolean
}

const NC = 'https://neetcode.io/problems/'
const LC = 'https://leetcode.com/problems/'

// NeetCode 150, in roadmap order. Solve top to bottom.
export const PROBLEMS: Problem[] = [
  // Arrays & Hashing
  { id: 'contains-duplicate', name: 'Contains Duplicate', url: `${NC}duplicate-integer`, difficulty: 'Easy', pattern: 'Arrays & Hashing', core: true },
  { id: 'valid-anagram', name: 'Valid Anagram', url: `${NC}is-anagram`, difficulty: 'Easy', pattern: 'Arrays & Hashing', core: true },
  { id: 'two-sum', name: 'Two Sum', url: `${NC}two-integer-sum`, difficulty: 'Easy', pattern: 'Arrays & Hashing', core: true },
  { id: 'group-anagrams', name: 'Group Anagrams', url: `${NC}anagram-groups`, difficulty: 'Medium', pattern: 'Arrays & Hashing', core: true },
  { id: 'top-k-frequent-elements', name: 'Top K Frequent Elements', url: `${NC}top-k-elements-in-list`, difficulty: 'Medium', pattern: 'Arrays & Hashing', core: true },
  { id: 'encode-and-decode-strings', name: 'Encode and Decode Strings', url: `${NC}string-encode-and-decode`, difficulty: 'Medium', pattern: 'Arrays & Hashing', core: true },
  { id: 'product-of-array-except-self', name: 'Product of Array Except Self', url: `${NC}products-of-array-discluding-self`, difficulty: 'Medium', pattern: 'Arrays & Hashing', core: true },
  { id: 'valid-sudoku', name: 'Valid Sudoku', url: `${LC}valid-sudoku/`, difficulty: 'Medium', pattern: 'Arrays & Hashing' },
  { id: 'longest-consecutive-sequence', name: 'Longest Consecutive Sequence', url: `${LC}longest-consecutive-sequence/`, difficulty: 'Medium', pattern: 'Arrays & Hashing', core: true },

  // Two Pointers
  { id: 'valid-palindrome', name: 'Valid Palindrome', url: `${NC}is-palindrome`, difficulty: 'Easy', pattern: 'Two Pointers', core: true },
  { id: 'two-sum-ii', name: 'Two Sum II', url: `${NC}two-integer-sum-ii`, difficulty: 'Medium', pattern: 'Two Pointers' },
  { id: '3sum', name: '3Sum', url: `${NC}three-integer-sum`, difficulty: 'Medium', pattern: 'Two Pointers', core: true },
  { id: 'container-with-most-water', name: 'Container With Most Water', url: `${NC}max-water-container`, difficulty: 'Medium', pattern: 'Two Pointers', core: true },
  { id: 'trapping-rain-water', name: 'Trapping Rain Water', url: `${NC}trapping-rain-water`, difficulty: 'Hard', pattern: 'Two Pointers' },

  // Sliding Window
  { id: 'best-time-to-buy-and-sell-stock', name: 'Best Time to Buy and Sell Stock', url: `${NC}buy-and-sell-crypto`, difficulty: 'Easy', pattern: 'Sliding Window', core: true },
  { id: 'longest-substring-without-repeating-characters', name: 'Longest Substring Without Repeating Characters', url: `${NC}longest-substring-without-duplicates`, difficulty: 'Medium', pattern: 'Sliding Window', core: true },
  { id: 'longest-repeating-character-replacement', name: 'Longest Repeating Character Replacement', url: `${NC}longest-repeating-substring-with-replacement`, difficulty: 'Medium', pattern: 'Sliding Window', core: true },
  { id: 'permutation-in-string', name: 'Permutation in String', url: `${NC}permutation-string`, difficulty: 'Medium', pattern: 'Sliding Window' },
  { id: 'minimum-window-substring', name: 'Minimum Window Substring', url: `${LC}minimum-window-substring/`, difficulty: 'Hard', pattern: 'Sliding Window', core: true },
  { id: 'sliding-window-maximum', name: 'Sliding Window Maximum', url: `${LC}sliding-window-maximum/`, difficulty: 'Hard', pattern: 'Sliding Window' },

  // Stack
  { id: 'valid-parentheses', name: 'Valid Parentheses', url: `${NC}validate-parentheses`, difficulty: 'Easy', pattern: 'Stack', core: true },
  { id: 'min-stack', name: 'Min Stack', url: `${NC}minimum-stack`, difficulty: 'Medium', pattern: 'Stack' },
  { id: 'evaluate-reverse-polish-notation', name: 'Evaluate Reverse Polish Notation', url: `${NC}evaluate-reverse-polish-notation`, difficulty: 'Medium', pattern: 'Stack' },
  { id: 'generate-parentheses', name: 'Generate Parentheses', url: `${NC}generate-parentheses`, difficulty: 'Medium', pattern: 'Stack' },
  { id: 'daily-temperatures', name: 'Daily Temperatures', url: `${NC}daily-temperatures`, difficulty: 'Medium', pattern: 'Stack' },
  { id: 'car-fleet', name: 'Car Fleet', url: `${NC}car-fleet`, difficulty: 'Medium', pattern: 'Stack' },
  { id: 'largest-rectangle-in-histogram', name: 'Largest Rectangle in Histogram', url: `${LC}largest-rectangle-in-histogram/`, difficulty: 'Hard', pattern: 'Stack' },

  // Binary Search
  { id: 'binary-search', name: 'Binary Search', url: `${NC}binary-search`, difficulty: 'Easy', pattern: 'Binary Search' },
  { id: 'search-a-2d-matrix', name: 'Search a 2D Matrix', url: `${NC}search-2d-matrix`, difficulty: 'Medium', pattern: 'Binary Search' },
  { id: 'koko-eating-bananas', name: 'Koko Eating Bananas', url: `${NC}eating-bananas`, difficulty: 'Medium', pattern: 'Binary Search' },
  { id: 'find-minimum-in-rotated-sorted-array', name: 'Find Minimum in Rotated Sorted Array', url: `${NC}find-minimum-in-rotated-sorted-array`, difficulty: 'Medium', pattern: 'Binary Search', core: true },
  { id: 'search-in-rotated-sorted-array', name: 'Search in Rotated Sorted Array', url: `${NC}find-target-in-rotated-sorted-array`, difficulty: 'Medium', pattern: 'Binary Search', core: true },
  { id: 'time-based-key-value-store', name: 'Time Based Key-Value Store', url: `${NC}time-based-key-value-store`, difficulty: 'Medium', pattern: 'Binary Search' },
  { id: 'median-of-two-sorted-arrays', name: 'Median of Two Sorted Arrays', url: `${LC}median-of-two-sorted-arrays/`, difficulty: 'Hard', pattern: 'Binary Search' },

  // Linked List
  { id: 'reverse-linked-list', name: 'Reverse Linked List', url: `${NC}reverse-a-linked-list`, difficulty: 'Easy', pattern: 'Linked List', core: true },
  { id: 'merge-two-sorted-lists', name: 'Merge Two Sorted Lists', url: `${NC}merge-two-sorted-linked-lists`, difficulty: 'Easy', pattern: 'Linked List', core: true },
  { id: 'linked-list-cycle', name: 'Linked List Cycle', url: `${LC}linked-list-cycle/`, difficulty: 'Easy', pattern: 'Linked List', core: true },
  { id: 'reorder-list', name: 'Reorder List', url: `${NC}reorder-linked-list`, difficulty: 'Medium', pattern: 'Linked List', core: true },
  { id: 'remove-nth-node-from-end-of-list', name: 'Remove Nth Node From End of List', url: `${NC}remove-node-from-end-of-linked-list`, difficulty: 'Medium', pattern: 'Linked List', core: true },
  { id: 'copy-list-with-random-pointer', name: 'Copy List with Random Pointer', url: `${NC}copy-linked-list-with-random-pointer`, difficulty: 'Medium', pattern: 'Linked List' },
  { id: 'add-two-numbers', name: 'Add Two Numbers', url: `${NC}add-two-numbers`, difficulty: 'Medium', pattern: 'Linked List' },
  { id: 'find-the-duplicate-number', name: 'Find the Duplicate Number', url: `${LC}find-the-duplicate-number/`, difficulty: 'Medium', pattern: 'Linked List' },
  { id: 'lru-cache', name: 'LRU Cache', url: `${NC}lru-cache`, difficulty: 'Medium', pattern: 'Linked List' },
  { id: 'merge-k-sorted-lists', name: 'Merge K Sorted Lists', url: `${LC}merge-k-sorted-lists/`, difficulty: 'Hard', pattern: 'Linked List', core: true },
  { id: 'reverse-nodes-in-k-group', name: 'Reverse Nodes in K-Group', url: `${LC}reverse-nodes-in-k-group/`, difficulty: 'Hard', pattern: 'Linked List' },

  // Trees
  { id: 'invert-binary-tree', name: 'Invert Binary Tree', url: `${NC}invert-a-binary-tree`, difficulty: 'Easy', pattern: 'Trees', core: true },
  { id: 'maximum-depth-of-binary-tree', name: 'Maximum Depth of Binary Tree', url: `${NC}depth-of-binary-tree`, difficulty: 'Easy', pattern: 'Trees', core: true },
  { id: 'diameter-of-binary-tree', name: 'Diameter of Binary Tree', url: `${NC}binary-tree-diameter`, difficulty: 'Easy', pattern: 'Trees' },
  { id: 'balanced-binary-tree', name: 'Balanced Binary Tree', url: `${NC}balanced-binary-tree`, difficulty: 'Easy', pattern: 'Trees' },
  { id: 'same-tree', name: 'Same Tree', url: `${NC}same-binary-tree`, difficulty: 'Easy', pattern: 'Trees', core: true },
  { id: 'subtree-of-another-tree', name: 'Subtree of Another Tree', url: `${NC}subtree-of-a-binary-tree`, difficulty: 'Easy', pattern: 'Trees', core: true },
  { id: 'lowest-common-ancestor-of-a-bst', name: 'Lowest Common Ancestor of a BST', url: `${NC}lowest-common-ancestor-in-binary-search-tree`, difficulty: 'Medium', pattern: 'Trees', core: true },
  { id: 'binary-tree-level-order-traversal', name: 'Binary Tree Level Order Traversal', url: `${NC}level-order-traversal-of-binary-tree`, difficulty: 'Medium', pattern: 'Trees', core: true },
  { id: 'binary-tree-right-side-view', name: 'Binary Tree Right Side View', url: `${NC}binary-tree-right-side-view`, difficulty: 'Medium', pattern: 'Trees' },
  { id: 'count-good-nodes-in-binary-tree', name: 'Count Good Nodes in Binary Tree', url: `${NC}count-good-nodes-in-binary-tree`, difficulty: 'Medium', pattern: 'Trees' },
  { id: 'validate-binary-search-tree', name: 'Validate Binary Search Tree', url: `${NC}valid-binary-search-tree`, difficulty: 'Medium', pattern: 'Trees', core: true },
  { id: 'kth-smallest-element-in-a-bst', name: 'Kth Smallest Element in a BST', url: `${NC}kth-smallest-integer-in-bst`, difficulty: 'Medium', pattern: 'Trees', core: true },
  { id: 'construct-binary-tree-from-preorder-and-inorder-traversal', name: 'Construct Binary Tree from Preorder and Inorder Traversal', url: `${NC}binary-tree-from-preorder-and-inorder-traversal`, difficulty: 'Medium', pattern: 'Trees', core: true },
  { id: 'binary-tree-maximum-path-sum', name: 'Binary Tree Maximum Path Sum', url: `${NC}binary-tree-maximum-path-sum`, difficulty: 'Hard', pattern: 'Trees', core: true },
  { id: 'serialize-and-deserialize-binary-tree', name: 'Serialize and Deserialize Binary Tree', url: `${NC}serialize-and-deserialize-binary-tree`, difficulty: 'Hard', pattern: 'Trees', core: true },

  // Heap / Priority Queue
  { id: 'kth-largest-element-in-a-stream', name: 'Kth Largest Element in a Stream', url: `${NC}kth-largest-integer-in-a-stream`, difficulty: 'Easy', pattern: 'Heap / Priority Queue' },
  { id: 'last-stone-weight', name: 'Last Stone Weight', url: `${NC}last-stone-weight`, difficulty: 'Easy', pattern: 'Heap / Priority Queue' },
  { id: 'k-closest-points-to-origin', name: 'K Closest Points to Origin', url: `${NC}k-closest-points-to-origin`, difficulty: 'Medium', pattern: 'Heap / Priority Queue' },
  { id: 'kth-largest-element-in-an-array', name: 'Kth Largest Element in an Array', url: `${NC}kth-largest-element-in-an-array`, difficulty: 'Medium', pattern: 'Heap / Priority Queue' },
  { id: 'task-scheduler', name: 'Task Scheduler', url: `${NC}task-scheduling`, difficulty: 'Medium', pattern: 'Heap / Priority Queue' },
  { id: 'design-twitter', name: 'Design Twitter', url: `${LC}design-twitter/`, difficulty: 'Medium', pattern: 'Heap / Priority Queue' },
  { id: 'find-median-from-data-stream', name: 'Find Median from Data Stream', url: `${NC}find-median-in-a-data-stream`, difficulty: 'Hard', pattern: 'Heap / Priority Queue', core: true },

  // Backtracking
  { id: 'subsets', name: 'Subsets', url: `${NC}subsets`, difficulty: 'Medium', pattern: 'Backtracking' },
  { id: 'combination-sum', name: 'Combination Sum', url: `${NC}combination-target-sum`, difficulty: 'Medium', pattern: 'Backtracking', core: true },
  { id: 'permutations', name: 'Permutations', url: `${NC}permutations`, difficulty: 'Medium', pattern: 'Backtracking' },
  { id: 'subsets-ii', name: 'Subsets II', url: `${NC}subsets-ii`, difficulty: 'Medium', pattern: 'Backtracking' },
  { id: 'combination-sum-ii', name: 'Combination Sum II', url: `${NC}combination-sum-ii`, difficulty: 'Medium', pattern: 'Backtracking' },
  { id: 'word-search', name: 'Word Search', url: `${NC}search-for-word`, difficulty: 'Medium', pattern: 'Backtracking', core: true },
  { id: 'palindrome-partitioning', name: 'Palindrome Partitioning', url: `${LC}palindrome-partitioning/`, difficulty: 'Medium', pattern: 'Backtracking' },
  { id: 'letter-combinations-of-a-phone-number', name: 'Letter Combinations of a Phone Number', url: `${LC}letter-combinations-of-a-phone-number/`, difficulty: 'Medium', pattern: 'Backtracking' },
  { id: 'n-queens', name: 'N-Queens', url: `${LC}n-queens/`, difficulty: 'Hard', pattern: 'Backtracking' },

  // Tries
  { id: 'implement-trie', name: 'Implement Trie (Prefix Tree)', url: `${NC}implement-prefix-tree`, difficulty: 'Medium', pattern: 'Tries', core: true },
  { id: 'design-add-and-search-words', name: 'Design Add and Search Words Data Structure', url: `${NC}design-word-search-data-structure`, difficulty: 'Medium', pattern: 'Tries', core: true },
  { id: 'word-search-ii', name: 'Word Search II', url: `${NC}search-for-word-ii`, difficulty: 'Hard', pattern: 'Tries', core: true },

  // Graphs
  { id: 'number-of-islands', name: 'Number of Islands', url: `${NC}count-number-of-islands`, difficulty: 'Medium', pattern: 'Graphs', core: true },
  { id: 'clone-graph', name: 'Clone Graph', url: `${NC}clone-graph`, difficulty: 'Medium', pattern: 'Graphs', core: true },
  { id: 'max-area-of-island', name: 'Max Area of Island', url: `${NC}max-area-of-island`, difficulty: 'Medium', pattern: 'Graphs' },
  { id: 'pacific-atlantic-water-flow', name: 'Pacific Atlantic Water Flow', url: `${NC}pacific-atlantic-water-flow`, difficulty: 'Medium', pattern: 'Graphs', core: true },
  { id: 'surrounded-regions', name: 'Surrounded Regions', url: `${NC}surrounded-regions`, difficulty: 'Medium', pattern: 'Graphs' },
  { id: 'rotting-oranges', name: 'Rotting Oranges', url: `${NC}rotting-fruit`, difficulty: 'Medium', pattern: 'Graphs' },
  { id: 'walls-and-gates', name: 'Walls and Gates', url: `${NC}islands-and-treasure`, difficulty: 'Medium', pattern: 'Graphs' },
  { id: 'course-schedule', name: 'Course Schedule', url: `${NC}course-schedule`, difficulty: 'Medium', pattern: 'Graphs', core: true },
  { id: 'course-schedule-ii', name: 'Course Schedule II', url: `${NC}course-schedule-ii`, difficulty: 'Medium', pattern: 'Graphs' },
  { id: 'redundant-connection', name: 'Redundant Connection', url: `${NC}redundant-connection`, difficulty: 'Medium', pattern: 'Graphs' },
  { id: 'number-of-connected-components', name: 'Number of Connected Components in an Undirected Graph', url: `${NC}count-connected-components`, difficulty: 'Medium', pattern: 'Graphs', core: true },
  { id: 'graph-valid-tree', name: 'Graph Valid Tree', url: `${NC}valid-tree`, difficulty: 'Medium', pattern: 'Graphs', core: true },
  { id: 'word-ladder', name: 'Word Ladder', url: `${NC}word-ladder`, difficulty: 'Hard', pattern: 'Graphs' },

  // Advanced Graphs
  { id: 'reconstruct-itinerary', name: 'Reconstruct Itinerary', url: `${LC}reconstruct-itinerary/`, difficulty: 'Hard', pattern: 'Advanced Graphs' },
  { id: 'min-cost-to-connect-all-points', name: 'Min Cost to Connect All Points', url: `${LC}min-cost-to-connect-all-points/`, difficulty: 'Medium', pattern: 'Advanced Graphs' },
  { id: 'network-delay-time', name: 'Network Delay Time', url: `${LC}network-delay-time/`, difficulty: 'Medium', pattern: 'Advanced Graphs' },
  { id: 'swim-in-rising-water', name: 'Swim in Rising Water', url: `${LC}swim-in-rising-water/`, difficulty: 'Hard', pattern: 'Advanced Graphs' },
  { id: 'alien-dictionary', name: 'Alien Dictionary', url: `${NC}foreign-dictionary`, difficulty: 'Hard', pattern: 'Advanced Graphs', core: true },
  { id: 'cheapest-flights-within-k-stops', name: 'Cheapest Flights Within K Stops', url: `${LC}cheapest-flights-within-k-stops/`, difficulty: 'Medium', pattern: 'Advanced Graphs' },

  // 1-D DP
  { id: 'climbing-stairs', name: 'Climbing Stairs', url: `${NC}climbing-stairs`, difficulty: 'Easy', pattern: '1-D DP', core: true },
  { id: 'min-cost-climbing-stairs', name: 'Min Cost Climbing Stairs', url: `${NC}min-cost-climbing-stairs`, difficulty: 'Easy', pattern: '1-D DP' },
  { id: 'house-robber', name: 'House Robber', url: `${NC}house-robber`, difficulty: 'Medium', pattern: '1-D DP', core: true },
  { id: 'house-robber-ii', name: 'House Robber II', url: `${NC}house-robber-ii`, difficulty: 'Medium', pattern: '1-D DP', core: true },
  { id: 'longest-palindromic-substring', name: 'Longest Palindromic Substring', url: `${NC}longest-palindromic-substring`, difficulty: 'Medium', pattern: '1-D DP', core: true },
  { id: 'palindromic-substrings', name: 'Palindromic Substrings', url: `${NC}palindromic-substrings`, difficulty: 'Medium', pattern: '1-D DP', core: true },
  { id: 'decode-ways', name: 'Decode Ways', url: `${LC}decode-ways/`, difficulty: 'Medium', pattern: '1-D DP', core: true },
  { id: 'coin-change', name: 'Coin Change', url: `${NC}coin-change`, difficulty: 'Medium', pattern: '1-D DP', core: true },
  { id: 'maximum-product-subarray', name: 'Maximum Product Subarray', url: `${NC}maximum-product-subarray`, difficulty: 'Medium', pattern: '1-D DP', core: true },
  { id: 'word-break', name: 'Word Break', url: `${NC}word-break`, difficulty: 'Medium', pattern: '1-D DP', core: true },
  { id: 'longest-increasing-subsequence', name: 'Longest Increasing Subsequence', url: `${LC}longest-increasing-subsequence/`, difficulty: 'Medium', pattern: '1-D DP', core: true },
  { id: 'partition-equal-subset-sum', name: 'Partition Equal Subset Sum', url: `${LC}partition-equal-subset-sum/`, difficulty: 'Medium', pattern: '1-D DP' },

  // 2-D DP
  { id: 'unique-paths', name: 'Unique Paths', url: `${LC}unique-paths/`, difficulty: 'Medium', pattern: '2-D DP', core: true },
  { id: 'longest-common-subsequence', name: 'Longest Common Subsequence', url: `${NC}longest-common-subsequence`, difficulty: 'Medium', pattern: '2-D DP', core: true },
  { id: 'best-time-to-buy-and-sell-stock-with-cooldown', name: 'Best Time to Buy and Sell Stock with Cooldown', url: `${LC}best-time-to-buy-and-sell-stock-with-cooldown/`, difficulty: 'Medium', pattern: '2-D DP' },
  { id: 'coin-change-ii', name: 'Coin Change II', url: `${LC}coin-change-ii/`, difficulty: 'Medium', pattern: '2-D DP' },
  { id: 'target-sum', name: 'Target Sum', url: `${LC}target-sum/`, difficulty: 'Medium', pattern: '2-D DP' },
  { id: 'interleaving-string', name: 'Interleaving String', url: `${NC}interleaving-string`, difficulty: 'Medium', pattern: '2-D DP' },
  { id: 'longest-increasing-path-in-a-matrix', name: 'Longest Increasing Path in a Matrix', url: `${LC}longest-increasing-path-in-a-matrix/`, difficulty: 'Hard', pattern: '2-D DP' },
  { id: 'distinct-subsequences', name: 'Distinct Subsequences', url: `${NC}count-subsequences`, difficulty: 'Hard', pattern: '2-D DP' },
  { id: 'edit-distance', name: 'Edit Distance', url: `${NC}edit-distance`, difficulty: 'Medium', pattern: '2-D DP' },
  { id: 'burst-balloons', name: 'Burst Balloons', url: `${NC}burst-balloons`, difficulty: 'Hard', pattern: '2-D DP' },
  { id: 'regular-expression-matching', name: 'Regular Expression Matching', url: `${NC}regular-expression-matching`, difficulty: 'Hard', pattern: '2-D DP' },

  // Greedy
  { id: 'maximum-subarray', name: 'Maximum Subarray', url: `${LC}maximum-subarray/`, difficulty: 'Medium', pattern: 'Greedy', core: true },
  { id: 'jump-game', name: 'Jump Game', url: `${LC}jump-game/`, difficulty: 'Medium', pattern: 'Greedy', core: true },
  { id: 'jump-game-ii', name: 'Jump Game II', url: `${LC}jump-game-ii/`, difficulty: 'Medium', pattern: 'Greedy' },
  { id: 'gas-station', name: 'Gas Station', url: `${LC}gas-station/`, difficulty: 'Medium', pattern: 'Greedy' },
  { id: 'hand-of-straights', name: 'Hand of Straights', url: `${LC}hand-of-straights/`, difficulty: 'Medium', pattern: 'Greedy' },
  { id: 'merge-triplets-to-form-target-triplet', name: 'Merge Triplets to Form Target Triplet', url: `${LC}merge-triplets-to-form-target-triplet/`, difficulty: 'Medium', pattern: 'Greedy' },
  { id: 'partition-labels', name: 'Partition Labels', url: `${LC}partition-labels/`, difficulty: 'Medium', pattern: 'Greedy' },
  { id: 'valid-parenthesis-string', name: 'Valid Parenthesis String', url: `${LC}valid-parenthesis-string/`, difficulty: 'Medium', pattern: 'Greedy' },

  // Intervals
  { id: 'insert-interval', name: 'Insert Interval', url: `${LC}insert-interval/`, difficulty: 'Medium', pattern: 'Intervals', core: true },
  { id: 'merge-intervals', name: 'Merge Intervals', url: `${LC}merge-intervals/`, difficulty: 'Medium', pattern: 'Intervals', core: true },
  { id: 'non-overlapping-intervals', name: 'Non-overlapping Intervals', url: `${LC}non-overlapping-intervals/`, difficulty: 'Medium', pattern: 'Intervals', core: true },
  { id: 'meeting-rooms', name: 'Meeting Rooms', url: `${NC}meeting-schedule`, difficulty: 'Easy', pattern: 'Intervals', core: true },
  { id: 'meeting-rooms-ii', name: 'Meeting Rooms II', url: `${NC}meeting-schedule-ii`, difficulty: 'Medium', pattern: 'Intervals', core: true },
  { id: 'minimum-interval-to-include-each-query', name: 'Minimum Interval to Include Each Query', url: `${LC}minimum-interval-to-include-each-query/`, difficulty: 'Hard', pattern: 'Intervals' },

  // Math & Geometry
  { id: 'rotate-image', name: 'Rotate Image', url: `${LC}rotate-image/`, difficulty: 'Medium', pattern: 'Math & Geometry', core: true },
  { id: 'spiral-matrix', name: 'Spiral Matrix', url: `${LC}spiral-matrix/`, difficulty: 'Medium', pattern: 'Math & Geometry', core: true },
  { id: 'set-matrix-zeroes', name: 'Set Matrix Zeroes', url: `${LC}set-matrix-zeroes/`, difficulty: 'Medium', pattern: 'Math & Geometry', core: true },
  { id: 'happy-number', name: 'Happy Number', url: `${LC}happy-number/`, difficulty: 'Easy', pattern: 'Math & Geometry' },
  { id: 'plus-one', name: 'Plus One', url: `${LC}plus-one/`, difficulty: 'Easy', pattern: 'Math & Geometry' },
  { id: 'powx-n', name: 'Pow(x, n)', url: `${LC}powx-n/`, difficulty: 'Medium', pattern: 'Math & Geometry' },
  { id: 'multiply-strings', name: 'Multiply Strings', url: `${LC}multiply-strings/`, difficulty: 'Medium', pattern: 'Math & Geometry' },
  { id: 'detect-squares', name: 'Detect Squares', url: `${LC}detect-squares/`, difficulty: 'Medium', pattern: 'Math & Geometry' },

  // Bit Manipulation
  { id: 'single-number', name: 'Single Number', url: `${LC}single-number/`, difficulty: 'Easy', pattern: 'Bit Manipulation' },
  { id: 'number-of-1-bits', name: 'Number of 1 Bits', url: `${LC}number-of-1-bits/`, difficulty: 'Easy', pattern: 'Bit Manipulation', core: true },
  { id: 'counting-bits', name: 'Counting Bits', url: `${LC}counting-bits/`, difficulty: 'Easy', pattern: 'Bit Manipulation', core: true },
  { id: 'reverse-bits', name: 'Reverse Bits', url: `${LC}reverse-bits/`, difficulty: 'Easy', pattern: 'Bit Manipulation', core: true },
  { id: 'missing-number', name: 'Missing Number', url: `${LC}missing-number/`, difficulty: 'Easy', pattern: 'Bit Manipulation', core: true },
  { id: 'sum-of-two-integers', name: 'Sum of Two Integers', url: `${LC}sum-of-two-integers/`, difficulty: 'Medium', pattern: 'Bit Manipulation', core: true },
  { id: 'reverse-integer', name: 'Reverse Integer', url: `${LC}reverse-integer/`, difficulty: 'Medium', pattern: 'Bit Manipulation' },
]

export const TOTAL = PROBLEMS.length
export const CORE_TOTAL = PROBLEMS.filter(p => p.core).length
export const PROBLEM_BY_ID = new Map(PROBLEMS.map(p => [p.id, p]))

// v1 stored progress under week-based ids (w1p1…). Maps them to the stable slugs above.
export const LEGACY_ID_MAP: Record<string, string> = {
  w1p1: 'contains-duplicate', w1p2: 'valid-anagram', w1p3: 'two-sum',
  w2p1: 'group-anagrams', w2p2: 'top-k-frequent-elements', w2p3: 'product-of-array-except-self',
  w3p1: 'valid-palindrome', w3p2: 'two-sum-ii', w3p3: '3sum',
  w4p1: 'container-with-most-water', w4p2: 'trapping-rain-water', w4p3: 'best-time-to-buy-and-sell-stock',
  w5p1: 'longest-substring-without-repeating-characters', w5p2: 'longest-repeating-character-replacement', w5p3: 'permutation-in-string',
  w6p1: 'valid-parentheses', w6p2: 'min-stack', w6p3: 'evaluate-reverse-polish-notation',
  w7p1: 'generate-parentheses', w7p2: 'daily-temperatures', w7p3: 'car-fleet',
  w8p1: 'binary-search', w8p2: 'search-a-2d-matrix', w8p3: 'koko-eating-bananas',
  w9p1: 'find-minimum-in-rotated-sorted-array', w9p2: 'search-in-rotated-sorted-array', w9p3: 'time-based-key-value-store',
  w10p1: 'invert-binary-tree', w10p2: 'maximum-depth-of-binary-tree', w10p3: 'diameter-of-binary-tree',
  w11p1: 'balanced-binary-tree', w11p2: 'same-tree', w11p3: 'subtree-of-another-tree',
  w12p1: 'lowest-common-ancestor-of-a-bst', w12p2: 'binary-tree-level-order-traversal', w12p3: 'binary-tree-right-side-view',
  w13p1: 'count-good-nodes-in-binary-tree', w13p2: 'validate-binary-search-tree', w13p3: 'kth-smallest-element-in-a-bst',
  w14p1: 'construct-binary-tree-from-preorder-and-inorder-traversal', w14p2: 'binary-tree-maximum-path-sum', w14p3: 'serialize-and-deserialize-binary-tree',
  w15p1: 'reverse-linked-list', w15p2: 'merge-two-sorted-lists', w15p3: 'reorder-list',
  w16p1: 'remove-nth-node-from-end-of-list', w16p2: 'copy-list-with-random-pointer', w16p3: 'add-two-numbers',
  w17p1: 'kth-largest-element-in-a-stream', w17p2: 'last-stone-weight', w17p3: 'k-closest-points-to-origin',
  w18p1: 'kth-largest-element-in-an-array', w18p2: 'task-scheduler', w18p3: 'find-median-from-data-stream',
  w19p1: 'subsets', w19p2: 'combination-sum', w19p3: 'permutations',
  w20p1: 'subsets-ii', w20p2: 'combination-sum-ii', w20p3: 'word-search',
  w21p1: 'longest-common-subsequence', w21p2: 'number-of-islands', w21p3: 'lru-cache',
  w22p1: 'number-of-islands', w22p2: 'clone-graph', w22p3: 'max-area-of-island',
  w23p1: 'pacific-atlantic-water-flow', w23p2: 'surrounded-regions', w23p3: 'rotting-oranges',
  w24p1: 'course-schedule', w24p2: 'course-schedule-ii', w24p3: 'redundant-connection',
  w25p1: 'number-of-connected-components', w25p2: 'graph-valid-tree', w25p3: 'word-ladder',
  w26p1: 'climbing-stairs', w26p2: 'min-cost-climbing-stairs', w26p3: 'house-robber',
  w27p1: 'house-robber-ii', w27p2: 'longest-palindromic-substring', w27p3: 'palindromic-substrings',
  w28p1: 'coin-change', w28p2: 'maximum-product-subarray', w28p3: 'word-break',
  w29p1: 'longest-common-subsequence', w29p2: 'edit-distance', w29p3: 'distinct-subsequences',
  w30p1: 'interleaving-string', w30p2: 'burst-balloons', w30p3: 'regular-expression-matching',
  w31p1: 'implement-trie', w31p2: 'design-add-and-search-words', w31p3: 'word-search-ii',
}
