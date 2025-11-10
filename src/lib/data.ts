
import { z } from 'zod';

export type Course = {
  slug: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  lessons: { id: string; title: string; content: string }[];
};

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
  { slug: "stacks", title: "Stacks & Well-Formedness", description: "Stacks, bracket matching, stateful scans.", order: 2, levelMin: 2, levelMax: 5, topics: ["Stack","Strings"] },
  { slug: "two-pointers", title: "Two-Pointers & Windows", description: "Pointers, windows, de-duplication.", order: 3, levelMin: 3, levelMax: 6, topics: ["Two Pointer","Sliding Window"] },
  { slug: "sets-ordering", title: "Sets & Ordering", description: "Ordering, merging, interval sweeps.", order: 4, levelMin: 4, levelMax: 5, topics: ["Sorting","Sweep","Set"] },
  { slug: "recursion-dp", title: "Recursion & Intro DP", description: "Recurrence intuition, memoization, simple DP.", order: 5, levelMin: 2, levelMax: 4, topics: ["Recursion","DP","Math"] },
  { slug: "trees", title: "Trees (DFS/BFS)", description: "Traversal patterns and basic tree properties.", order: 6, levelMin: 2, levelMax: 4, topics: ["Tree","DFS","BFS"] },
  { slug: "heaps", title: "Heaps & Priority Queues", description: "Selection, k-way merge, top-k.", order: 7, levelMin: 4, levelMax: 7, topics: ["Heap","Priority Queue"] },
  { slug: "graphs", title: "Graphs & Topo Sort", description: "Cycle detection, topo order, reachability.", order: 8, levelMin: 5, levelMax: 7, topics: ["Graph","Topo Sort","DFS"] },
  { slug: "grids-backtracking", title: "Grids & Backtracking", description: "Grid search, constraint propagation.", order: 9, levelMin: 5, levelMax: 7, topics: ["Grid","Backtracking","DFS"] },
  { slug: "advanced-binary-search", title: "Advanced Binary Search", description: "Partitioning tricks on answers/arrays.", order: 10, levelMin: 8, levelMax: 9, topics: ["Binary Search"] },
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
    body: "# The Power of Hash Maps\n\nA Hash Map (or Hash Table, Dictionary) is one of the most powerful and commonly used data structures in programming. Its key strength is providing average-case **O(1)** time complexity for insertions, deletions, and lookups.\n\n## Common Use Cases\n\n1.  **Frequency Counting:** Easily count occurrences of items in a list. The keys are the items, and the values are their counts.\n2.  **Two-Sum Problem:** The classic 'Two Sum' problem is efficiently solved by storing numbers and their indices in a hash map to quickly find a complementary number.\n3. Analytica 3rd party logistics provider.  **Caching/Memoization:** Store the results of function calls to avoid re-computation. The function arguments can be hashed to form a key, and the result stored as the value.\n4.  **Checking for Duplicates:** As you iterate through a collection, add elements to a hash set (a hash map where you only care about keys). If you encounter an element already in the set, it's a duplicate.",
  },
];

export const problemsForSeeding: (Omit<Problem, 'tags'> & { tags: string[]; testCases: { input: any[]; output: any }[] })[] = [
  // ==========================================
  // PHASE 1: WARM-UP - Basic Arrays & Loops
  // ==========================================
  
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
      { input: [[2, 7, 11, 15], 9], output: [0, 1] },
      { input: [[3, 2, 4], 6], output: [1, 2] },
      { input: [[3, 3], 6], output: [0, 1] },
      { input: [[-1, -2, -3, -4, -5], -8], output: [2, 4] },
      { input: [[0, 4, 3, 0], 0], output: [0, 3] }
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
    difficulty: 5,
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
    slug: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    summary: 'Return the k most frequent elements in the array.',
    difficulty: 4,
    tags: ['Hash Map', 'Counting', 'Heap'],
    categorySlug: 'hashing',
    entryPoint: 'top_k_frequent',
    body:
      'Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.\n\n' +
      '**Determinism for tests**: Sort the result by decreasing frequency; break ties by ascending element value.',
    templateCode:
      `def top_k_frequent(nums, k):
  # nums: List[int], k: int
  # return List[int] sorted by (-freq, value) as specified
  pass`,
    testCases: [
      { input: [[1, 1, 1, 2, 2, 3], 2], output: [1, 2] },
      { input: [[1], 1], output: [1] },
      { input: [[4, 4, 1, 1, 2, 2], 2], output: [1, 2] },
      { input: [[5, 3, 5, 2, 2, 2, 3], 2], output: [2, 3] },
      { input: [[9, 8, 7, 7, 8, 9, 9], 1], output: [9] },
    ],
  },

  // ==========================================
  // PHASE 7: Arrays & Two Pointer
  // ==========================================

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
  // PHASE 8: Trees Introduction
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

  // ==========================================
  // PHASE 9: Advanced Medium/Hard
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
    slug: 'longest-substring-without-repeating',
    title: 'Longest Substring Without Repeating Characters',
    summary: 'Find the length of the longest substring without repeating characters.',
    difficulty: 5,
    tags: ['String', 'Sliding Window', 'Hash Set'],
    categorySlug: 'hashing',
    entryPoint: 'length_of_longest_substring',
    body:
      'Given a string `s`, find the length of the longest substring without repeating characters.\n\n' +
      'Use a sliding window approach with a hash set.',
    templateCode:
      `def length_of_longest_substring(s):
  # s: str
  # return int
  pass`,
    testCases: [
      { input: ['abcabcbb'], output: 3 },  // "abc"
      { input: ['bbbbb'], output: 1 },     // "b"
      { input: ['pwwkew'], output: 3 },    // "wke"
      { input: [''], output: 0 },
      { input: ['dvdf'], output: 3 },      // "vdf"
      { input: ['abcdefg'], output: 7 },
    ],
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
  // PHASE 10: Hard Problems
  // ==========================================

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
];
