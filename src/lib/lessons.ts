
import { z } from 'zod';

export const LessonSchema = z.object({
  slug: z.string().min(1, 'Slug is required.'),
  title: z.string().min(1, 'Title is required.'),
  excerpt: z.string().min(1, 'Excerpt is required.'),
  tags: z.array(z.string()).min(1, 'At least one tag is required.'),
  body: z.string().min(1, 'Body is required.'),
});

export type Lesson = z.infer<typeof LessonSchema>;

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
  {
    slug: 'understanding-stacks',
    title: 'Understanding Stacks: A Fundamental Data Structure',
    excerpt: 'A stack is a data structure that follows a specific rule: the last item you put in is the first item you can take out. This is known as LIFO, or "Last In, First Out."',
    tags: ['Stack', 'Data Structures', 'LIFO', 'Fundamentals'],
    body: `
# Understanding Stacks: A Fundamental Data Structure

## What is a Stack?

Imagine you're washing dishes and you stack clean plates on top of each other. When you need a plate, you naturally take the one from the top. When you add another clean plate, you place it on top of the pile. You wouldn't reach into the middle or grab from the bottom because that would be awkward and might cause the whole stack to topple over.

This everyday scenario perfectly captures what a stack is in computer science. A stack is a data structure that follows a specific rule: the last item you put in is the first item you can take out. We call this principle **LIFO**, which stands for "Last In, First Out." Just like that pile of plates, you're always working with whatever is on top.

## The Core Operations

A stack has two fundamental operations that define how it works. The first operation is called **push**, which means adding an element to the top of the stack. Think of this as placing a new plate on your pile. The second operation is **pop**, which means removing and returning the element from the top of the stack. This is like taking the top plate off to use it.

Beyond these two essential operations, stacks typically offer a few helpful extras. The **peek** (or sometimes called **top**) operation lets you look at what's on top of the stack without removing it, like glancing at the top plate without picking it up. The **isEmpty** operation tells you whether the stack has any elements in it, and **size** tells you how many elements are currently stacked up.

## Why Stacks Matter

You might wonder why we need such a restrictive data structure. After all, wouldn't it be more flexible to access any element at any time? The beauty of a stack lies precisely in its restrictions. By limiting how we can interact with data, stacks make certain operations incredibly efficient and help us solve specific types of problems elegantly.

Think about the "undo" feature in your text editor. Every time you make a change, that action gets pushed onto a stack. When you press undo, the most recent action gets popped off and reversed. This happens naturally because of the LIFO principle. The stack remembers the order of your actions perfectly, and undoing them in reverse order makes logical sense.

## Real-World Examples in Computing

Stacks appear throughout computer systems in ways you might not expect. When your program calls a function, the computer uses something called the **call stack** to keep track of where to return after the function finishes. Each function call gets pushed onto this stack, and when a function completes, it gets popped off, returning control to wherever it was called from. This is how your computer can handle nested function calls and recursive functions.

Web browsers use stacks to implement the back button. Every time you visit a new page, that URL gets pushed onto a stack. When you click back, the current page is popped off, revealing the previous page underneath. This is why repeatedly clicking back takes you through your browsing history in reverse order.

## A Simple Implementation

Let me show you how you might implement a basic stack in Python to make these concepts concrete:

\`\`\`python
class Stack:
    def __init__(self):
        # We'll use a Python list to store our stack elements
        # The end of the list will represent the "top" of the stack
        self.items = []
    
    def push(self, item):
        # Adding to the end of a list is efficient in Python
        # This becomes our new "top" element
        self.items.append(item)
    
    def pop(self):
        # Check if the stack is empty before trying to pop
        if self.is_empty():
            raise IndexError("Cannot pop from an empty stack")
        # Remove and return the last element (the top)
        return self.items.pop()
    
    def peek(self):
        # Look at the top without removing it
        if self.is_empty():
            raise IndexError("Cannot peek at an empty stack")
        return self.items[-1]
    
    def is_empty(self):
        # A stack is empty when it has no elements
        return len(self.items) == 0
    
    def size(self):
        # Return how many elements are in the stack
        return len(self.items)
\`\`\`

Now let's see this stack in action:

\`\`\`python
# Create a new stack
my_stack = Stack()

# Push some elements onto the stack
my_stack.push("first")
my_stack.push("second")
my_stack.push("third")

# At this point, our stack looks like this (top to bottom):
# third
# second
# first

# Peek at the top element without removing it
print(my_stack.peek())  # Output: "third"

# Pop elements off (they come off in reverse order)
print(my_stack.pop())   # Output: "third"
print(my_stack.pop())   # Output: "second"
print(my_stack.size())  # Output: 1 (only "first" remains)
\`\`\`

## Common Problems Solved with Stacks

Stacks excel at solving problems where you need to process things in reverse order or keep track of nested structures. One classic example is checking whether parentheses in an expression are balanced. When you encounter an opening parenthesis, you push it onto a stack. When you find a closing parenthesis, you pop from the stack and check if they match. If the stack is empty at the end and all parentheses matched properly, the expression is balanced.

Another common use is evaluating mathematical expressions, particularly when converting between different notations like infix (where operators go between operands) and postfix (where operators come after operands). Stacks help maintain the correct order of operations as you process the expression.

Stacks also help solve maze and puzzle problems where you might need to backtrack. As you explore different paths, you push each decision onto a stack. If you reach a dead end, you can pop back to your last decision point and try a different direction.

## Time Complexity and Efficiency

One of the great advantages of stacks is their efficiency. Both push and pop operations typically happen in constant time, meaning they take the same amount of time regardless of how many elements are in the stack. This is written as O(1) in Big O notation. You're always working with the top element, so you never need to search through or reorganize the rest of the stack.

The peek, isEmpty, and size operations are also constant time. This efficiency makes stacks particularly valuable when you need fast, predictable performance for adding and removing elements.

## Key Takeaways

A stack is fundamentally about controlled access to data. By restricting operations to the top element only, stacks provide a simple but powerful way to manage data in situations where LIFO ordering matters. Understanding stacks helps you recognize patterns in everyday computing, from how your programs execute to how your browser remembers where you've been. The simplicity of the stack's interface—push, pop, and peek—belies its versatility in solving complex problems throughout computer science.
    `,
  },
];

    