export type Lesson = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  body: string;
};

export const lessons: Lesson[] = [
  {
    slug: 'space-time-complexity',
    title: 'A Practical Guide to Space & Time Complexity',
    excerpt: 'Understand the fundamental trade-offs between memory usage (space) and algorithm speed (time).',
    tags: ['Big-O', 'Analysis', 'Fundamentals'],
    body: `
# Space vs. Time Complexity

In algorithm design, you'll constantly face a trade-off between how much memory (space) your algorithm uses and how fast it runs (time). This is known as the space-time complexity trade-off.

## Understanding the Trade-off

- **More Space, Less Time:** Sometimes, you can make an algorithm faster by using more memory. A classic example is caching or memoization. By storing the results of expensive computations, you avoid re-calculating them, which speeds up runtime at the cost of the memory used for storage.
- **Less Space, More Time:** Conversely, you can often reduce memory usage at the cost of runtime. For instance, instead of storing a large pre-computed table, you might compute values on the fly, which saves space but takes more time for each computation.
    `,
  },
  {
    slug: 'when-to-use-hashmap',
    title: 'When Should You Use a Hash Map?',
    excerpt: 'Hash Maps are incredibly versatile. Learn the common patterns where they are the ideal data structure.',
    tags: ['Hash Map', 'Data Structures', 'Patterns'],
    body: `
# The Power of Hash Maps

A Hash Map (or Hash Table, Dictionary) is one of the most powerful and commonly used data structures in programming. Its key strength is providing average-case **O(1)** time complexity for insertions, deletions, and lookups.

## Common Use Cases

1.  **Frequency Counting:** Easily count occurrences of items in a list. The keys are the items, and the values are their counts.
2.  **Two-Sum Problem:** The classic 'Two Sum' problem is efficiently solved by storing numbers and their indices in a hash map to quickly find a complementary number.
3.  **Caching/Memoization:** Store the results of function calls to avoid re-computation. The function arguments can be hashed to form a key, and the result stored as the value.
4.  **Checking for Duplicates:** As you iterate through a collection, add elements to a hash set (a hash map where you only care about keys). If you encounter an element already in the set, it's a duplicate.
    `,
  },
];
