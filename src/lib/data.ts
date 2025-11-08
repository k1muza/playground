import { z } from 'zod';

export type Course = {
  slug: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  lessons: { id: string; title: string; content: string }[];
};

// Represents the data stored in the main `problems/{slug}` document.
// The `testCases` array is removed from here.
export const ProblemSchema = z.object({
  slug: z.string().min(1, 'Slug is required.'),
  title: z.string().min(1, 'Title is required.'),
  summary: z.string().min(1, 'Summary is required.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  tags: z.array(z.string()).min(1, 'At least one tag is required.'),
  body: z.string().min(1, 'Problem body is required.'),
  templateCode: z.string().min(1, 'Template code is required.'),
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


export const SolutionSchema = z.object({
  problemId: z.string(),
  userId: z.string(),
  solutionCode: z.string(),
  submissionDate: z.string(),
  isCorrect: z.boolean(),
});

export type Solution = z.infer<typeof SolutionSchema>;


export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  body: string;
};

export const courses: Course[] = [
  {
    slug: 'intro-data-structures',
    title: 'Intro to Data Structures',
    description: 'A comprehensive look at Arrays, Linked Lists, Stacks, Queues, and Hash Maps.',
    level: 'Beginner',
    topics: ['Arrays', 'Linked List', 'Stack', 'Queue', 'Hash Map'],
    lessons: [
      {
        id: 'arrays',
        title: 'Arrays',
        content: '# Understanding Arrays\n\nArrays are one of the most fundamental data structures in computer science. They represent a collection of elements, typically of the same type, stored in contiguous memory locations. This contiguous nature is key to their primary advantage: fast access to elements.\n\n## Key Characteristics\n\n- **Fixed-Size:** In many languages, arrays have a fixed size defined at creation. Resizing an array often means creating a new, larger array and copying elements over.\n- **Contiguous Memory:** Elements are stored one after another in memory, which allows for efficient cache utilization.\n- **O(1) Access:** You can access any element in an array in constant time using its index (e.g., `myArray[5]`). This is because the memory address can be calculated directly from the base address and the index.',
      },
      {
        id: 'linked-lists',
        title: 'Linked Lists',
        content: '# An Introduction to Linked Lists\n\nA linked list is a linear data structure where elements are not stored at contiguous memory locations. Instead, elements are stored in "nodes," and each node contains its data and a pointer (or link) to the next node in the sequence.\n\n## Core Concepts\n\n- **Node:** The basic unit of a linked list. It contains two pieces of information: the data (payload) and a reference to the next node.\n- **Head:** The entry point to the linked list. It\'s a pointer to the very first node.\n- **Tail:** The last node in the list. Its "next" pointer is typically `null`, indicating the end of the list.\n\n## Types of Linked Lists\n\n- **Singly Linked List:** Each node points only to the next node. Traversal is unidirectional.\n- **Doubly Linked List:** Each node points to both the next and the previous node, allowing for bidirectional traversal.',
      },
      {
        id: 'stacks-queues',
        title: 'Stacks & Queues',
        content: "# Stacks & Queues\n\nStacks and Queues are abstract data types, often implemented using Arrays or Linked Lists. They define rules for how elements are added and removed.\n\n## Stacks (LIFO)\n\nA stack follows the **Last-In, First-Out (LIFO)** principle. The last element added to the stack is the first one to be removed. Think of a stack of plates.\n\n- **Push:** Add an element to the top of the stack.\n- **Pop:** Remove the element from the top of the stack.\n\n## Queues (FIFO)\n\nA queue follows the **First-In, First-Out (FIFO)** principle. The first element added is the first one to be removed. Think of a checkout line at a store.\n\n- **Enqueue:** Add an element to the back (tail) of the queue.\n- **Dequeue:** Remove the element from the front (head) of the queue.",
      },
    ],
  },
  {
    slug: 'algorithms-i',
    title: 'Algorithms I',
    description: 'Learn the fundamentals of algorithmic thinking, including complexity analysis and classic algorithms.',
    level: 'Intermediate',
    topics: ['Big-O', 'Binary Search', 'Sorting', 'Recursion'],
    lessons: [
      {
        id: 'o-notation',
        title: 'Big-O Notation',
        content: "# Big-O Notation\n\nBig-O notation is a mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity. In computer science, we use it to classify algorithms accordingto how their run time or space requirements grow as the input size grows.\n\n## Common Complexities\n\n- **O(1) - Constant:** The runtime does not change with the input size.\n- **O(log n) - Logarithmic:** The runtime grows logarithmically with the input size. Common in search algorithms like binary search.\n- **O(n) - Linear:** The runtime grows linearly with the input size. A simple `for` loop is often O(n).\n- **O(n^2) - Quadratic:** The runtime grows quadratically. Common in nested loops.",
      },
      {
        id: 'binary-search',
        title: 'Binary Search',
        content: "# Binary Search Algorithm\n\nBinary search is a highly efficient searching algorithm. It works on the principle of **divide and conquer** and is only applicable to a **sorted** array.\n\n## How It Works\n\n1. Compare the target value to the middle element of the array.\n2. If they are not equal, the half in which the target cannot lie is eliminated, and the search continues on the remaining half.\n3. This process is repeated until the target value is found or the remaining half is empty.",
      },
    ],
  },
];

export const articles: Article[] = [
  {
    slug: 'space-time-complexity',
    title: 'A Practical Guide to Space & Time Complexity',
    excerpt: 'Understand the fundamental trade-offs between memory usage (space) and algorithm speed (time).',
    tags: ['Big-O', 'Analysis', 'Fundamentals'],
    body: "# Space vs. Time Complexity\n\nIn algorithm design, you'll constantly face a trade-off between how much memory (space) your algorithm uses and how fast it runs (time). This is known as the space-time complexity trade-off.\n\n## Understanding the Trade-off\n\n- **More Space, Less Time:** Sometimes, you can make an algorithm faster by using more memory. A classic example is caching or memoization. By storing the results of expensive computations, you avoid re-calculating them, which speeds up runtime at the cost of the memory used for storage.\n- **Less Space, More Time:** Conversely, you can often reduce memory usage at the cost of runtime. For instance, instead of storing a large pre-computed table, you might compute values on the fly, which saves space but takes more time for each computation.",
  },
  {
    slug: 'when-to-use-hashmap',
    title: 'When Should You Use a Hash Map?',
    excerpt: 'Hash Maps are incredibly versatile. Learn the common patterns where they are the ideal data structure.',
    tags: ['Hash Map', 'Data Structures', 'Patterns'],
    body: "# The Power of Hash Maps\n\nA Hash Map (or Hash Table, Dictionary) is one of the most powerful and commonly used data structures in programming. Its key strength is providing average-case **O(1)** time complexity for insertions, deletions, and lookups.\n\n## Common Use Cases\n\n1.  **Frequency Counting:** Easily count occurrences of items in a list. The keys are the items, and the values are their counts.\n2.  **Two-Sum Problem:** The classic 'Two Sum' problem is efficiently solved by storing numbers and their indices in a hash map to quickly find a complementary number.\n3 Analytica 3rd party logistics provider.  **Caching/Memoization:** Store the results of function calls to avoid re-computation. The function arguments can be hashed to form a key, and the result stored as the value.\n4.  **Checking for Duplicates:** As you iterate through a collection, add elements to a hash set (a hash map where you only care about keys). If you encounter an element already in the set, it's a duplicate.",
  },
];

// This is the data that will be seeded into Firestore.
export const problemsForSeeding: (Omit<Problem, 'tags'> & { tags: string[]; testCases: { input: any[]; output: any }[] })[] = [
  {
    slug: 'two-sum',
    title: 'Two Sum',
    summary: 'Find two numbers in an array that add up to a specific target.',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Map'],
    body:
      'Given an array of integers `nums` and an integer `target`, return indices i and j (with i < j) such that `nums[i] + nums[j] = target`.\n\n' +
      'You may assume that each input has **exactly one solution**, and you may not use the same element twice.\n\n' +
      'Return the indices as `[i, j]` with `i < j`.',
    templateCode:
      `def solution(nums, target):
  # Your code here
  pass`,
    testCases: [
      { input: [[2, 7, 11, 15], 9], output: [0, 1] },
      { input: [[3, 2, 4], 6], output: [1, 2] },
      { input: [[3, 3], 6], output: [0, 1] },
      { input: [[-1, -2, -3, -4, -5], -8], output: [2, 4] },
      { input: [[0, 4, 3, 0], 0], output: [0, 3] }
    ],
  },
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    summary: 'Determine if a string of brackets is valid and well-formed using a stack.',
    difficulty: 'Easy',
    tags: ['Stack', 'String'],
    body:
      'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\n' +
      'Assume `s` contains **only** these bracket characters (no letters or spaces).\n\n' +
      'An input string is valid if:\n' +
      '1. Open brackets must be closed by the same type of brackets.\n' +
      '2. Open brackets must be closed in the correct order.\n' +
      '3. Every close bracket has a corresponding open bracket of the same type.',
    templateCode:
      `def solution(s):
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
    slug: 'reverse-string',
    title: 'Reverse String',
    summary: 'Write a recursive function that reverses a string.',
    difficulty: 'Easy',
    tags: ['String', 'Recursion'],
    body:
      'Write a function that reverses a string. Do this recursively.\n\n' +
      'For example, `solution("hello")` should return `"olleh"`.',
    templateCode:
      `def solution(s):
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
    slug: 'fibonacci-number',
    title: 'Fibonacci Number',
    summary: 'Calculate the nth Fibonacci number.',
    difficulty: 'Easy',
    tags: ['Recursion', 'Math'],
    body:
      'The Fibonacci numbers are defined by `F(0)=0`, `F(1)=1`, and `F(n)=F(n-1)+F(n-2)` for `n>1`.\n\n' +
      'Given `n`, calculate `F(n)`.\n\n' +
      'Constraints: `0 ≤ n ≤ 30`. Use any approach (iterative, memoized recursion, etc.).',
    templateCode:
      `def solution(n):
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
    slug: 'merge-k-lists',
    title: 'Merge k Sorted Arrays',
    summary: 'Use a min-heap to efficiently merge k sorted arrays.',
    difficulty: 'Hard',
    tags: ['Heap', 'Array', 'Priority Queue'],
    body:
      'You are given an array of `k` sorted arrays `lists`.\n\n' +
      'Merge them into a single sorted array and return it.\n\n' +
      'Example: `lists=[[1,4,5],[1,3,4],[2,6]]` → `[1,1,2,3,4,4,5,6]`',
    templateCode:
      `def solution(lists):
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
    slug: 'binary-tree-inorder-traversal',
    title: 'Binary Tree Inorder Traversal',
    summary: 'Traverse a binary tree in the order: left, root, right.',
    difficulty: 'Easy',
    tags: ['Tree', 'Stack', 'Recursion'],
    body:
      'The tree node is a dict: `{"val": int, "left": node|None, "right": node|None}`.\n' +
      'Return the inorder traversal (left, root, right) as a list of values.',
    templateCode:
      `def solution(root):
  # root: dict|None with keys val,left,right
  pass`,
    testCases: [
      { input: [null], output: [] },
      { input: [{ val: 1, left: null, right: null }], output: [1] },
      { input: [{ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } }], output: [2, 1, 3] },
      { input: [{ val: 2, left: { val: 1, left: null, right: null }, right: { val: 4, left: { val: 3, left: null, right: null }, right: null } }], output: [1, 2, 3, 4] }
    ],
  },
  {
    slug: 'merge-intervals',
    title: 'Merge Intervals',
    summary: 'Given a collection of intervals, merge all overlapping intervals.',
    difficulty: 'Medium',
    tags: ['Array', 'Sorting'],
    body:
      'Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals.\n' +
      'Intervals may be unsorted. Return merged intervals sorted by start.',
    templateCode:
      `def solution(intervals):
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

  // --- Simple loop problems ---

  {
    slug: 'max-value',
    title: 'Max Value',
    summary: 'Return the largest number in the list.',
    difficulty: 'Easy',
    tags: ['Array', 'Loop'],
    body:
      'Write a function, `max_value`, that takes in a list of numbers as an argument. ' +
      'The function should return the largest number in the list.\n\n' +
      'Assume the list is non-empty.',
    templateCode:
      `def solution(nums):
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
    slug: 'longest-word',
    title: 'Longest Word',
    summary: 'Return the longest word in a sentence; ties go to the later word.',
    difficulty: 'Easy',
    tags: ['String', 'Loop'],
    body:
      'Write a function, `longest_word`, that takes in a sentence string as an argument. ' +
      'The function should return the longest word in the sentence. If there is a tie, return the word that occurs later in the sentence.\n\n' +
      'Assume the sentence is non-empty and words are space-separated.',
    templateCode:
      `def solution(sentence):
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
    slug: 'is-prime',
    title: 'Is Prime',
    summary: 'Return whether a number is prime.',
    difficulty: 'Easy',
    tags: ['Math', 'Primality', 'Loop'],
    body:
      'Write a function, `is_prime`, that takes in a number `n` as an argument. ' +
      'The function should return a boolean indicating whether or not `n` is prime.\n\n' +
      'A prime number is an integer greater than 1 with no positive divisors other than 1 and itself.',
    templateCode:
      `def solution(n):
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

  {
    slug: 'group-anagrams',
    title: 'Group Anagrams',
    summary: 'Group words that are anagrams of each other.',
    difficulty: 'Medium',
    tags: ['Hash Map', 'Counting', 'String'],
    body:
      'Given an array of strings `strs`, group the anagrams together and return the groups.\n\n' +
      '**Determinism for tests**: Within each group, return words sorted lexicographically. ' +
      'Across groups, sort groups by their **first** word.\n\n' +
      'Example: `["eat","tea","tan","ate","nat","bat"]` → `[[' +
      "ate','eat','tea'],['bat'],['nat','tan']" +
      ']`.',
    templateCode:
      `def solution(strs):
  # strs: List[str]
  # return List[List[str]] following the deterministic sorting rules above
  pass`,
    testCases: [
      {
        input: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']],
        output: [['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]
      },
      {
        input: [['']],
        output: [['']]
      },
      {
        input: [['a']],
        output: [['a']]
      },
      {
        input: [['ab', 'ba', 'abc', 'bca', 'cab', 'zzz']],
        output: [['ab', 'ba'], ['abc', 'bca', 'cab'], ['zzz']]
      },
    ],
  },

  {
    slug: 'longest-consecutive-sequence',
    title: 'Longest Consecutive Sequence',
    summary: 'Find the length of the longest run of consecutive integers.',
    difficulty: 'Medium',
    tags: ['Hash Set', 'Array'],
    body:
      'Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.\n\n' +
      'You must write an algorithm that runs in O(n) average time using a hash set.',
    templateCode:
      `def solution(nums):
  # nums: List[int]
  # return int
  pass`,
    testCases: [
      { input: [[100, 4, 200, 1, 3, 2]], output: 4 },           // 1,2,3,4
      { input: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], output: 9 },       // 0..8
      { input: [[9]], output: 1 },
      { input: [[-1, -2, -3, 10, 11]], output: 3 },        // -3,-2,-1
      { input: [[]], output: 0 },
    ],
  },

  {
    slug: 'subarray-sum-equals-k',
    title: 'Subarray Sum Equals K',
    summary: 'Count the number of subarrays whose sum equals k.',
    difficulty: 'Medium',
    tags: ['Hash Map', 'Prefix Sum', 'Array'],
    body:
      'Given an array of integers `nums` and an integer `k`, return the total number of continuous subarrays whose sum equals `k`.\n\n' +
      'Use a prefix-sum hash map to achieve O(n).',
    templateCode:
      `def solution(nums, k):
  # nums: List[int], k: int
  # return int
  pass`,
    testCases: [
      { input: [[1, 1, 1], 2], output: 2 },
      { input: [[1, 2, 3], 3], output: 2 },                  // [1,2], [3]
      { input: [[-1, -1, 1], 0], output: 1 },                // [-1,-1,1]
      { input: [[0, 0, 0], 0], output: 6 },                  // all subarrays
      { input: [[3, 4, 7, 2, -3, 1, 4, 2], 7], output: 4 },
    ],
  },

  {
    slug: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    summary: 'Return the k most frequent elements in the array.',
    difficulty: 'Medium',
    tags: ['Hash Map', 'Counting', 'Heap'],
    body:
      'Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.\n\n' +
      '**Determinism for tests**: Sort the result by decreasing frequency; break ties by ascending element value.',
    templateCode:
      `def solution(nums, k):
  # nums: List[int], k: int
  # return List[int] sorted by (-freq, value) as specified
  pass`,
    testCases: [
      { input: [[1, 1, 1, 2, 2, 3], 2], output: [1, 2] },
      { input: [[1], 1], output: [1] },
      { input: [[4, 4, 1, 1, 2, 2], 2], output: [1, 2] },        // tie freq=2 -> 1,2
      { input: [[5, 3, 5, 2, 2, 2, 3], 2], output: [2, 3] },      // freq: 2->3, 3->2, 5->2
      { input: [[9, 8, 7, 7, 8, 9, 9], 1], output: [9] },
    ],
  },

  {
    slug: 'valid-sudoku',
    title: 'Valid Sudoku',
    summary: 'Check whether a partially filled 9×9 Sudoku board is valid.',
    difficulty: 'Medium',
    tags: ['Hash Set', 'Grid'],
    body:
      'Determine if a 9×9 Sudoku board is valid. Only the filled cells need to be validated.\n\n' +
      'A board is valid if each row, each column, and each of the nine 3×3 sub-boxes contains no duplicate digits 1–9. ' +
      'Empty cells are represented by `"."`.\n\n' +
      'Return `True` if valid, else `False`.',
    templateCode:
      `def solution(board):
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
        output: false                                        // duplicate '8' in col/box
      }
    ],
  },

  {
    slug: 'anagrams',
    title: 'Anagrams',
    summary: 'Return whether two strings are anagrams.',
    difficulty: 'Easy',
    tags: ['String', 'Hash Map', 'Counting'],
    body:
      'Write a function, `anagrams`, that takes in two strings as arguments. ' +
      'The function should return a boolean indicating whether or not the strings are anagrams. ' +
      'Anagrams are strings that contain the same characters, but in any order.\n\n' +
      'Assume ASCII and ignore spaces; compare case-insensitively.',
    templateCode:
      `def solution(s1, s2):
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
    slug: 'most-frequent-char',
    title: 'Most Frequent Character',
    summary: 'Return the most frequent character; ties go to earliest appearance.',
    difficulty: 'Easy',
    tags: ['String', 'Counting'],
    body:
      'Write a function, `most_frequent_char`, that takes in a string as an argument. ' +
      'The function should return the most frequent character of the string. ' +
      'If there are ties, return the character that appears earlier in the string.\n\n' +
      'Assume the input is a non-empty ASCII string.',
    templateCode:
      `def solution(s):
  # Your code here
  pass`,
    testCases: [
      { input: ['bookeeper'], output: 'e' },
      { input: ['mississippi'], output: 'i' }, // tie (i,s) -> earliest is 'i'
      { input: ['abc'], output: 'a' },
      { input: ['aabbccdde'], output: 'a' },
      { input: ['zzzza'], output: 'z' }
    ],
  },
  {
    slug: 'intersection',
    title: 'Intersection',
    summary: 'Return the elements common to both lists.',
    difficulty: 'Easy',
    tags: ['Array', 'Set'],
    body:
      'Write a function, `intersection`, that takes in two lists, `a` and `b`, as arguments. ' +
      'The function should return a new list containing elements that are in **both** of the two lists.\n\n' +
      'You may assume that each input list does **not** contain duplicate elements.\n' +
      'Return the result in the order those elements appear in the first list `a`.',
    templateCode:
      `def solution(a, b):
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
];
