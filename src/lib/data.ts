export type Course = {
  slug: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  lessons: { id: string; title: string; content: string }[];
};

export type Problem = {
  slug: string;
  title: string;
  summary: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  body: string;
  templateCode: string;
  testCases: {
    input: any[];
    output: any;
  }[];
};

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
        content: "# Stacks & Queues\n\nStacks and Queues are abstract data types, often implemented using Arrays or Linked Lists. They define rules for how elements are added and removed.\n\n## Stacks (LIFO)\n\nA stack follows the **Last-In, First-Out (LIFO)** principle. The last element added to the stack is the first one to be removed. Think of a stack of plates.\n\n- **Push:** Add an element to the top of the stack.\n- **Pop:** Remove the element from the top of the stack.\n\n## Queues (FIFO)\n\nA queue follows the **First-In, First-Out (FIFO)** principle. The first element added is the first one to be removed. Think of a checkout line at a store.\n\n- **Enqueue:** Add an element to the back (tail) of the queue.\n- **Dequeue:** Remove the element from the front (head) of thequeue.",
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

export const problems: Problem[] = [
  {
    slug: 'two-sum',
    title: 'Two Sum',
    summary: 'Find two numbers in an array that add up to a specific target.',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Map'],
    body: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    templateCode: 'def solution(nums, target):\n  # Your code here\n  pass',
    testCases: [
      { input: [[2, 7, 11, 15], 9], output: [0, 1] },
      { input: [[3, 2, 4], 6], output: [1, 2] },
      { input: [[3, 3], 6], output: [0, 1] },
    ],
  },
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    summary: 'Determine if a string of brackets is valid and well-formed using a stack.',
    difficulty: 'Easy',
    tags: ['Stack', 'String'],
    body: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    templateCode: 'def solution(s):\n  # Your code here\n  pass',
    testCases: [
      { input: ['()'], output: true },
      { input: ['()[]{}'], output: true },
      { input: ['(]'], output: false },
      { input: ['([)]'], output: false },
      { input: ['{[]}'], output: true },
    ],
  },
  {
    slug: 'merge-k-lists',
    title: 'Merge k Sorted Lists',
    summary: 'Use a min-heap to efficiently merge k sorted linked lists.',
    difficulty: 'Hard',
    tags: ['Heap', 'Linked List'],
    body: 'You are given an array of `k` linked-lists `lists`, where each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.\n\n*(Note: For this problem, the runner does not yet support Linked List data structures. The tests will pass with an empty list implementation for now.)*',
    templateCode: 'def solution(lists):\n  # Your code here\n  return []',
    testCases: [
      { input: [[]], output: [] },
    ],
  },
  {
    slug: 'binary-tree-inorder-traversal',
    title: 'Binary Tree Inorder Traversal',
    summary: 'Traverse a binary tree in the order: left, root, right.',
    difficulty: 'Easy',
    tags: ['Tree', 'Stack', 'Recursion'],
    body: 'Given the `root` of a binary tree, return the inorder traversal of its nodes\' values.\n\n*(Note: For this problem, the runner does not yet support Tree data structures. The tests will pass with an empty list implementation for now.)*',
    templateCode: 'def solution(root):\n  # Your code here\n  return []',
    testCases: [
      { input: [[]], output: [] },
    ],
  },
  {
    slug: 'merge-intervals',
    title: 'Merge Intervals',
    summary: 'Given a collection of intervals, merge all overlapping intervals.',
    difficulty: 'Medium',
    tags: ['Array', 'Sorting'],
    body: 'Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    templateCode: 'def solution(intervals):\n  # Your code here\n  pass',
    testCases: [
      {
        input: [[[1, 3], [2, 6], [8, 10], [15, 18]]],
        output: [[1, 6], [8, 10], [15, 18]],
      },
      {
        input: [[[1, 4], [4, 5]]],
        output: [[1, 5]],
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
