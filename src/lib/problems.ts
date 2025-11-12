
import { z } from 'zod';

export const CategorySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  // helpful for menus and curriculum pacing
  order: z.number().int().nonnegative(),
  // guardrails for typical difficulty range of problems in this category
  levelMin: z.number().int().min(1).max(10),
  levelMax: z.number().int().min(1).max(10),
  topics: z.array(z.string()).default([]), // optional labels for UI filters
});

export type Category = z.infer<typeof CategorySchema>;

export const categories: Category[] = [
  { slug: "warm-ups", title: "Warm-ups", description: "Basic loops, scans, and simple string/array tasks.", order: 0, levelMin: 1, levelMax: 2, topics: ["Arrays","Strings"] },
  { slug: "hashing", title: "Hashing & Counting", description: "Hash maps/sets, frequency tables, canonicalization.", order: 1, levelMin: 2, levelMax: 5, topics: ["Hash Map","Hash Set","Counting","Prefix Sum"] },
  { slug: "stacks", title: "Stacks & Queues", description: "Stacks, bracket matching, stateful scans.", order: 2, levelMin: 2, levelMax: 6, topics: ["Stack","Strings"] },
  { slug: "two-pointers", title: "Two-Pointers & Windows", description: "Pointers, windows, de-duplication.", order: 3, levelMin: 3, levelMax: 6, topics: ["Two Pointer","Sliding Window"] },
  { slug: "linked-lists", title: "Linked Lists", description: "Fast/slow pointers, list reversal, cycle detection.", order: 4, levelMin: 1, levelMax: 5, topics: ["Linked List", "Two Pointer"]},
  { slug: "cyclic-sort", title: "Cyclic Sort", description: "In-place sorting for 1-to-N arrays, finding duplicates/missing.", order: 5, levelMin: 3, levelMax: 6, topics: ["Sorting", "Array"]},
  { slug: "sets-ordering", title: "Sets & Ordering", description: "Ordering, merging, interval sweeps.", order: 6, levelMin: 4, levelMax: 5, topics: ["Sorting","Sweep","Set"] },
  { slug: "greedy-intervals", title: "Greedy & Intervals", description: "Greedy choices, interval management.", order: 7, levelMin: 4, levelMax: 6, topics: ["Greedy","Intervals","Sorting"] },
  { slug: "recursion-dp", title: "Recursion & Backtracking", description: "Recurrence intuition, memoization, simple DP.", order: 8, levelMin: 2, levelMax: 8, topics: ["Recursion","DP","Math", "Backtracking"] },
  { slug: "trees", title: "Trees (DFS/BFS)", description: "Traversal patterns and basic tree properties.", order: 9, levelMin: 2, levelMax: 6, topics: ["Tree","DFS","BFS"] },
  { slug: "heaps", title: "Heaps & Priority Queues", description: "Selection, k-way merge, top-k.", order: 10, levelMin: 4, levelMax: 7, topics: ["Heap","Priority Queue"] },
  { slug: "graphs", title: "Graphs & Topo Sort", description: "Cycle detection, topo order, reachability.", order: 11, levelMin: 5, levelMax: 7, topics: ["Graph","Topo Sort","DFS"] },
  { slug: "grids-backtracking", title: "Grids & Backtracking", description: "Grid search, constraint propagation.", order: 12, levelMin: 5, levelMax: 8, topics: ["Grid","Backtracking","DFS"] },
  { slug: "math-bit-tricks", title: "Math & Bit Tricks", description: "Number theory, bitwise operations.", order: 13, levelMin: 4, levelMax: 7, topics: ["Math","Bit Manipulation"] },
  { slug: "advanced-binary-search", title: "Advanced Binary Search", description: "Partitioning tricks on answers/arrays.", order: 14, levelMin: 5, levelMax: 9, topics: ["Binary Search"] },
];

// Represents the data stored in the main `problems/{slug}` document.
// The `testCases` array is removed from here.
export const ProblemSchema = z.object({
  slug: z.string().min(1, 'Slug is required.'),
  title: z.string().min(1, 'Title is required.'),
  summary: z.string().min(1, 'Summary is required.'),
  // switch from 'Easy|Medium|Hard' -> 1..10
  difficulty: z.number().int().min(1).max(10),
  // single canonical category to avoid duplication when listing
  categorySlug: z.string().min(1, 'Category is required.'),
  // The name of the function to be tested
  entryPoint: z.string().min(1, 'Entry point is required.'),
  // keep tags for search/facets; they can repeat across problems
  tags: z.array(z.string()).min(1, 'At least one tag is required.'),
  body: z.string().min(1, 'Problem body is required.'),
  templateCode: z.string().min(1, 'Template code is required.'),
  // New property to indicate problem type
  problemType: z.enum(['default', 'linked-list']).default('default'),
});

export type Problem = z.infer<typeof ProblemSchema>;

// Represents the data for a document in the `problems/{slug}/testCases` subcollection.
export const TestCaseSchema = z.object({
  problemId: z.string().optional(), // Not always present on the object
  // Inputs and outputs are stored as JSON strings
  input: z.string(),
  output: z.string(),
});

export type TestCase = z.infer<typeof TestCaseSchema>;


export const SubmissionSchema = z.object({
  id: z.string().optional(),
  problemId: z.string(),
  userId: z.string(),
  code: z.string(),
  submittedAt: z.string(),
  isCorrect: z.boolean(),
  aiSuggestion: z.string().optional(),
});

export type Submission = z.infer<typeof SubmissionSchema>;

export const problemsForSeeding: (Omit<Problem, 'tags'> & { tags: string[]; testCases: { input: any[]; output: any, compare?: string }[] })[] = [
  // ==========================================
  // PHASE 1: WARM-UP - Basic Arrays & Loops
  // ==========================================
  
  {
    slug: 'has-any-common',
    title: 'Has Any Common Element',
    summary: 'Return whether two lists share any common elements.',
    difficulty: 1,
    tags: ['Set', 'Loop'],
    categorySlug: 'hashing',
    entryPoint: 'has_any_common',
    body:
      'Write a function, `has_any_common`, that takes in two lists, `a` and `b`, as arguments. ' +
      'The function should return `True` if the lists share at least one common element, and `False` otherwise.\n\n' +
      'For an efficient solution, convert one of the lists to a set for O(1) lookups.',
    templateCode:
      `def has_any_common(a, b):
  # Your code here
  pass`,
    testCases: [
      { input: [[1, 2, 3], [4, 5, 6]], output: false },
      { input: [[1, 2, 3], [3, 4, 5]], output: true },
      { input: [['a', 'b'], ['c', 'd', 'b']], output: true },
      { input: [[], [1, 2]], output: false },
      { input: [[1, 2], []], output: false }
    ],
  },
  
  {
    slug: 'max-value',
    title: 'Max Value',
    summary: 'Return the largest number in the list.',
    difficulty: 1,
    tags: ['Array', 'Loop'],
    categorySlug: 'warm-ups',
    entryPoint: 'max_value',
    body:
      'Write a function, `max_value`, that takes in a list of numbers as an argument. ' +
      'The function should return the largest number in the list.\n\n' +
      'Assume the list is non-empty.',
    templateCode:
      `def max_value(nums):
  # Your code here
  pass`,
    testCases: [
      { input: [[5, 3, 9, 2]], output: 9 },
      { input: [[-5, -1, -10]], output: -1 },
      { input: [[1]], output: 1 },
      { input: [[7, 7, 7]], output: 7 },
      { input: [[0, -1, -2]], output: 0 }
    ],
  },

  {
    slug: 'sum-list',
    title: 'Sum List',
    summary: 'Return the sum of all numbers in the list.',
    difficulty: 1,
    tags: ['Array', 'Loop'],
    categorySlug: 'warm-ups',
    entryPoint: 'sum_list',
    body:
      'Write a function, `sum_list`, that takes in a list of numbers as an argument. ' +
      'The function should return the total sum of all numbers in the list.',
    templateCode:
      `def sum_list(nums):
  # Your code here
  pass`,
    testCases: [
      { input: [[1, 2, 3, 4]], output: 10 },
      { input: [[5, -3, 2]], output: 4 },
      { input: [[0, 0, 0]], output: 0 },
      { input: [[-1, -2, -3]], output: -6 },
      { input: [[100]], output: 100 }
    ],
  },

  {
    slug: 'longest-word',
    title: 'Longest Word',
    summary: 'Return the longest word in a sentence; ties go to the later word.',
    difficulty: 2,
    tags: ['String', 'Loop'],
    categorySlug: 'warm-ups',
    entryPoint: 'longest_word',
    body:
      'Write a function, `longest_word`, that takes in a sentence string as an argument. ' +
      'The function should return the longest word in the sentence. If there is a tie, return the word that occurs later in the sentence.\n\n' +
      'Assume the sentence is non-empty and words are space-separated.',
    templateCode:
      `def longest_word(sentence):
  # Your code here
  pass`,
    testCases: [
      { input: ['what a wonderful world'], output: 'wonderful' },
      { input: ['have a nice day'], output: 'nice' },
      { input: ['the quick brown fox jumped over the lazy dog'], output: 'jumped' },
      { input: ['who did eat the ham'], output: 'ham' },
      { input: ['potato'], output: 'potato' },
      { input: ['a ab abc abd'], output: 'abd' }
    ],
  },

  {
    slug: 'intersection',
    title: 'Intersection',
    summary: 'Return the elements common to both lists.',
    difficulty: 2,
    tags: ['Array', 'Set'],
    categorySlug: 'warm-ups',
    entryPoint: 'intersection',
    body:
      'Write a function, `intersection`, that takes in two lists, `a` and `b`, as arguments. ' +
      'The function should return a new list containing elements that are in **both** of the two lists.\n\n' +
      'You may assume that each input list does **not** contain duplicate elements.\n' +
      'Return the result in the order those elements appear in the first list `a`.',
    templateCode:
      `def intersection(a, b):
  # Your code here
  pass`,
    testCases: [
      { input: [[1, 2, 3], [2, 3, 4]], output: [2, 3] },
      { input: [[4, 2, 1], [1, 2, 4]], output: [4, 2, 1] },
      { input: [[1, 2, 3], [4, 5, 6]], output: [] },
      { input: [['a', 'b', 'c'], ['b', 'x']], output: ['b'] },
      { input: [[], [1, 2, 3]], output: [] }
    ],
  },
  
  {
    slug: 'dedupe-preserve-order',
    title: 'Deduplicate & Preserve Order',
    summary: 'Remove duplicates from a list while keeping the original order.',
    difficulty: 2,
    tags: ['Set', 'Array'],
    categorySlug: 'hashing',
    entryPoint: 'dedupe_preserve_order',
    body:
      'Write a function `dedupe_preserve_order` that takes a list of items and returns a new list with duplicates removed. ' +
      'The order of the first appearance of each element should be preserved.\n\n' +
      'For example, `[1, 5, 2, 1, 9, 2]` should return `[1, 5, 2, 9]`. Use a `set` to keep track of seen elements for an efficient O(n) solution.',
    templateCode:
      `def dedupe_preserve_order(items):
  # Your code here
  pass`,
    testCases: [
      { input: [[1, 5, 2, 1, 9, 2]], output: [1, 5, 2, 9] },
      { input: [['a', 'b', 'a', 'c', 'b']], output: ['a', 'b', 'c'] },
      { input: [[1, 2, 3]], output: [1, 2, 3] },
      { input: [[4, 4, 4, 4]], output: [4] },
      { input: [[]], output: [] },
    ],
  },

  // ==========================================
  // PHASE 2: Hash Maps & Counting (Easy)
  // ==========================================

  {
    slug: 'two-sum',
    title: 'Two Sum',
    summary: 'Find two numbers in an array that add up to a specific target.',
    difficulty: 2,
    tags: ['Array', 'Hash Map'],
    categorySlug: 'hashing',
    entryPoint: 'two_sum',
    body: `Given an array of integers \`nums\` and an integer \`target\`, return indices \`i\` and \`j\` such that \`nums[i] + nums[j] = target\`.

### Requirements
- You may assume that each input has **exactly one solution**.
- You may not use the same element twice.
- Return the indices as \`[i, j]\`.`,
    templateCode:
      `def two_sum(nums, target):
  # Your code here
  pass`,
    testCases: [
      { input: [[2, 7, 11, 15], 9], output: [0, 1], compare: "unordered_list" },
      { input: [[3, 2, 4], 6], output: [1, 2], compare: "unordered_list" },
      { input: [[3, 3], 6], output: [0, 1], compare: "unordered_list" },
      { input: [[-1, -2, -3, -4, -5], -8], output: [2, 4], compare: "unordered_list" },
      { input: [[0, 4, 3, 0], 0], output: [0, 3], compare: "unordered_list" }
    ],
  },

  {
    slug: 'most-frequent-char',
    title: 'Most Frequent Character',
    summary: 'Return the most frequent character; ties go to earliest appearance.',
    difficulty: 2,
    tags: ['String', 'Counting'],
    categorySlug: 'hashing',
    entryPoint: 'most_frequent_char',
    body:
      'Write a function, `most_frequent_char`, that takes in a string as an argument. ' +
      'The function should return the most frequent character of the string. ' +
      'If there are ties, return the character that appears earlier in the string.\n\n' +
      'Assume the input is a non-empty ASCII string.',
    templateCode:
      `def most_frequent_char(s):
  # Your code here
  pass`,
    testCases: [
      { input: ['bookeeper'], output: 'e' },
      { input: ['mississippi'], output: 'i' },
      { input: ['abc'], output: 'a' },
      { input: ['aabbccdde'], output: 'a' },
      { input: ['zzzza'], output: 'z' }
    ],
  },

  {
    slug: 'anagrams',
    title: 'Anagrams',
    summary: 'Return whether two strings are anagrams.',
    difficulty: 2,
    tags: ['String', 'Hash Map', 'Counting'],
    categorySlug: 'hashing',
    entryPoint: 'are_anagrams',
    body:
      'Write a function, `are_anagrams`, that takes in two strings as arguments. ' +
      'The function should return a boolean indicating whether or not the strings are anagrams. ' +
      'Anagrams are strings that contain the same characters, but in any order.\n\n' +
      'Assume ASCII and ignore spaces; compare case-insensitively.',
    templateCode:
      `def are_anagrams(s1, s2):
  # Your code here
  pass`,
    testCases: [
      { input: ['restful', 'fluster'], output: true },
      { input: ['listen', 'silent'], output: true },
      { input: ['cats', 'tocs'], output: false },
      { input: ['monkeys', 'donkeys'], output: false },
      { input: ['paper', 'reapp'], output: true },
      { input: ['Dormitory', 'dirty room'], output: true },
      { input: ['', ''], output: true }
    ],
  },
  
  {
    slug: 'anagram-signature',
    title: 'Anagram Signature',
    summary: 'Return a "signature" for a word, like its sorted form or character counts.',
    difficulty: 3,
    tags: ['String', 'Sorting', 'Counting'],
    categorySlug: 'hashing',
    entryPoint: 'anagram_signature',
    body: 'Write a function that takes a word and returns its "anagram signature". This can be either the string with its characters sorted, or a tuple representing the counts of each letter from a-z. The sorted string is simpler to implement.\n\nFor example, `signature("eat")` could be `"aet"`. This is a key building block for grouping anagrams.',
    templateCode: `def anagram_signature(word):
  # Return the "signature" of the word.
  # For example, sorting the characters: 'eat' -> 'aet'
  pass`,
    testCases: [
      { input: ['eat'], output: 'aet' },
      { input: ['tea'], output: 'aet' },
      { input: ['zyxw'], output: 'wxyz' },
      { input: ['hello'], output: 'ehllo' },
    ]
  },
  
  {
    slug: 'set-diff-indices',
    title: 'Set Difference Indices',
    summary: 'Return indices of items in list `a` that are not in list `b`.',
    difficulty: 3,
    tags: ['Set', 'Array'],
    categorySlug: 'hashing',
    entryPoint: 'set_diff_indices',
    body:
      'Write a function, `set_diff_indices`, that takes two lists, `a` and `b`. ' +
      'It should return a new list containing the **indices** of elements from list `a` that are **not** present in list `b`.\n\n' +
      'Use a `set` for list `b` to achieve an efficient O(1) average time complexity for membership checking.',
    templateCode:
      `def set_diff_indices(a, b):
  # Your code here
  pass`,
    testCases: [
      { input: [[1, 2, 3, 4], [3, 4, 5, 6]], output: [0, 1] },
      { input: [['x', 'y', 'z'], ['a', 'b', 'c']], output: [0, 1, 2] },
      { input: [[10, 20, 30], [10, 20, 30]], output: [] },
      { input: [[10, 10, 20], [20]], output: [0, 1] },
      { input: [[], [1, 2]], output: [] },
    ],
  },
  
  {
    slug: 'relative-sort-array',
    title: 'Relative Sort Array',
    summary: 'Sort an array based on the order of another array.',
    difficulty: 3,
    tags: ['Sorting', 'Hash Map', 'Counting'],
    categorySlug: 'sets-ordering',
    entryPoint: 'relative_sort_array',
    body: 'Given two arrays, `arr1` and `arr2`, `arr2` contains distinct elements, and all of its elements are also in `arr1`.\n\nSort the elements of `arr1` such that the relative ordering of items in `arr1` is the same as in `arr2`. Elements that do not appear in `arr2` should be placed at the end of `arr1` in **ascending** order.',
    templateCode:
`def relative_sort_array(arr1, arr2):
  # Your code here
  pass
`,
    testCases: [
      { input: [[2,3,1,3,2,4,6,7,9,2,19], [2,1,4,3,9,6]], output: [2,2,2,1,4,3,3,9,6,7,19] },
      { input: [[28,6,22,8,44,17], [22,28,8,6]], output: [22,28,8,6,17,44] }
    ]
  },

  {
    slug: 'ransom-note',
    title: 'Ransom Note',
    summary: 'Determine if a ransom note can be constructed from a magazine.',
    difficulty: 3,
    tags: ['String', 'Hash Map', 'Counting'],
    categorySlug: 'hashing',
    entryPoint: 'can_construct',
    body:
      'Given two strings, `ransomNote` and `magazine`, return `True` if `ransomNote` can be constructed from the characters in `magazine`, and `False` otherwise.\n\n' +
      'Each character in `magazine` can only be used once in `ransomNote`.',
    templateCode:
      `def can_construct(ransomNote, magazine):
  # Your code here
  pass`,
    testCases: [
      { input: ['a', 'b'], output: false },
      { input: ['aa', 'ab'], output: false },
      { input: ['aa', 'aab'], output: true },
      { input: ['aab', 'baa'], output: true },
      { input: ['hello', 'lol he'], output: true }
    ],
  },

  {
    slug: 'isomorphic-strings',
    title: 'Isomorphic Strings',
    summary: 'Check if there is a one-to-one character mapping between two strings.',
    difficulty: 4,
    tags: ['String', 'Hash Map'],
    categorySlug: 'hashing',
    entryPoint: 'is_isomorphic',
    body:
      'Given two strings `s` and `t`, determine if they are isomorphic.\n\n' +
      'Two strings `s` and `t` are isomorphic if the characters in `s` can be replaced to get `t`.\n\n' +
      'All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.',
    templateCode:
      `def is_isomorphic(s, t):
  # Your code here
  pass`,
    testCases: [
      { input: ['egg', 'add'], output: true },
      { input: ['foo', 'bar'], output: false },
      { input: ['paper', 'title'], output: true },
      { input: ['ab', 'ca'], output: true },
      { input: ['badc', 'baba'], output: false }
    ],
  },
  
  {
    slug: 'two-sum-exists',
    title: 'Two Sum Exists',
    summary: 'Return a boolean indicating if two numbers sum to a target.',
    difficulty: 4,
    tags: ['Set', 'Array'],
    categorySlug: 'hashing',
    entryPoint: 'two_sum_exists',
    body:
      'Write a function, `two_sum_exists`, that takes a list of numbers `nums` and a `target`. ' +
      'The function should return `True` if there exist two numbers in the list that sum up to the `target`, and `False` otherwise.\n\n' +
      'Use a `set` to solve this in O(n) time by checking for the existence of `target - num` as you iterate through the list.',
    templateCode:
      `def two_sum_exists(nums, target):
  # Your code here
  pass`,
    testCases: [
      { input: [[2, 7, 11, 15], 9], output: true },
      { input: [[3, 2, 4], 6], output: true },
      { input: [[3, 3], 6], output: true },
      { input: [[1, 5, 9], 15], output: false },
      { input: [[-1, 5, -2, 8], 6], output: true },
      { input: [[10], 20], output: false },
    ],
  },
  
  // ==========================================
  // PHASE 3: Strings & Basic Algorithms
  // ==========================================

  {
    slug: 'reverse-string-iterative',
    title: 'Reverse String',
    summary: 'Write a function that reverses a string using iteration.',
    difficulty: 1,
    tags: ['String', 'Two Pointer'],
    categorySlug: 'warm-ups',
    entryPoint: 'reverse_string',
    body: `Write a function that reverses a string. Use an iterative approach.

For example, \`reverse_string("hello")\` should return \`"olleh"\`.`,
    templateCode:
      `def reverse_string(s):
  # Your code here
  pass`,
    testCases: [
      { input: ['hello'], output: 'olleh' },
      { input: ['world'], output: 'dlrow' },
      { input: [''], output: '' },
      { input: ['a'], output: 'a' },
      { input: ['racecar'], output: 'racecar' },
      { input: ['  ab!'], output: '!ba  ' }
    ],
  },

  {
    slug: 'is-palindrome',
    title: 'Is Palindrome',
    summary: 'Check if a string reads the same forwards and backwards.',
    difficulty: 2,
    tags: ['String', 'Two Pointer'],
    categorySlug: 'warm-ups',
    entryPoint: 'is_palindrome',
    body:
      'Write a function, `is_palindrome`, that takes in a string as an argument. ' +
      'The function should return a boolean indicating whether or not the string is a palindrome.\n\n' +
      'A palindrome is a string that reads the same forwards and backwards.',
    templateCode:
      `def is_palindrome(s):
  # Your code here
  pass`,
    testCases: [
      { input: ['racecar'], output: true },
      { input: ['hello'], output: false },
      { input: ['a'], output: true },
      { input: [''], output: true },
      { input: ['abba'], output: true },
      { input: ['abcba'], output: true },
      { input: ['kayak'], output: true }
    ],
  },

  {
    slug: 'is-prime',
    title: 'Is Prime',
    summary: 'Return whether a number is prime.',
    difficulty: 3,
    tags: ['Math', 'Primality', 'Loop'],
    categorySlug: 'recursion-dp',
    entryPoint: 'is_prime',
    body:
      'Write a function, `is_prime`, that takes in a number `n` as an argument. ' +
      'The function should return a boolean indicating whether or not `n` is prime.\n\n' +
      'A prime number is an integer greater than 1 with no positive divisors other than 1 and itself.',
    templateCode:
      `def is_prime(n):
  # Your code here
  pass`,
    testCases: [
      { input: [2], output: true },
      { input: [3], output: true },
      { input: [4], output: false },
      { input: [1], output: false },
      { input: [0], output: false },
      { input: [-7], output: false },
      { input: [97], output: true }
    ],
  },

  // ==========================================
  // PHASE 4: Stack Introduction
  // ==========================================

  {
    slug: 'paired-parentheses',
    title: 'Paired Parentheses',
    summary: 'Check if parentheses in a string are properly paired using a counter.',
    difficulty: 2,
    tags: ['Stack', 'String'],
    categorySlug: 'stacks',
    entryPoint: 'paired_parentheses',
    body:
      'Write a function, `paired_parentheses`, that takes in a string as an argument. ' +
      'The function should return a boolean indicating whether or not the string has well-formed parentheses.\n\n' +
      'You only need to consider `(` and `)`. Use a simple counter approach.',
    templateCode:
      `def paired_parentheses(s):
  # Your code here
  pass`,
    testCases: [
      { input: ['(hello)'], output: true },
      { input: ['(()())'], output: true },
      { input: ['(('], output: false },
      { input: ['))'], output: false },
      { input: ['(hello)(world)'], output: true },
      { input: ['()()'], output: true },
      { input: [''], output: true }
    ],
  },

  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    summary: 'Determine if a string of brackets is valid and well-formed using a stack.',
    difficulty: 3,
    tags: ['Stack', 'String'],
    categorySlug: 'stacks',
    entryPoint: 'is_valid_parentheses',
    body: `Given a string \`s\` containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    templateCode:
      `def is_valid_parentheses(s):
  # Your code here
  pass`,
    testCases: [
      { input: ['()'], output: true },
      { input: ['()[]{}'], output: true },
      { input: ['(]'], output: false },
      { input: ['([)]'], output: false },
      { input: ['{[]}'], output: true },
      { input: [''], output: true },
      { input: [']'], output: false }
    ],
  },

  {
    slug: 'next-greater-element-i',
    title: 'Next Greater Element I',
    summary: 'Find the next greater element for each element of a first array in a second array.',
    difficulty: 4,
    tags: ['Stack', 'Array', 'Monotonic Stack', 'Hash Map'],
    categorySlug: 'stacks',
    entryPoint: 'next_greater_element',
    body: `You are given two distinct 0-indexed integer arrays \`nums1\` and \`nums2\`, where \`nums1\` is a subset of \`nums2\`.

For each \`0 <= i < nums1.length\`, find the index \`j\` such that \`nums1[i] == nums2[j]\` and determine the **next greater element** of \`nums2[j]\` in \`nums2\`. If there is no next greater element, the answer for this query is \`-1\`.

Return an array \`ans\` of length \`nums1.length\` such that \`ans[i]\` is the next greater element as described above.

This can be solved efficiently by first computing the next greater element for all numbers in \`nums2\` using a monotonic stack.`,
    templateCode:
`import collections

def next_greater_element(nums1, nums2):
  # Your code here
  pass
`,
    testCases: [
        { input: [[4,1,2], [1,3,4,2]], output: [-1,3,-1] },
        { input: [[2,4], [1,2,3,4]], output: [3,-1] },
        { input: [[1,3,5,2,4], [6,5,4,3,2,1,7]], output: [7,7,7,7,7] },
    ],
  },

  {
    slug: 'simplify-path',
    title: 'Simplify Path',
    summary: 'Given a Unix-style absolute path, simplify it.',
    difficulty: 4,
    tags: ['Stack', 'String'],
    categorySlug: 'stacks',
    entryPoint: 'simplify_path',
    body: `Given a string \`path\`, which is an absolute path (starting with a slash '/') to a file or directory in a Unix-style file system, convert it to the simplified canonical path.

In a Unix-style file system:
- A period \`.\` refers to the current directory.
- A double period \`..\` refers to the directory up a level.
- Any multiple consecutive slashes (i.e. \`//\`) are treated as a single slash \`/\`.

The canonical path should have the following format:
- The path starts with a single slash \`/\`.
- Any two directories are separated by a single slash \`/\`.
- The path does not end with a trailing \`/\`.
- The path only contains the directory names on the path from the root directory to the target directory (i.e., no \`.\` or \`..\`).`,
    templateCode:
      `def simplify_path(path):
  # Your code here
  pass`,
    testCases: [
        { input: ['/home/'], output: '/home' },
        { input: ['/../'], output: '/' },
        { input: ['/home//foo/'], output: '/home/foo' },
        { input: ['/a/./b/../../c/'], output: '/c' },
    ],
  },

  {
    slug: 'min-stack',
    title: 'Min Stack',
    summary: 'Design a stack that supports retrieving the minimum element in O(1) time.',
    difficulty: 4,
    tags: ['Stack', 'Design'],
    categorySlug: 'stacks',
    entryPoint: 'MinStack', // This will be a class
    body: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Implement the \`MinStack\` class:
- \`MinStack()\` initializes the stack object.
- \`push(val)\` pushes the element \`val\` onto the stack.
- \`pop()\` removes the element on the top of the stack.
- \`top()\` gets the top element of the stack.
- \`getMin()\` retrieves the minimum element in the stack.

You must implement a solution with O(1) time complexity for each function. This problem is tested differently; your class will be instantiated and its methods called sequentially. The test cases show the sequence of operations and expected outputs.`,
    templateCode:
`# The framework will instantiate your class 
# and call its methods.
class MinStack:
    def __init__(self):
        # Your code here
        pass

    def push(self, val: int) -> None:
        # Your code here
        pass

    def pop(self) -> None:
        # Your code here
        pass

    def top(self) -> int:
        # Your code here
        pass

    def getMin(self) -> int:
        # Your code here
        pass
`,
    testCases: [
        { input: [
            ["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"],
            [[], [-2], [0], [-3], [], [], [], []]
          ], 
          output: [null, null, null, null, -3, null, 0, -2] },
        { input: [
            ["MinStack", "push", "push", "getMin", "top", "pop", "getMin"],
            [[], [0], [-1], [], [], [], []]
          ],
          output: [null, null, null, -1, -1, null, 0]
        }
    ],
  },
  
  {
    slug: 'daily-temperatures',
    title: 'Daily Temperatures',
    summary: 'Find how many days you have to wait for a warmer temperature.',
    difficulty: 5,
    tags: ['Stack', 'Array', 'Monotonic Stack'],
    categorySlug: 'stacks',
    entryPoint: 'daily_temperatures',
    body: `Given an array of integers \`temperatures\` representing the daily temperatures, return an array \`answer\` such that \`answer[i]\` is the number of days you have to wait after the \`i\`-th day to get a warmer temperature.

If there is no future day for which this is possible, keep \`answer[i] == 0\` instead.

This is a classic "monotonic stack" problem.`,
    templateCode:
`def daily_temperatures(temperatures):
  # Your code here
  pass
`,
    testCases: [
        { input: [[73,74,75,71,69,72,76,73]], output: [1,1,4,2,1,1,0,0] },
        { input: [[30,40,50,60]], output: [1,1,1,0] },
        { input: [[30,60,90]], output: [1,1,0] },
        { input: [[89,62,70,58,47,47,46,76,100,70]], output: [8,1,5,4,3,2,1,1,0,0] }
    ],
  },

  {
    slug: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    summary: 'Find the maximum value in each sliding window of size k.',
    difficulty: 6,
    tags: ['Array', 'Sliding Window', 'Deque', 'Monotonic Queue'],
    categorySlug: 'stacks',
    entryPoint: 'max_sliding_window',
    body: `You are given an array of integers \`nums\`, there is a sliding window of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.

This problem can be solved efficiently using a **deque (double-ended queue)** to maintain a "monotonic queue" of indices.`,
    templateCode:
`import collections

def max_sliding_window(nums, k):
  # Your code here
  pass
`,
    testCases: [
        { input: [[1,3,-1,-3,5,3,6,7], 3], output: [3,3,5,5,6,7] },
        { input: [[1], 1], output: [1] },
        { input: [[1,-1], 1], output: [1,-1] },
        { input: [[9,11], 2], output: [11] },
        { input: [[4,-2], 2], output: [4] }
    ],
  },


  // ==========================================
  // PHASE 5: Recursion Basics
  // ==========================================

  {
    slug: 'factorial',
    title: 'Factorial',
    summary: 'Calculate n! using recursion.',
    difficulty: 2,
    tags: ['Recursion', 'Math'],
    categorySlug: 'recursion-dp',
    entryPoint: 'factorial',
    body:
      'Write a function, `factorial`, that takes in a non-negative integer `n`. ' +
      'The function should return the factorial of `n`.\n\n' +
      'The factorial of `n` is the product of all positive integers less than or equal to `n`. ' +
      'For example, `factorial(5)` is `5 * 4 * 3 * 2 * 1 = 120`.\n\n' +
      'Use recursion to solve this problem.',
    templateCode:
      `def factorial(n):
  # Your code here
  pass`,
    testCases: [
      { input: [0], output: 1 },
      { input: [1], output: 1 },
      { input: [5], output: 120 },
      { input: [7], output: 5040 },
      { input: [10], output: 3628800 }
    ],
  },

  {
    slug: 'fibonacci-number',
    title: 'Fibonacci Number',
    summary: 'Calculate the nth Fibonacci number.',
    difficulty: 3,
    tags: ['Recursion', 'Math', 'DP'],
    categorySlug: 'recursion-dp',
    entryPoint: 'fib',
    body: "The Fibonacci numbers are defined by `F(0)=0`, `F(1)=1`, and `F(n)=F(n-1)+F(n-2)` for `n>1`.\n\nGiven `n`, calculate `F(n)`.\n\nConstraints: `0 ≤ n ≤ 30`. Use any approach (iterative, memoized recursion, etc.).",
    templateCode:
      `def fib(n):
  # Your code here
  pass`,
    testCases: [
      { input: [0], output: 0 },
      { input: [1], output: 1 },
      { input: [2], output: 1 },
      { input: [3], output: 2 },
      { input: [4], output: 3 },
      { input: [5], output: 5 },
      { input: [10], output: 55 },
      { input: [30], output: 832040 }
    ],
  },

  {
    slug: 'reverse-string-recursive',
    title: 'Reverse String (Recursive)',
    summary: 'Write a recursive function that reverses a string.',
    difficulty: 2,
    tags: ['String', 'Recursion'],
    categorySlug: 'recursion-dp',
    entryPoint: 'reverse_string_recursive',
    body: `Write a function that reverses a string. Do this recursively.

For example, \`reverse_string_recursive("hello")\` should return \`"olleh"\`.`,
    templateCode:
      `def reverse_string_recursive(s):
  # Your code here
  pass`,
    testCases: [
      { input: ['hello'], output: 'olleh' },
      { input: ['world'], output: 'dlrow' },
      { input: [''], output: '' },
      { input: ['a'], output: 'a' },
      { input: ['racecar'], output: 'racecar' },
      { input: ['  ab!'], output: '!ba  ' }
    ],
  },

  // ==========================================
  // PHASE 6: Medium Hash Map Patterns
  // ==========================================

  {
    slug: 'group-anagrams',
    title: 'Group Anagrams',
    summary: 'Group words that are anagrams of each other.',
    difficulty: 4,
    tags: ['Hash Map', 'Counting', 'String'],
    categorySlug: 'hashing',
    entryPoint: 'group_anagrams',
    body:
      'Given an array of strings `strs`, group the anagrams together and return the groups.\n\n' +
      '**Determinism for tests**: Within each group, return words sorted lexicographically. ' +
      'Across groups, sort groups by their **first** word.\n\n' +
      'Example: `["eat","tea","tan","ate","nat","bat"]` → `[["ate","eat","tea"],["bat"],["nat","tan"]]`.',
    templateCode:
      `def group_anagrams(strs):
  # strs: List[str]
  # return List[List[str]] following the deterministic sorting rules above
  pass`,
    testCases: [
      {
        input: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']],
        output: [['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']],
        compare: 'multiset'
      },
      {
        input: [['']],
        output: [['']],
        compare: 'multiset'
      },
      {
        input: [['a']],
        output: [['a']],
        compare: 'multiset'
      },
      {
        input: [['ab', 'ba', 'abc', 'bca', 'cab', 'zzz']],
        output: [['ab', 'ba'], ['abc', 'bca', 'cab'], ['zzz']],
        compare: 'multiset'
      },
    ],
  },
  
  {
    slug: 'sort-by-frequency-then-value',
    title: 'Sort by Frequency then Value',
    summary: 'Sort an array descending by frequency, with ties broken by ascending value.',
    difficulty: 4,
    tags: ['Sorting', 'Hash Map', 'Counting'],
    categorySlug: 'hashing',
    entryPoint: 'sort_by_frequency',
    body: 'Given an array of integers `nums`, sort the array in decreasing order based on the frequency of the values.\n\nIf multiple values have the same frequency, sort them in increasing order.\n\nFor example, `[2,3,1,3,2,2]` should be `[2,2,2,3,3,1]`.',
    templateCode:
`def sort_by_frequency(nums):
  # Your code here
  pass`,
    testCases: [
      { input: [[1,1,2,2,2,3]], output: [2,2,2,1,1,3] },
      { input: [[2,3,1,3,2]], output: [2,2,3,3,1] },
      { input: [[-1,1,-6,4,5,-6,1,4,1]], output: [1,1,1,-6,-6,4,4,5] }
    ]
  },

  {
    slug: 'longest-consecutive-sequence',
    title: 'Longest Consecutive Sequence',
    summary: 'Find the length of the longest run of consecutive integers.',
    difficulty: 5,
    tags: ['Hash Set', 'Array'],
    categorySlug: 'hashing',
    entryPoint: 'longest_consecutive',
    body:
      'Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.\n\n' +
      'You must write an algorithm that runs in O(n) average time using a hash set.',
    templateCode:
      `def longest_consecutive(nums):
  # nums: List[int]
  # return int
  pass`,
    testCases: [
      { input: [[100, 4, 200, 1, 3, 2]], output: 4 },
      { input: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], output: 9 },
      { input: [[9]], output: 1 },
      { input: [[-1, -2, -3, 10, 11]], output: 3 },
      { input: [[]], output: 0 },
    ],
  },

  {
    slug: 'subarray-sum-equals-k',
    title: 'Subarray Sum Equals K',
    summary: 'Count the number of subarrays whose sum equals k.',
    difficulty: 4,
    tags: ['Hash Map', 'Prefix Sum', 'Array'],
    categorySlug: 'hashing',
    entryPoint: 'subarray_sum',
    body:
      'Given an array of integers `nums` and an integer `k`, return the total number of continuous subarrays whose sum equals `k`.\n\n' +
      'Use a prefix-sum hash map to achieve O(n).',
    templateCode:
      `def subarray_sum(nums, k):
  # nums: List[int], k: int
  # return int
  pass`,
    testCases: [
      { input: [[1, 1, 1], 2], output: 2 },
      { input: [[1, 2, 3], 3], output: 2 },
      { input: [[-1, -1, 1], 0], output: 1 },
      { input: [[0, 0, 0], 0], output: 6 },
      { input: [[3, 4, 7, 2, -3, 1, 4, 2], 7], output: 4 },
    ],
  },
  
  {
    slug: 'product-of-array-except-self',
    title: 'Product of Array Except Self',
    summary: 'Return an array where answer[i] is the product of all elements of nums except nums[i].',
    difficulty: 5,
    tags: ['Array', 'Prefix Sum'],
    categorySlug: 'hashing',
    entryPoint: 'product_except_self',
    body: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.',
    templateCode: `def product_except_self(nums):
  # Your code here
  pass`,
    testCases: [
      { input: [[1,2,3,4]], output: [24,12,8,6] },
      { input: [[-1,1,0,-3,3]], output: [0,0,9,0,0] },
      { input: [[1, -1]], output: [-1, 1] },
    ]
  },
  
  {
    slug: 'longest-substring-k-distinct',
    title: 'Longest Substring with At Most K Distinct Characters',
    summary: 'Find the length of the longest substring with at most k distinct characters.',
    difficulty: 5,
    tags: ['String', 'Sliding Window', 'Hash Map'],
    categorySlug: 'two-pointers',
    entryPoint: 'length_of_longest_substring_k_distinct',
    body:
      'Given a string `s` and an integer `k`, return the length of the longest substring of `s` that contains at most `k` distinct characters.',
    templateCode:
      `def length_of_longest_substring_k_distinct(s, k):
  # Your code here
  pass`,
    testCases: [
      { input: ['eceba', 2], output: 3 },
      { input: ['aa', 1], output: 2 },
      { input: ['abaccc', 2], output: 4 },
      { input: ['a', 0], output: 0 },
    ],
  },
  {
    slug: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    summary: 'Find the length of the longest substring without repeating characters.',
    difficulty: 4,
    tags: ['String', 'Sliding Window', 'Hash Set'],
    categorySlug: 'two-pointers',
    entryPoint: 'length_of_longest_substring',
    body:
      'Given a string `s`, find the length of the longest substring without repeating characters.',
    templateCode:
      `def length_of_longest_substring(s):
  # Your code here
  pass`,
    testCases: [
      { input: ['abcabcbb'], output: 3 },
      { input: ['bbbbb'], output: 1 },
      { input: ['pwwkew'], output: 3 },
      { input: [''], output: 0 },
      { input: ['dvdf'], output: 3 },
    ],
  },
  
  {
    slug: 'fruit-into-baskets',
    title: 'Fruit Into Baskets',
    summary: 'Find the maximum number of fruits you can collect in two baskets.',
    difficulty: 4,
    tags: ['Array', 'Sliding Window', 'Hash Map'],
    categorySlug: 'two-pointers',
    entryPoint: 'total_fruit',
    body:
      'You are visiting a farm with a single row of fruit trees, arranged from left to right. The trees are represented by an integer array `fruits` where `fruits[i]` is the type of fruit the `i`-th tree produces.\n\n' +
      'You want to collect as much fruit as possible. However, the owner has some strict rules you must follow:\n\n' +
      '- You only have two baskets, and each basket can only hold a single type of fruit.\n' +
      '- Starting from any tree of your choice, you must pick exactly one fruit from every tree (including the start tree) while moving to the right. The picked fruits must fit in one of your baskets.\n' +
      '- Once you reach a tree with fruit that cannot fit in your baskets, you must stop.\n\n' +
      'Given the integer array `fruits`, return the maximum number of fruits you can pick.\n\n' +
      'This problem is equivalent to finding the length of the longest subarray with at most 2 distinct elements.',
    templateCode:
      `def total_fruit(fruits):
  # Your code here
  pass`,
    testCases: [
      { input: [[1,2,1]], output: 3 },
      { input: [[0,1,2,2]], output: 3 },
      { input: [[1,2,3,2,2]], output: 4 },
      { input: [[3,3,3,1,2,1,1,2,3,3,4]], output: 5 },
    ],
  },

  {
    slug: 'max-consecutive-ones-iii',
    title: 'Max Consecutive Ones III',
    summary: 'Find the longest contiguous subarray of 1s if you can flip at most k 0s.',
    difficulty: 5,
    tags: ['Array', 'Sliding Window', 'Two Pointer'],
    categorySlug: 'two-pointers',
    entryPoint: 'longest_ones',
    body:
      'Given a binary array `nums` and an integer `k`, return the maximum number of consecutive 1\'s in the array if you can flip at most `k` 0s.',
    templateCode:
      `def longest_ones(nums, k):
  # Your code here
  pass`,
    testCases: [
      { input: [[1,1,1,0,0,0,1,1,1,1,0], 2], output: 6 },
      { input: [[0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], 3], output: 10 },
      { input: [[0,0,0,1], 4], output: 4 },
    ],
  },
  
  {
    slug: 'count-anagrams-of-p-in-s',
    title: 'Count Anagrams of a Pattern in a String',
    summary: 'Count all occurrences of anagrams of a pattern `p` within a string `s`.',
    difficulty: 5,
    tags: ['String', 'Sliding Window', 'Hash Map', 'Counting'],
    categorySlug: 'two-pointers',
    entryPoint: 'count_anagrams',
    body:
      'Given two strings `s` and `p`, return the number of occurrences of anagrams of `p` in `s`.\n\n' +
      'An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    templateCode:
      `def count_anagrams(s, p):
  # Your code here
  pass`,
    testCases: [
      { input: ['cbaebabacd', 'abc'], output: 2 }, // "cba" and "bac"
      { input: ['abab', 'ab'], output: 3 },
      { input: ['abc', 'd'], output: 0 },
      { input: ['aaaaa', 'aa'], output: 4 },
    ],
  },
  
  // ==========================================
  // PHASE 7: Arrays & Two Pointer
  // ==========================================

  {
    slug: 'valid-palindrome',
    title: 'Valid Palindrome',
    summary: 'Check if a string is a palindrome, ignoring non-alphanumeric characters.',
    difficulty: 3,
    tags: ['String', 'Two Pointer'],
    categorySlug: 'two-pointers',
    entryPoint: 'is_valid_palindrome',
    body:
      'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\n' +
      'Given a string `s`, return `True` if it is a palindrome, or `False` otherwise.',
    templateCode:
      `def is_valid_palindrome(s):
  # Your code here
  pass`,
    testCases: [
      { input: ['A man, a plan, a canal: Panama'], output: true },
      { input: ['race a car'], output: false },
      { input: [' '], output: true },
      { input: ['0P'], output: false },
    ],
  },
  
  {
    slug: 'squares-of-a-sorted-array',
    title: 'Squares of a Sorted Array',
    summary: 'Given a sorted array, return an array of the squares of each number, also in sorted order.',
    difficulty: 3,
    tags: ['Array', 'Two Pointer', 'Sorting'],
    categorySlug: 'two-pointers',
    entryPoint: 'sorted_squares',
    body: 'Given an integer array `nums` sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.\n\nCan you solve it in O(n) time using a two-pointer approach?',
    templateCode: `def sorted_squares(nums):
  # Your code here
  pass`,
    testCases: [
      { input: [[-4,-1,0,3,10]], output: [0,1,9,16,100] },
      { input: [[-7,-3,2,3,11]], output: [4,9,9,49,121] },
      { input: [[0,0,1,2]], output: [0,0,1,4] },
    ]
  },

  {
    slug: 'remove-duplicates-sorted-array',
    title: 'Remove Duplicates from Sorted Array',
    summary: 'Remove the duplicates from a sorted array in-place and return the new length.',
    difficulty: 3,
    tags: ['Array', 'Two Pointer'],
    categorySlug: 'two-pointers',
    entryPoint: 'remove_duplicates',
    body: 'Given a sorted integer array `nums`, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.\n\nReturn `k`, the number of unique elements in `nums`. The first `k` elements of `nums` should hold the final result.',
    templateCode: `def remove_duplicates(nums):
  # Modify the array in-place and return the new length.
  # The judge will check the first k elements of your array.
  pass`,
    testCases: [
      { input: [[1,1,2]], output: 2 }, // nums becomes [1,2,_]
      { input: [[0,0,1,1,1,2,2,3,3,4]], output: 5 }, // nums becomes [0,1,2,3,4,_,_,_,_,_]
      { input: [[5,5,5,5]], output: 1 },
      { input: [[1,2,3]], output: 3 },
    ]
  },
  
  {
    slug: 'near-duplicate-within-k',
    title: 'Contains Duplicate II',
    summary: 'Check for duplicate numbers within a certain distance `k`.',
    difficulty: 4,
    tags: ['Set', 'Array', 'Sliding Window'],
    categorySlug: 'two-pointers',
    entryPoint: 'contains_nearby_duplicate',
    body:
      'Given an integer array `nums` and an integer `k`, return `true` if there are two distinct indices `i` and `j` in the array such that `nums[i] == nums[j]` and `abs(i - j) <= k`.\n\n' +
      'This problem can be solved with a sliding window approach, but instead of a window of a fixed size, you use a `set` representing a window of elements.',
    templateCode:
      `def contains_nearby_duplicate(nums, k):
  # Your code here
  pass`,
    testCases: [
      { input: [[1, 2, 3, 1], 3], output: true },
      { input: [[1, 0, 1, 1], 1], output: true },
      { input: [[1, 2, 3, 1, 2, 3], 2], output: false },
      { input: [[99, 99], 2], output: true },
      { input: [[1], 1], output: false },
    ],
  },
  {
    slug: 'max-sum-subarray-size-k',
    title: 'Max Sum Subarray of Size K',
    summary: 'Find the maximum sum of any contiguous subarray of size k.',
    difficulty: 3,
    tags: ['Array', 'Sliding Window'],
    categorySlug: 'two-pointers',
    entryPoint: 'max_sum_subarray',
    body:
      'Given an array of positive integers `nums` and a positive integer `k`, find the maximum sum of any contiguous subarray of size `k`.',
    templateCode:
      `def max_sum_subarray(nums, k):
  # Your code here
  pass`,
    testCases: [
      { input: [[2, 1, 5, 1, 3, 2], 3], output: 9 }, // Subarray [5, 1, 3]
      { input: [[1, 9, -1, -2, 7, 3, -1, 2], 4], output: 13 }, // Subarray [9, -1, -2, 7]
      { input: [[1, 2, 3, 4, 5], 1], output: 5 },
      { input: [[5, 4, 3, 2, 1], 5], output: 15 },
    ],
  },

  {
    slug: '3sum',
    title: '3Sum',
    summary: 'Find all unique triplets in the array which give the sum of zero.',
    difficulty: 6,
    tags: ['Array', 'Two Pointer', 'Sorting'],
    categorySlug: 'two-pointers',
    entryPoint: 'three_sum',
    body:
      'Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\n' +
      'Notice that the solution set must not contain duplicate triplets.',
    templateCode:
      `def three_sum(nums):
  # Your code here
  pass`,
    testCases: [
      { input: [[-1,0,1,2,-1,-4]], output: [[-1,-1,2],[-1,0,1]], compare: "multiset" },
      { input: [[0,1,1]], output: [], compare: "multiset" },
      { input: [[0,0,0]], output: [[0,0,0]], compare: "multiset" },
    ],
  },
  
  {
    slug: 'max-average-subarray',
    title: 'Maximum Average Subarray I',
    summary: 'Find the contiguous subarray of given length k that has the maximum average value.',
    difficulty: 4,
    tags: ['Array', 'Sliding Window'],
    categorySlug: 'two-pointers',
    entryPoint: 'find_max_average',
    body: 'You are given an integer array `nums` consisting of `n` elements, and an integer `k`.\n\nFind a contiguous subarray whose length is equal to `k` that has the maximum average value and return this value.',
    templateCode: `def find_max_average(nums, k):
  # Your code here
  pass`,
    testCases: [
      { input: [[1,12,-5,-6,50,3], 4], output: 12.75 },
      { input: [[5], 1], output: 5.0 },
      { input: [[0,1,1,3,3], 4], output: 2.0 },
    ]
  },

  {
    slug: 'container-with-most-water',
    title: 'Container With Most Water',
    summary: 'Find two lines that together with the x-axis form a container with maximum water.',
    difficulty: 5,
    tags: ['Array', 'Two Pointer'],
    categorySlug: 'two-pointers',
    entryPoint: 'max_area',
    body:
      'Given an integer array `height` of length `n`, where `height[i]` represents the height of a line at position `i`, ' +
      'find two lines that together with the x-axis form a container, such that the container contains the most water.\n\n' +
      'Return the maximum amount of water a container can store.\n\n' +
      'The width between indices `i` and `j` is `j - i`. The height is `min(height[i], height[j])`.',
    templateCode:
      `def max_area(height):
  # height: List[int]
  # return int
  pass`,
    testCases: [
      { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], output: 49 },
      { input: [[1, 1]], output: 1 },
      { input: [[4, 3, 2, 1, 4]], output: 16 },
      { input: [[1, 2, 1]], output: 2 },
    ],
  },

  {
    slug: 'character-replacement',
    title: 'Longest Repeating Character Replacement',
    summary: 'Find the longest substring containing the same letter after at most k replacements.',
    difficulty: 5,
    tags: ['String', 'Sliding Window', 'Hash Map'],
    categorySlug: 'two-pointers',
    entryPoint: 'character_replacement',
    body:
      'You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times.\n\n' +
      'Return the length of the longest substring containing the same letter you can get after performing the above operations.',
    templateCode:
      `def character_replacement(s, k):
  # Your code here
  pass`,
    testCases: [
      { input: ['ABAB', 2], output: 4 },
      { input: ['AABABBA', 1], output: 4 },
      { input: ['ABCDE', 1], output: 2 },
      { input: ['AAAA', 2], output: 4 },
    ],
  },

  {
    slug: 'minimum-size-subarray-sum',
    title: 'Minimum Size Subarray Sum',
    summary: 'Find the minimal length of a subarray whose sum is >= target.',
    difficulty: 5,
    tags: ['Array', 'Sliding Window', 'Two Pointer'],
    categorySlug: 'two-pointers',
    entryPoint: 'min_subarray_len',
    body:
      'Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a subarray whose sum is greater than or equal to `target`.\n\n' +
      'If there is no such subarray, return 0 instead.',
    templateCode:
      `def min_subarray_len(target, nums):
  # Your code here
  pass`,
    testCases: [
      { input: [7, [2,3,1,2,4,3]], output: 2 },
      { input: [4, [1,4,4]], output: 1 },
      { input: [11, [1,1,1,1,1,1,1,1]], output: 0 },
      { input: [15, [1,2,3,4,5]], output: 5 },
    ],
  },
  
  {
    slug: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    summary: 'Find the smallest substring that contains all characters of another string.',
    difficulty: 6,
    tags: ['String', 'Sliding Window', 'Hash Map'],
    categorySlug: 'two-pointers',
    entryPoint: 'min_window',
    body:
      'Given two strings `s` and `t`, return the minimum window in `s` which will contain all the characters in `t`.\n\n' +
      'If there is no such window in `s` that covers all characters in `t`, return the empty string `""`.\n\n' +
      'Note that the order of characters in `t` does not matter. The characters in `t` can appear in any order within the window.',
    templateCode:
      `def min_window(s, t):
  # Your code here
  pass`,
    testCases: [
      { input: ['ADOBECODEBANC', 'ABC'], output: 'BANC' },
      { input: ['a', 'a'], output: 'a' },
      { input: ['a', 'aa'], output: '' },
      { input: ['ab', 'a'], output: 'a' },
      { input: ['cabwefgewcwaefgcf', 'cae'], output: 'cwae' },
    ],
  },

  {
    slug: 'find-all-anagrams-in-a-string',
    title: 'Find All Anagrams in a String',
    summary: 'Find all starting indices of a pattern\'s anagrams in a string.',
    difficulty: 6,
    tags: ['String', 'Sliding Window', 'Hash Map', 'Counting'],
    categorySlug: 'two-pointers',
    entryPoint: 'find_all_anagrams',
    body:
      'Given two strings `s` and `p`, return an array of all the start indices of `p`\'s anagrams in `s`.\n\n' +
      'An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    templateCode:
      `def find_all_anagrams(s, p):
  # Your code here
  pass`,
    testCases: [
      { input: ['cbaebabacd', 'abc'], output: [0, 6], compare: "multiset" },
      { input: ['abab', 'ab'], output: [0, 1, 2], compare: "multiset" },
      { input: ['abc', 'd'], output: [], compare: "multiset" },
    ],
  },


  {
    slug: 'merge-intervals',
    title: 'Merge Intervals',
    summary: 'Given a collection of intervals, merge all overlapping intervals.',
    difficulty: 4,
    tags: ['Array', 'Sorting'],
    categorySlug: 'sets-ordering',
    entryPoint: 'merge_intervals',
    body:
      'Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals.\n' +
      'Intervals may be unsorted. Return merged intervals sorted by start.',
    templateCode:
      `def merge_intervals(intervals):
  # Your code here
  pass`,
    testCases: [
      { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], output: [[1, 6], [8, 10], [15, 18]] },
      { input: [[[1, 4], [4, 5]]], output: [[1, 5]] },
      { input: [[[6, 8], [1, 9], [2, 4], [4, 7]]], output: [[1, 9]] },
      { input: [[[1, 2]]], output: [[1, 2]] },
      { input: [[[-3, -1], [-2, 2], [3, 4]]], output: [[-3, 2], [3, 4]] }
    ],
  },

  // ==========================================
  // PHASE 8: Recursion & Backtracking
  // ==========================================
  
  {
    slug: 'subsets',
    title: 'Powerset',
    summary: 'Return all possible subsets (the power set) of an array of unique elements.',
    difficulty: 3,
    tags: ['Recursion', 'Backtracking', 'Array'],
    categorySlug: 'recursion-dp',
    entryPoint: 'subsets',
    body: 'Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order.',
    templateCode:
      `def subsets(nums):
  # Your code here
  pass`,
    testCases: [
      { input: [[1, 2, 3]], output: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]], compare: "multiset"},
      { input: [[0]], output: [[], [0]], compare: "multiset"},
      { input: [[]], output: [[]], compare: "multiset"},
    ],
  },

  {
    slug: 'permute-unique',
    title: 'Permutations II',
    summary: 'Return all unique permutations of an array that may contain duplicates.',
    difficulty: 5,
    tags: ['Recursion', 'Backtracking', 'Array'],
    categorySlug: 'recursion-dp',
    entryPoint: 'permute_unique',
    body: 'Given a collection of numbers, `nums`, that might contain duplicates, return all possible unique permutations in any order.',
    templateCode:
      `def permute_unique(nums):
  # Your code here
  pass`,
    testCases: [
      { input: [[1, 1, 2]], output: [[1, 1, 2], [1, 2, 1], [2, 1, 1]], compare: "multiset"},
      { input: [[1, 2, 3]], output: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]], compare: "multiset"},
    ],
  },

  {
    slug: 'letter-combinations',
    title: 'Letter Combinations of a Phone Number',
    summary: 'Given a string of digits, return all possible letter combinations it could represent.',
    difficulty: 5,
    tags: ['Recursion', 'Backtracking', 'String'],
    categorySlug: 'recursion-dp',
    entryPoint: 'letter_combinations',
    body: 'Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.\n\nA mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.\n`2:abc`, `3:def`, `4:ghi`, `5:jkl`, `6:mno`, `7:pqrs`, `8:tuv`, `9:wxyz`',
    templateCode:
      `def letter_combinations(digits):
  # Your code here
  pass`,
    testCases: [
      { input: ['23'], output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"], compare: "multiset"},
      { input: [''], output: [], compare: "multiset"},
      { input: ['2'], output: ["a", "b", "c"], compare: "multiset"},
    ],
  },

  {
    slug: 'combination-sum',
    title: 'Combination Sum',
    summary: 'Find all unique combinations of candidates that sum to a target.',
    difficulty: 6,
    tags: ['Recursion', 'Backtracking', 'Array'],
    categorySlug: 'recursion-dp',
    entryPoint: 'combination_sum',
    body: 'Given an array of **distinct** integer `candidates` and a `target` integer, return a list of all **unique combinations** of `candidates` where the chosen numbers sum to `target`. You may return the combinations in any order.\n\nThe same number may be chosen from `candidates` an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.',
    templateCode:
      `def combination_sum(candidates, target):
  # Your code here
  pass`,
    testCases: [
      { input: [[2, 3, 6, 7], 7], output: [[2, 2, 3], [7]], compare: "multiset"},
      { input: [[2, 3, 5], 8], output: [[2, 2, 2, 2], [2, 3, 3], [3, 5]], compare: "multiset"},
      { input: [[2], 1], output: [], compare: "multiset"},
    ],
  },
  
  {
    slug: 'word-break',
    title: 'Word Break',
    summary: 'Can a string be segmented into a space-separated sequence of dictionary words?',
    difficulty: 6,
    tags: ['Dynamic Programming', 'Set', 'Recursion'],
    categorySlug: 'recursion-dp',
    entryPoint: 'word_break',
    body:
      'Given a string `s` and a dictionary of strings `wordDict` (provided as a list), return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words. The same dictionary word may be reused multiple times.\n\n' +
      'For efficient lookups, you should convert `wordDict` into a `set`.',
    templateCode:
      `def word_break(s, wordDict):
  # Your code here
  pass`,
    testCases: [
      { input: ['leetcode', ['leet', 'code']], output: true },
      { input: ['applepenapple', ['apple', 'pen']], output: true },
      { input: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], output: false },
      { input: ['a', ['b']], output: false },
      { input: ['aaaaaaa', ['aaaa', 'aaa']], output: true },
    ],
  },


  // ==========================================
  // PHASE 9: Trees Introduction
  // ==========================================

  {
    slug: 'max-depth-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    summary: 'Find the maximum depth (height) of a binary tree.',
    difficulty: 2,
    tags: ['Tree', 'Recursion', 'DFS'],
    categorySlug: 'trees',
    entryPoint: 'max_depth',
    body:
      'Given the root of a binary tree, return its maximum depth.\n\n' +
      "A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.\n\n" +
      'The tree node is a dict: `{"val": int, "left": node|None, "right": node|None}`.',
    templateCode:
      `def max_depth(root):
  # root: dict|None with keys val,left,right
  pass`,
    testCases: [
      { input: [null], output: 0 },
      { input: [{ val: 1, left: null, right: null }], output: 1 },
      { input: [{ val: 3, left: { val: 9, left: null, right: null }, right: { val: 20, left: { val: 15, left: null, right: null }, right: { val: 7, left: null, right: null } } }], output: 3 },
      { input: [{ val: 1, left: null, right: { val: 2, left: null, right: null } }], output: 2 },
    ],
  },

  {
    slug: 'binary-tree-inorder-traversal',
    title: 'Binary Tree Inorder Traversal',
    summary: 'Traverse a binary tree in the order: left, root, right.',
    difficulty: 3,
    tags: ['Tree', 'Stack', 'Recursion'],
    categorySlug: 'trees',
    entryPoint: 'inorder_traversal',
    body:
      'The tree node is a dict: `{"val": int, "left": node|None, "right": node|None}`.\n' +
      'Return the inorder traversal (left, root, right) as a list of values.',
    templateCode:
      `def inorder_traversal(root):
  # root: dict|None with keys val,left,right
  pass`,
    testCases: [
      { input: [null], output: [] },
      { input: [{ val: 1, left: null, right: null }], output: [1] },
      { input: [{ val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } }], output: [1, 2, 3] },
      { input: [{ val: 2, left: { val: 1, left: null, right: null }, right: { val: 4, left: { val: 3, left: null, right: null }, right: null } }], output: [1, 2, 3, 4] }
    ],
  },

  {
    slug: 'same-tree',
    title: 'Same Tree',
    summary: 'Check if two binary trees are structurally identical.',
    difficulty: 2,
    tags: ['Tree', 'Recursion', 'DFS'],
    categorySlug: 'trees',
    entryPoint: 'is_same_tree',
    body:
      'Given the roots of two binary trees `p` and `q`, write a function to check if they are the same.\n\n' +
      'Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.\n\n' +
      'The tree node is a dict: `{"val": int, "left": node|None, "right": node|None}`.',
    templateCode:
      `def is_same_tree(p, q):
  # p, q: dict|None with keys val,left,right
  pass`,
    testCases: [
      { input: [{ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } }, { val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } }], output: true },
      { input: [{ val: 1, left: { val: 2, left: null, right: null }, right: null }, { val: 1, left: null, right: { val: 2, left: null, right: null } }], output: false },
      { input: [null, null], output: true },
      { input: [{ val: 1, left: null, right: null }, null], output: false },
    ],
  },
  
  {
    slug: 'level-order-zigzag',
    title: 'Binary Tree Zigzag Level Order Traversal',
    summary: 'Traverse a binary tree in a zigzag level order (left-to-right, then right-to-left, etc.).',
    difficulty: 4,
    tags: ['Tree', 'BFS', 'Queue'],
    categorySlug: 'trees',
    entryPoint: 'level_order_zigzag',
    body: 'Given the root of a binary tree, return the zigzag level order traversal of its nodes\' values. (i.e., from left to right, then right to left for the next level and alternate between).',
    templateCode: `def level_order_zigzag(root):
  # Your code here
  pass`,
    testCases: [
      { input: [{val: 3, left: {val: 9}, right: {val: 20, left: {val: 15}, right: {val: 7}}}], output: [[3], [20, 9], [15, 7]] },
      { input: [{val: 1}], output: [[1]] },
      { input: [null], output: [] }
    ]
  },

  {
    slug: 'path-sum',
    title: 'Path Sum',
    summary: 'Check if there is a root-to-leaf path with a given sum.',
    difficulty: 4,
    tags: ['Tree', 'DFS', 'Recursion'],
    categorySlug: 'trees',
    entryPoint: 'has_path_sum',
    body: 'Given the root of a binary tree and an integer `targetSum`, return `True` if the tree has a root-to-leaf path such that adding up all the values along the path equals `targetSum`. A leaf is a node with no children.',
    templateCode: `def has_path_sum(root, targetSum):
  # Your code here
  pass`,
    testCases: [
      { input: [{val: 5, left: {val: 4, left: {val: 11, left: {val: 7}, right: {val: 2}}}, right: {val: 8, left: {val: 13}, right: {val: 4, right: {val: 1}}}}, 22], output: true },
      { input: [{val: 1, left: {val: 2}, right: {val: 3}}, 5], output: false },
      { input: [null, 0], output: false }
    ]
  },

  {
    slug: 'lowest-common-ancestor-bst',
    title: 'Lowest Common Ancestor of a BST',
    summary: 'Find the lowest common ancestor of two given nodes in a Binary Search Tree.',
    difficulty: 5,
    tags: ['Tree', 'BST', 'Recursion'],
    categorySlug: 'trees',
    entryPoint: 'lowest_common_ancestor_bst',
    body: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST. The LCA is defined between two nodes `p` and `q` as the lowest node in T that has both `p` and `q` as descendants.\n\n*This problem is different from the standard LCA problem as it requires you to pass the node objects themselves for `p` and `q`.* The test runner will handle constructing the tree and finding the node references to pass to your function.',
    templateCode: `def lowest_common_ancestor_bst(root, p, q):
  # This is a simplified version for Python. 
  # In a real scenario, you'd likely work with node objects.
  # For this problem, assume p and q are just integer values.
  # Your code should return the value of the LCA node.
  pass`,
    testCases: [
      { input: [{val: 6, left: {val: 2, left: {val: 0}, right: {val: 4, left: {val: 3}, right: {val: 5}}}, right: {val: 8, left: {val: 7}, right: {val: 9}}}, 2, 8], output: 6 },
      { input: [{val: 6, left: {val: 2, left: {val: 0}, right: {val: 4, left: {val: 3}, right: {val: 5}}}, right: {val: 8, left: {val: 7}, right: {val: 9}}}, 2, 4], output: 2 },
      { input: [{val: 2, left: {val: 1}}, 2, 1], output: 2 }
    ]
  },

  {
    slug: 'diameter-of-binary-tree',
    title: 'Diameter of Binary Tree',
    summary: 'Find the length of the longest path between any two nodes in a tree.',
    difficulty: 6,
    tags: ['Tree', 'DFS', 'Recursion'],
    categorySlug: 'trees',
    entryPoint: 'diameter_of_binary_tree',
    body: 'Given the root of a binary tree, return the length of the diameter of the tree. The diameter is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.\n\nThe length of a path between two nodes is represented by the number of edges between them.',
    templateCode: `def diameter_of_binary_tree(root):
  # Your code here
  pass`,
    testCases: [
      { input: [{val: 1, left: {val: 2, left: {val: 4}, right: {val: 5}}, right: {val: 3}}], output: 3 },
      { input: [{val: 1, left: {val: 2}}], output: 1 },
      { input: [null], output: 0 }
    ]
  },

  // ==========================================
  // PHASE 10: Advanced Medium/Hard
  // ==========================================

  {
    slug: 'valid-sudoku',
    title: 'Valid Sudoku',
    summary: 'Check whether a partially filled 9×9 Sudoku board is valid.',
    difficulty: 4,
    tags: ['Hash Set', 'Grid'],
    categorySlug: 'hashing',
    entryPoint: 'is_valid_sudoku',
    body:
      'Determine if a 9×9 Sudoku board is valid. Only the filled cells need to be validated.\n\n' +
      'A board is valid if each row, each column, and each of the nine 3×3 sub-boxes contains no duplicate digits 1–9. ' +
      'Empty cells are represented by `"."`.\n\n' +
      'Return `True` if valid, else `False`.',
    templateCode:
      `def is_valid_sudoku(board):
  # board: List[List[str]] with digits '1'-'9' or '.'
  # return bool
  pass`,
    testCases: [
      {
        input: [[
          ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
          ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
          ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
          ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
          ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
          ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
          ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
          ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
          ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
        ]],
        output: true
      },
      {
        input: [[
          ['8', '3', '.', '.', '7', '.', '.', '.', '.'],
          ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
          ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
          ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
          ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
          ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
          ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
          ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
          ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
        ]],
        output: false
      }
    ],
  },
  
  {
    slug: 'islands-count',
    title: 'Number of Islands',
    summary: 'Count the number of islands in a 2D grid.',
    difficulty: 5,
    tags: ['Grid', 'DFS', 'BFS'],
    categorySlug: 'grids-backtracking',
    entryPoint: 'num_islands',
    body: 'Given an `m x n` 2D binary grid `grid` which represents a map of `\'1\'`s (land) and `\'0\'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
    templateCode: `def num_islands(grid):
  # Your code here
  pass`,
    testCases: [
      { input: [[['1','1','1','1','0'],['1','1','0','1','0'],['1','1','0','0','0'],['0','0','0','0','0']]], output: 1 },
      { input: [[['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]], output: 3 },
    ]
  },
  
  {
    slug: 'shortest-path-unweighted-grid',
    title: 'Shortest Path in Binary Matrix',
    summary: 'Find the shortest clear path from top-left to bottom-right in a grid.',
    difficulty: 6,
    tags: ['Grid', 'BFS', 'Graph'],
    categorySlug: 'graphs',
    entryPoint: 'shortest_path_binary_matrix',
    body: 'Given an `n x n` binary matrix `grid`, return the length of the shortest **clear path** in the matrix. If there is no clear path, return -1.\n\nA clear path in a binary matrix is a path from the **top-left** cell (i.e., `(0, 0)`) to the **bottom-right** cell (i.e., `(n - 1, n - 1)`) such that:\n- All the visited cells of the path are `0`.\n- All the adjacent cells of the path are **8-directionally** connected (i.e., they are different and share an edge or a corner).',
    templateCode: `def shortest_path_binary_matrix(grid):
  # Your code here
  pass`,
    testCases: [
      { input: [[ [0,1],[1,0] ]], output: 2 },
      { input: [[ [0,0,0],[1,1,0],[1,1,0] ]], output: 4 },
      { input: [[ [1,0,0],[1,1,0],[1,1,0] ]], output: -1 },
    ]
  },

  {
    slug: 'course-schedule',
    title: 'Course Schedule',
    summary: 'Detect if course prerequisites form a cycle (topological sort).',
    difficulty: 6,
    tags: ['Graph', 'DFS', 'Topological Sort'],
    categorySlug: 'graphs',
    entryPoint: 'can_finish',
    body:
      'There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. ' +
      'You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`.\n\n' +
      'Return `True` if you can finish all courses. Otherwise, return `False`.\n\n' +
      'This is essentially cycle detection in a directed graph.',
    templateCode:
      `def can_finish(numCourses, prerequisites):
  # numCourses: int
  # prerequisites: List[List[int]]
  # return bool
  pass`,
    testCases: [
      { input: [2, [[1, 0]]], output: true },
      { input: [2, [[1, 0], [0, 1]]], output: false },  // cycle
      { input: [3, [[1, 0], [2, 1]]], output: true },
      { input: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], output: true },
      { input: [1, []], output: true },
    ],
  },
  
  {
    slug: 'climbing-stairs',
    title: 'Climbing Stairs',
    summary: 'Find the number of distinct ways to climb to the top of a staircase.',
    difficulty: 5,
    tags: ['Dynamic Programming', 'Recursion'],
    categorySlug: 'recursion-dp',
    entryPoint: 'climb_stairs',
    body: 'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\nThis is a classic introductory dynamic programming problem.',
    templateCode: `def climb_stairs(n):
  # Your code here
  pass`,
    testCases: [
      { input: [2], output: 2 },
      { input: [3], output: 3 },
      { input: [5], output: 8 },
      { input: [45], output: 1836311903 }
    ]
  },
  
  {
    slug: 'coin-change',
    title: 'Coin Change',
    summary: 'Find the minimum number of coins to make a given amount.',
    difficulty: 6,
    tags: ['Dynamic Programming', 'Array'],
    categorySlug: 'recursion-dp',
    entryPoint: 'coin_change',
    body: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.',
    templateCode: `def coin_change(coins, amount):
  # Your code here
  pass`,
    testCases: [
      { input: [[1,2,5], 11], output: 3 }, // 5 + 5 + 1
      { input: [[2], 3], output: -1 },
      { input: [[1], 0], output: 0 }
    ]
  },

  {
    slug: 'word-search',
    title: 'Word Search',
    summary: 'Search for a word in a 2D grid using backtracking.',
    difficulty: 6,
    tags: ['Grid', 'Backtracking', 'DFS'],
    categorySlug: 'grids-backtracking',
    entryPoint: 'exist',
    body:
      'Given an `m x n` grid of characters `board` and a string `word`, return `True` if `word` exists in the grid.\n\n' +
      'The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. ' +
      'The same letter cell may not be used more than once.',
    templateCode:
      `def exist(board, word):
  # board: List[List[str]]
  # word: str
  # return bool
  pass`,
    testCases: [
      { 
        input: [[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], 'ABCCED'], 
        output: true 
      },
      { 
        input: [[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], 'SEE'], 
        output: true 
      },
      { 
        input: [[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], 'ABCB'], 
        output: false 
      },
      { 
        input: [[['A']], 'A'], 
        output: true 
      },
    ],
  },

  // ==========================================
  // PHASE 11: Hard Problems
  // ==========================================

  {
    slug: 'k-closest-points',
    title: 'K Closest Points to Origin',
    summary: 'Find the K closest points to the origin (0, 0).',
    difficulty: 4,
    tags: ['Heap', 'Sorting', 'Priority Queue'],
    categorySlug: 'heaps',
    entryPoint: 'k_closest',
    body: 'Given an array of `points` where `points[i] = [xi, yi]` represents a point on the X-Y plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`.\n\nThe distance between two points on the X-Y plane is the Euclidean distance (i.e., `sqrt(x1 - x2)^2 + (y1 - y2)^2`).\n\nYou may return the answer in any order. The answer is guaranteed to be unique (except for the order that it is in).',
    templateCode: `def k_closest(points, k):
  # Your code here
  pass`,
    testCases: [
      { input: [[[1,3],[-2,2]], 1], output: [[-2,2]], compare: 'multiset' },
      { input: [[[3,3],[5,-1],[-2,4]], 2], output: [[3,3],[-2,4]], compare: 'multiset' }
    ]
  },
  
  {
    slug: 'kth-largest-element-in-an-array',
    title: 'Kth Largest Element in an Array',
    summary: 'Find the kth largest element in an unsorted array.',
    difficulty: 5,
    tags: ['Sorting', 'Heap', 'Quickselect'],
    categorySlug: 'heaps',
    entryPoint: 'find_kth_largest',
    body: 'Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.\n\nNote that it is the `k`th largest element in the sorted order, not the `k`th distinct element.\n\nCan you solve it without sorting the whole array?',
    templateCode:
`def find_kth_largest(nums, k):
  # Your code here
  pass`,
    testCases: [
      { input: [[3,2,1,5,6,4], 2], output: 5 },
      { input: [[3,2,3,1,2,4,5,5,6], 4], output: 4 }
    ]
  },
  
  {
    slug: 'verifying-an-alien-dictionary',
    title: 'Verifying an Alien Dictionary',
    summary: 'Check if a list of words is sorted according to a custom alphabet.',
    difficulty: 5,
    tags: ['Sorting', 'Hash Map', 'String'],
    categorySlug: 'sets-ordering',
    entryPoint: 'is_alien_sorted',
    body: 'In an alien language, surprisingly, they also use English lowercase letters, but possibly in a different `order`. The `order` of the alphabet is some permutation of lowercase letters.\n\nGiven a sequence of `words` written in the alien language, and the `order` of the alphabet, return `true` if and only if the given `words` are sorted lexicographically in this alien language.',
    templateCode:
`def is_alien_sorted(words, order):
  # Your code here
  pass`,
    testCases: [
      { input: [["hello","leetcode"], "hlabcdefgijkmnopqrstuvwxyz"], output: true },
      { input: [["word","world","row"], "worldabcefghijkmnpqstuvxyz"], output: false },
      { input: [["apple","app"], "abcdefghijklmnopqrstuvwxyz"], output: false }
    ]
  },
  
  {
    slug: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    summary: 'Search for a target in a sorted array that has been rotated.',
    difficulty: 5,
    tags: ['Array', 'Binary Search'],
    categorySlug: 'advanced-binary-search',
    entryPoint: 'search',
    body: 'There is an integer array `nums` sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k` (`1 <= k < nums.length`). For example, `[0,1,2,4,5,6,7]` might be rotated at pivot index 3 and become `[4,5,6,7,0,1,2]`.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or -1 if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
    templateCode: `def search(nums, target):
  # Your code here
  pass`,
    testCases: [
      { input: [[4,5,6,7,0,1,2], 0], output: 4 },
      { input: [[4,5,6,7,0,1,2], 3], output: -1 },
      { input: [[1], 0], output: -1 }
    ]
  },
  
  {
    slug: 'word-ladder',
    title: 'Word Ladder',
    summary: 'Find the shortest transformation sequence from one word to another.',
    difficulty: 7,
    tags: ['Graph', 'BFS'],
    categorySlug: 'graphs',
    entryPoint: 'ladder_length',
    body: 'Given two words, `beginWord` and `endWord`, and a dictionary `wordList`, return the length of the shortest transformation sequence from `beginWord` to `endWord`.\n\n- A transformation sequence is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that:\n- Every adjacent pair of words differs by a single letter.\n- Every `si` for `1 <= i <= k` is in `wordList`.\n- `sk == endWord`.\nIf no such sequence exists, return 0.',
    templateCode: `def ladder_length(beginWord, endWord, wordList):
  # Your code here
  pass`,
    testCases: [
      { input: ["hit", "cog", ["hot","dot","dog","lot","log","cog"]], output: 5 },
      { input: ["hit", "cog", ["hot","dot","dog","lot","log"]], output: 0 },
      { input: ["a", "c", ["a","b","c"]], output: 2 }
    ]
  },
  
  {
    slug: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    summary: 'Find the length of the longest strictly increasing subsequence.',
    difficulty: 7,
    tags: ['Dynamic Programming', 'Binary Search'],
    categorySlug: 'recursion-dp',
    entryPoint: 'length_of_lis',
    body: 'Given an integer array `nums`, return the length of the longest strictly increasing subsequence.\n\nA subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements.\n\nWhile a standard O(n^2) DP solution exists, can you find the more optimal O(n log n) solution using patience sorting or binary search?',
    templateCode: `def length_of_lis(nums):
  # Your code here
  pass`,
    testCases: [
      { input: [[10,9,2,5,3,7,101,18]], output: 4 }, // [2,3,7,101]
      { input: [[0,1,0,3,2,3]], output: 4 }, // [0,1,2,3]
      { input: [[7,7,7,7,7,7,7]], output: 1 }
    ]
  },

  {
    slug: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    summary: 'Calculate how much rain water can be trapped between bars.',
    difficulty: 7,
    tags: ['Array', 'Two Pointer', 'Stack'],
    categorySlug: 'heaps',
    entryPoint: 'trap',
    body:
      'Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, ' +
      'compute how much water it can trap after raining.\n\n' +
      'Use a two-pointer approach or stack to solve in O(n) time.',
    templateCode:
      `def trap(height):
  # height: List[int]
  # return int
  pass`,
    testCases: [
      { input: [[0,1,0,2,1,0,1,3,2,1,2,1]], output: 6 },
      { input: [[4,2,0,3,2,5]], output: 9 },
      { input: [[0,0,0]], output: 0 },
      { input: [[3,0,2,0,4]], output: 7 },
    ],
  },

  {
    slug: 'merge-k-lists',
    title: 'Merge k Sorted Arrays',
    summary: 'Use a min-heap to efficiently merge k sorted arrays.',
    difficulty: 7,
    tags: ['Heap', 'Array', 'Priority Queue'],
    categorySlug: 'heaps',
    entryPoint: 'merge_k_lists',
    body:
      'You are given an array of `k` sorted arrays `lists`.\n\n' +
      'Merge them into a single sorted array and return it.\n\n' +
      'Example: `lists=[[1,4,5],[1,3,4],[2,6]]` → `[1,1,2,3,4,4,5,6]`',
    templateCode:
      `def merge_k_lists(lists):
  # lists: List[List[int]]
  # return a single sorted list
  pass`,
    testCases: [
      { input: [[[1, 4, 5], [1, 3, 4], [2, 6]]], output: [1, 1, 2, 3, 4, 4, 5, 6] },
      { input: [[[]]], output: [] },
      { input: [[[], [0]]], output: [0] },
      { input: [[[1], [2], [3]]], output: [1, 2, 3] }
    ],
  },

  {
    slug: 'longest-increasing-path',
    title: 'Longest Increasing Path in a Matrix',
    summary: 'Find the longest increasing path in a grid using DFS with memoization.',
    difficulty: 8,
    tags: ['Grid', 'DFS', 'Memoization', 'Dynamic Programming'],
    categorySlug: 'grids-backtracking',
    entryPoint: 'longest_increasing_path',
    body:
      'Given an `m x n` integers matrix, return the length of the longest increasing path in the matrix.\n\n' +
      'From each cell, you can move in four directions: left, right, up, or down. ' +
      'You may not move diagonally or move outside the boundary.\n\n' +
      'Use DFS with memoization to achieve optimal time complexity.',
    templateCode:
      `def longest_increasing_path(matrix):
  # matrix: List[List[int]]
  # return int
  pass`,
    testCases: [
      { input: [[[9,9,4],[6,6,8],[2,1,1]]], output: 4 },  // path: 1→2→6→9
      { input: [[[3,4,5],[3,2,6],[2,2,1]]], output: 4 },  // path: 3→4→5→6
      { input: [[[1]]], output: 1 },
      { input: [[[7,8,9],[9,7,6],[7,2,3]]], output: 6 },
    ],
  },

  {
    slug: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    summary: 'Find the median of two sorted arrays in O(log(m+n)) time.',
    difficulty: 9,
    tags: ['Array', 'Binary Search'],
    categorySlug: 'advanced-binary-search',
    entryPoint: 'find_median_sorted_arrays',
    body:
      'Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, ' +
      'return the median of the two sorted arrays.\n\n' +
      'The overall run time complexity should be O(log (m+n)).\n\n' +
      'Use binary search to partition the arrays efficiently.',
    templateCode:
      `def find_median_sorted_arrays(nums1, nums2):
  # nums1: List[int]
  # nums2: List[int]
  # return float
  pass`,
    testCases: [
      { input: [[1, 3], [2]], output: 2.0 },
      { input: [[1, 2], [3, 4]], output: 2.5 },
      { input: [[0, 0], [0, 0]], output: 0.0 },
      { input: [[], [1]], output: 1.0 },
      { input: [[2], []], output: 2.0 },
    ],
  },

  {
    slug: 'wildcard-matching',
    title: 'Wildcard Pattern Matching',
    summary: 'Match a string against a pattern with * and ? wildcards using DP.',
    difficulty: 8,
    tags: ['String', 'Dynamic Programming', 'Recursion'],
    categorySlug: 'recursion-dp',
    entryPoint: 'is_match',
    body:
      "Given an input string `s` and a pattern `p`, implement wildcard pattern matching with support for `?` and `*` where:\n\n" +
      "- `?` matches any single character\n" +
      "- `*` matches any sequence of characters (including the empty sequence)\n\n" +
      "Return `True` if the pattern matches the entire input string, else `False`.\n\n" +
      "Use dynamic programming for an efficient solution.",
    templateCode:
      `def is_match(s, p):
  # s: str
  # p: str (pattern)
  # return bool
  pass`,
    testCases: [
      { input: ['aa', 'a'], output: false },
      { input: ['aa', '*'], output: true },
      { input: ['cb', '?a'], output: false },
      { input: ['adceb', '*a*b'], output: true },
      { input: ['acdcb', 'a*c?b'], output: false },
      { input: ['', '*'], output: true },
      { input: ['', ''], output: true },
    ],
  },
    // ==========================================
  // New problems for Greedy & Intervals
  // ==========================================
  {
    slug: 'non-overlapping-intervals',
    title: 'Non-overlapping Intervals',
    summary: 'Find the minimum number of intervals to remove to make the rest non-overlapping.',
    difficulty: 4,
    tags: ['Greedy', 'Intervals', 'Sorting'],
    categorySlug: 'greedy-intervals',
    entryPoint: 'erase_overlap_intervals',
    body: 'Given an array of intervals `intervals` where `intervals[i] = [starti, endi]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.\n\nA classic greedy approach is to sort the intervals by their end times.',
    templateCode:
`def erase_overlap_intervals(intervals):
  # Your code here
  pass`,
    testCases: [
      { input: [[[1,2],[2,3],[3,4],[1,3]]], output: 1 },
      { input: [[[1,2],[1,2],[1,2]]], output: 2 },
      { input: [[[1,2],[2,3]]], output: 0 }
    ]
  },
  {
    slug: 'jump-game',
    title: 'Jump Game',
    summary: 'Determine if you can reach the last index of the array.',
    difficulty: 5,
    tags: ['Greedy', 'Array'],
    categorySlug: 'greedy-intervals',
    entryPoint: 'can_jump',
    body: 'You are given an integer array `nums`. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position.\n\nReturn `true` if you can reach the last index, or `false` otherwise.\n\nThis can be solved with a greedy approach by keeping track of the maximum reach possible.',
    templateCode:
`def can_jump(nums):
  # Your code here
  pass`,
    testCases: [
      { input: [[2,3,1,1,4]], output: true },
      { input: [[3,2,1,0,4]], output: false },
      { input: [[0]], output: true },
      { input: [[2,0,0]], output: true }
    ]
  },
  {
    slug: 'meeting-rooms-ii',
    title: 'Meeting Rooms II',
    summary: 'Find the minimum number of conference rooms required.',
    difficulty: 6,
    tags: ['Greedy', 'Intervals', 'Heap', 'Sorting'],
    categorySlug: 'greedy-intervals',
    entryPoint: 'min_meeting_rooms',
    body: 'Given an array of meeting time intervals `intervals` where `intervals[i] = [starti, endi]`, return the minimum number of conference rooms required.\n\nThis can be solved by sorting start and end times, or by using a min-heap to track meeting end times.',
    templateCode:
`def min_meeting_rooms(intervals):
  # Your code here
  pass`,
    testCases: [
      { input: [[[0,30],[5,10],[15,20]]], output: 2 },
      { input: [[[7,10],[2,4]]], output: 1 },
      { input: [[[1,5],[8,9],[8,9]]], output: 2 }
    ]
  },
  
  {
    slug: 'reconstruct-queue-by-height',
    title: 'Queue Reconstruction by Height',
    summary: 'Reconstruct a queue based on people\'s heights and number of people in front.',
    difficulty: 6,
    tags: ['Greedy', 'Sorting', 'Array'],
    categorySlug: 'greedy-intervals',
    entryPoint: 'reconstruct_queue',
    body: 'You are given an array of people, where `people[i] = [hi, ki]` represents the `i`th person has a height of `hi` and `ki` people in front of them who have a height greater than or equal to `hi`.\n\nReconstruct and return the queue.\n\nThis problem can be solved with a clever greedy approach: sort the people and then insert them into the result array at specific positions.',
    templateCode:
`def reconstruct_queue(people):
  # Your code here
  pass`,
    testCases: [
      { input: [[[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]], output: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]] },
      { input: [[[6,0],[5,0],[4,0],[3,0],[2,0],[1,0]]], output: [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]] }
    ]
  },
  
  // ==========================================
  // New problems for Math & Bit Tricks
  // ==========================================
  {
    slug: 'reverse-bits',
    title: 'Reverse Bits',
    summary: 'Reverse the bits of a given 32-bit unsigned integer.',
    difficulty: 4,
    tags: ['Bit Manipulation'],
    categorySlug: 'math-bit-tricks',
    entryPoint: 'reverse_bits',
    body: 'Reverse the bits of a given 32-bit unsigned integer.',
    templateCode:
`def reverse_bits(n):
  # Your code here
  pass`,
    testCases: [
      { input: [43261596], output: 964176192 }, // 00000010100101000001111010011100 -> 00111001011110000010100101000000
      { input: [2147483648], output: 1 }, // 100...0 -> 0...01
      { input: [1], output: 2147483648 }
    ]
  },
  {
    slug: 'single-number',
    title: 'Single Number',
    summary: 'Find the single element that appears only once in an array where every other element appears twice.',
    difficulty: 4,
    tags: ['Bit Manipulation', 'XOR'],
    categorySlug: 'math-bit-tricks',
    entryPoint: 'single_number',
    body: 'Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.\n\nYou must implement a solution with a linear runtime complexity and use only constant extra space. The XOR operator is your friend here!',
    templateCode:
`def single_number(nums):
  # Your code here
  pass`,
    testCases: [
      { input: [[2,2,1]], output: 1 },
      { input: [[4,1,2,1,2]], output: 4 },
      { input: [[1]], output: 1 }
    ]
  },
  {
    slug: 'hamming-weight',
    title: 'Number of 1 Bits',
    summary: 'Return the number of set bits (1s) in an integer.',
    difficulty: 4,
    tags: ['Bit Manipulation'],
    categorySlug: 'math-bit-tricks',
    entryPoint: 'hamming_weight',
    body: 'Write a function that takes an unsigned integer and returns the number of \'1\' bits it has (also known as the Hamming weight).\n\nFor example, the input `11` (binary `1011`) has 3 set bits.',
    templateCode:
`def hamming_weight(n):
  # Your code here
  pass`,
    testCases: [
      { input: [11], output: 3 },
      { input: [128], output: 1 },
      { input: [2147483645], output: 30 }
    ]
  },
  {
    slug: 'missing-number',
    title: 'Missing Number',
    summary: 'Find the missing number in an array containing n distinct numbers in the range [0, n].',
    difficulty: 4,
    tags: ['Bit Manipulation', 'Math', 'XOR'],
    categorySlug: 'math-bit-tricks',
    entryPoint: 'missing_number',
    body: 'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.\n\nThis can be solved using Gauss\'s summation formula or with XOR.',
    templateCode:
`def missing_number(nums):
  # Your code here
  pass`,
    testCases: [
      { input: [[3,0,1]], output: 2 },
      { input: [[0,1]], output: 2 },
      { input: [[9,6,4,2,3,5,7,0,1]], output: 8 }
    ]
  },
  {
    slug: 'course-schedule-ii',
    title: 'Course Schedule II',
    summary: 'Return a valid course order given prerequisites, or an empty list if impossible.',
    difficulty: 6,
    tags: ['Graph', 'DFS', 'Topological Sort', 'BFS'],
    categorySlug: 'graphs',
    entryPoint: 'find_order',
    body: 'This is a follow-up to Course Schedule. This time, you need to return the ordering of courses you should take to finish all courses. If there are multiple valid orderings, return any of them. If it is impossible to finish all courses (i.e., there is a cycle), return an empty list.\n\nThis can be solved using either Kahn\'s algorithm (BFS with in-degrees) or a DFS-based topological sort.',
    templateCode:
`def find_order(numCourses, prerequisites):
  # Your code here
  pass`,
    testCases: [
      { input: [2, [[1,0]]], output: [0,1], compare: "multiset" },
      { input: [4, [[1,0],[2,0],[3,1],[3,2]]], output: [0,1,2,3], compare: "multiset" },
      { input: [1, []], output: [0], compare: "multiset" },
      { input: [2, [[0,1],[1,0]]], output: [], compare: "multiset" }
    ]
  },
  {
    slug: 'middle-of-linked-list',
    title: 'Middle of the Linked List',
    summary: 'Return the middle node (second middle on even length).',
    difficulty: 1,
    tags: ['Linked List', 'Two Pointer'],
    categorySlug: 'linked-lists',
    entryPoint: 'middleNode',
    problemType: 'linked-list',
    body: 'Given the `head` of a singly linked list, return the middle node of the linked list.\n\nIf there are two middle nodes, return the second middle node. This is the classic "fast and slow pointer" problem.',
    templateCode: `from typing import Optional

# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
        
def middleNode(head: Optional[ListNode]) -> Optional[ListNode]:
  # Your code here
  pass`,
    testCases: [
      { input: [[1, 2, 3, 4, 5]], output: [3, 4, 5] },
      { input: [[1, 2, 3, 4, 5, 6]], output: [4, 5, 6] },
      { input: [[1]], output: [1] },
    ],
  },
  {
    slug: 'kth-from-end',
    title: 'Kth Node From End',
    summary: 'Return the k-th node from the end.',
    difficulty: 2,
    tags: ['Linked List', 'Two Pointer'],
    categorySlug: 'linked-lists',
    entryPoint: 'kthFromEnd',
    problemType: 'linked-list',
    body: 'Given the `head` of a linked list and an integer `k`, return the `k`-th node from the end of the list.\n\nUse a lead-lag window of size `k` with two pointers to solve this in a single pass.',
    templateCode: `from typing import Optional

# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def kthFromEnd(head: Optional[ListNode], k: int) -> Optional[ListNode]:
  # Your code here
  pass`,
    testCases: [
      { input: [[1, 2, 3, 4, 5], 2], output: [4, 5] },
      { input: [[1], 1], output: [1] },
      { input: [[1, 2], 1], output: [2] },
    ],
  },
  {
    slug: 'delete-kth-from-end',
    title: 'Delete Kth Node From End',
    summary: 'Remove the k-th node from the end of the list.',
    difficulty: 2,
    tags: ['Linked List', 'Two Pointer'],
    categorySlug: 'linked-lists',
    entryPoint: 'removeNthFromEnd',
    problemType: 'linked-list',
    body: 'Given the `head` of a linked list, remove the `n`-th node from the end of the list and return its head.\n\nThis can be solved in one pass using two pointers. Pay attention to edge cases like removing the head of the list.',
    templateCode: `from typing import Optional

# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def removeNthFromEnd(head: Optional[ListNode], n: int) -> Optional[ListNode]:
  # Your code here
  pass`,
    testCases: [
      { input: [[1, 2, 3, 4, 5], 2], output: [1, 2, 3, 5] },
      { input: [[1], 1], output: [] },
      { input: [[1, 2], 1], output: [1] },
    ],
  },
  {
    slug: 'has-cycle',
    title: 'Linked List Cycle',
    summary: 'Detect if a linked list has a cycle.',
    difficulty: 3,
    tags: ['Linked List', 'Two Pointer', 'Cycle Detection'],
    categorySlug: 'linked-lists',
    entryPoint: 'hasCycle',
    problemType: 'linked-list', // Special handling for list w/ cycle
    body: 'Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer. Return `true` if there is a cycle, `false` otherwise.',
    templateCode: `from typing import Optional

# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def hasCycle(head: Optional[ListNode]) -> bool:
  # Your code here
  pass`,
    testCases: [
      { input: [[3, 2, 0, -4], 1], output: true }, // pos=1
      { input: [[1, 2], 0], output: true },       // pos=0
      { input: [[1], -1], output: false },      // pos=-1 (no cycle)
    ],
  },
  {
    slug: 'is-palindrome-linked-list',
    title: 'Palindrome Linked List',
    summary: 'Check if a linked list is a palindrome.',
    difficulty: 4,
    tags: ['Linked List', 'Two Pointer', 'Reversal'],
    categorySlug: 'linked-lists',
    entryPoint: 'isPalindrome',
    problemType: 'linked-list',
    body: 'Given the head of a singly linked list, return `true` if it is a palindrome.\n\nAn efficient O(1) space solution involves finding the middle of the list, reversing the second half, comparing the two halves, and then (optionally) restoring the list.',
    templateCode: `from typing import Optional

# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def isPalindrome(head: Optional[ListNode]) -> bool:
  # Your code here
  pass`,
    testCases: [
      { input: [[1, 2, 2, 1]], output: true },
      { input: [[1, 2]], output: false },
      { input: [[1, 2, 3, 2, 1]], output: true },
    ],
  },
  {
    slug: 'reorder-list',
    title: 'Reorder List',
    summary: 'Reorder list to L0→Ln→L1→Ln-1...',
    difficulty: 5,
    tags: ['Linked List', 'Two Pointer', 'Reversal'],
    categorySlug: 'linked-lists',
    entryPoint: 'reorderList',
    problemType: 'linked-list',
    body: 'You are given the head of a singly linked list. The list can be represented as: L0 → L1 → … → Ln - 1 → Ln\n\nReorder the list to be on the following form: L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …\n\nYou may not modify the values in the list\'s nodes. Only nodes themselves may be changed. The function should modify the list in-place.',
    templateCode: `from typing import Optional

# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def reorderList(head: Optional[ListNode]) -> None:
  """
  Do not return anything, modify head in-place instead.
  """
  # Your code here
  pass`,
    testCases: [
      { input: [[1, 2, 3, 4]], output: [1, 4, 2, 3] },
      { input: [[1, 2, 3, 4, 5]], output: [1, 5, 2, 4, 3] },
    ],
  },
  {
    slug: 'odd-even-list',
    title: 'Odd Even Linked List',
    summary: 'Group all odd nodes together followed by the even nodes.',
    difficulty: 4,
    tags: ['Linked List', 'Two Pointer'],
    categorySlug: 'linked-lists',
    entryPoint: 'oddEvenList',
    problemType: 'linked-list',
    body: 'Given the `head` of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices, and return the reordered list.\n\nThe first node is considered odd, the second node even, and so on.\n\nNote that the relative order inside both the even and odd groups should remain as it was in the input. You must solve the problem in O(1) extra space complexity and O(n) time complexity.',
    templateCode: `from typing import Optional

# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def oddEvenList(head: Optional[ListNode]) -> Optional[ListNode]:
  # Your code here
  pass`,
    testCases: [
      { input: [[1, 2, 3, 4, 5]], output: [1, 3, 5, 2, 4] },
      { input: [[2, 1, 3, 5, 6, 4, 7]], output: [2, 3, 6, 7, 1, 5, 4] },
    ],
  },
  {
    slug: 'cyclic-sort-problem',
    title: 'Cyclic Sort',
    summary: 'Sort an array of numbers from 1 to n in-place.',
    difficulty: 3,
    tags: ['Array', 'Sorting'],
    categorySlug: 'cyclic-sort',
    entryPoint: 'cyclic_sort',
    body: 'You are given an array containing `n` objects. Each object, when created, was assigned a unique number from 1 to `n` based on its creation sequence. This means that the object with sequence number `3` should be at index `2`, `4` should be at index `3`, and so on.\n\nWrite a function to sort the objects in-place on their creation sequence number in O(n) and without using any extra space. For simplicity, let\'s assume that the objects are just numbers, so we have an array of unique numbers from 1 to `n`.',
    templateCode: `def cyclic_sort(nums):
  # Your code here
  pass`,
    testCases: [
      { input: [[3, 1, 5, 4, 2]], output: [1, 2, 3, 4, 5] },
      { input: [[2, 6, 4, 3, 1, 5]], output: [1, 2, 3, 4, 5, 6] },
      { input: [[1, 5, 6, 4, 3, 2]], output: [1, 2, 3, 4, 5, 6] },
    ],
  },
  {
    slug: 'find-the-missing-number-cyclic',
    title: 'Find the Missing Number',
    summary: 'Find the missing number in an array of n numbers from the range [0, n].',
    difficulty: 4,
    tags: ['Array', 'Sorting', 'Cyclic Sort'],
    categorySlug: 'cyclic-sort',
    entryPoint: 'find_missing_number',
    body: 'We are given an array containing `n` distinct numbers taken from the range `0` to `n`. Since the array has only `n` numbers out of the total `n+1` numbers, find the missing number.\n\nUse the Cyclic Sort pattern to place each number at its correct index.',
    templateCode: `def find_missing_number(nums):
  # Your code here
  pass`,
    testCases: [
      { input: [[4, 0, 3, 1]], output: 2 },
      { input: [[8, 3, 5, 2, 4, 6, 0, 1]], output: 7 },
      { input: [[0, 1, 2, 3]], output: 4 },
    ],
  },
  {
    slug: 'find-all-duplicates-cyclic',
    title: 'Find all Duplicates in an Array',
    summary: 'Find all duplicate numbers in an array of numbers from 1 to n.',
    difficulty: 5,
    tags: ['Array', 'Sorting', 'Cyclic Sort'],
    categorySlug: 'cyclic-sort',
    entryPoint: 'find_all_duplicates',
    body: 'We are given an unsorted array containing `n` numbers taken from the range 1 to `n`. The array has some numbers that appear twice. Find all the duplicate numbers without using any extra space.',
    templateCode: `def find_all_duplicates(nums):
  # Your code here
  pass`,
    testCases: [
      { input: [[3, 4, 4, 5, 5]], output: [4, 5], compare: 'multiset' },
      { input: [[5, 4, 7, 2, 3, 5, 3]], output: [3, 5], compare: 'multiset' },
    ],
  },
  {
    slug: 'find-first-k-missing-positives',
    title: 'Find the First K Missing Positive Numbers',
    summary: 'Find the first k missing positive numbers from an unsorted array.',
    difficulty: 6,
    tags: ['Array', 'Sorting', 'Cyclic Sort'],
    categorySlug: 'cyclic-sort',
    entryPoint: 'find_first_k_missing_positives',
    body: 'Given an unsorted array containing numbers and a number ‘k’, find the first ‘k’ missing positive numbers in the array.\n\nFirst, use Cyclic Sort to place numbers at their correct indices. Then, iterate through the sorted array to find the first `k` missing positive numbers.',
    templateCode: `def find_first_k_missing_positives(nums, k):
  # Your code here
  pass`,
    testCases: [
      { input: [[3, -1, 4, 5, 5], 3], output: [1, 2, 6], compare: 'multiset' },
      { input: [[2, 3, 4], 3], output: [1, 5, 6], compare: 'multiset' },
      { input: [[-2, -3, 4], 2], output: [1, 2], compare: 'multiset' },
    ],
  },
];

    

    