export type Course = {
  slug: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  lessons: { id: string; title: string; content: string }[];
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
        content: `
# Understanding Arrays

Arrays are one of the most fundamental data structures in computer science. They represent a collection of elements, typically of the same type, stored in contiguous memory locations. This contiguous nature is key to their primary advantage: fast access to elements.

## Key Characteristics

- **Fixed-Size:** In many languages, arrays have a fixed size defined at creation. Resizing an array often means creating a new, larger array and copying elements over.
- **Contiguous Memory:** Elements are stored one after another in memory, which allows for efficient cache utilization.
- **O(1) Access:** You can access any element in an array in constant time using its index (e.g., \`myArray[5]\`). This is because the memory address can be calculated directly from the base address and the index.
        `,
      },
      {
        id: 'linked-lists',
        title: 'Linked Lists',
        content: `
# An Introduction to Linked Lists

A linked list is a linear data structure where elements are not stored at contiguous memory locations. Instead, elements are stored in "nodes," and each node contains its data and a pointer (or link) to the next node in the sequence.

## Core Concepts

- **Node:** The basic unit of a linked list. It contains two pieces of information: the data (payload) and a reference to the next node.
- **Head:** The entry point to the linked list. It's a pointer to the very first node.
- **Tail:** The last node in the list. Its "next" pointer is typically \`null\`, indicating the end of the list.

## Types of Linked Lists

- **Singly Linked List:** Each node points only to the next node. Traversal is unidirectional.
- **Doubly Linked List:** Each node points to both the next and the previous node, allowing for bidirectional traversal.
        `,
      },
      {
        id: 'stacks-queues',
        title: 'Stacks & Queues',
        content: `
# Stacks & Queues

Stacks and Queues are abstract data types, often implemented using Arrays or Linked Lists. They define rules for how elements are added and removed.

## Stacks (LIFO)

A stack follows the **Last-In, First-Out (LIFO)** principle. The last element added to the stack is the first one to be removed. Think of a stack of plates.

- **Push:** Add an element to the top of the stack.
- **Pop:** Remove the element from the top of the stack.

## Queues (FIFO)

A queue follows the **First-In, First-Out (FIFO)** principle. The first element added is the first one to be removed. Think of a checkout line at a store.

- **Enqueue:** Add an element to the back (tail) of the queue.
- **Dequeue:** Remove the element from the front (head) of the queue.
        `,
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
        content: `
# Big-O Notation

Big-O notation is a mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity. In computer science, we use it to classify algorithms accordingto how their run time or space requirements grow as the input size grows.

## Common Complexities

- **O(1) - Constant:** The runtime does not change with the input size.
- **O(log n) - Logarithmic:** The runtime grows logarithmically with the input size. Common in search algorithms like binary search.
- **O(n) - Linear:** The runtime grows linearly with the input size. A simple \`for\` loop is often O(n).
- **O(n^2) - Quadratic:** The runtime grows quadratically. Common in nested loops.
        `,
      },
      {
        id: 'binary-search',
        title: 'Binary Search',
        content: `
# Binary Search Algorithm

Binary search is a highly efficient searching algorithm. It works on the principle of **divide and conquer** and is only applicable to a **sorted** array.

## How It Works

1. Compare the target value to the middle element of the array.
2. If they are not equal, the half in which the target cannot lie is eliminated, and the search continues on the remaining half.
3. This process is repeated until the target value is found or the remaining half is empty.
        `,
      },
    ],
  },
];
