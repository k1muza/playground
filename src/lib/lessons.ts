
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
  {
    slug: 'understanding-hashmaps',
    title: 'Understanding HashMaps: The Power of Key-Value Storage',
    excerpt: 'A HashMap is a data structure that stores data as key-value pairs, providing incredibly fast lookups.',
    tags: ['Hash Map', 'Data Structures', 'Key-Value', 'Fundamentals'],
    body: `
# Understanding HashMaps: The Power of Key-Value Storage

## What is a HashMap?

Imagine you're organizing a library, but instead of arranging books by where they fit on the shelf, you create a magical catalog system. In this system, you can simply say the book's title, and the catalog instantly tells you exactly which shelf and position holds that book. You don't need to search through every shelf or remember any particular order. The title itself becomes a direct pathway to finding the book.

This is essentially what a HashMap does in computer science. A HashMap, also called a hash table or dictionary in some programming languages, is a data structure that stores data as key-value pairs. You provide a key, which is like the book title in our example, and the HashMap gives you back the associated value, which is like the book's location. The remarkable thing about HashMaps is their speed. Unlike searching through a list where you might need to check every item, a HashMap can find your data almost instantly, regardless of how much information it contains.

## How HashMaps Actually Work

The secret behind a HashMap's speed lies in something called a hash function. Think of a hash function as a sophisticated formula that converts your key into a number. This number then determines where in memory the HashMap will store your value. It's like having a formula that converts a book title into a shelf number, so you always know exactly where to look.

Let me walk you through what happens when you store something in a HashMap. Suppose you want to store the fact that John's phone number is 555-0123. You call the HashMap's put operation with the key "John" and the value "555-0123". The HashMap takes the key "John" and runs it through its hash function, which might produce a number like 42. The HashMap then stores "555-0123" in position 42 of its internal array. Later, when you want to retrieve John's number, you provide the key "John" again. The HashMap runs "John" through the same hash function, gets 42, looks in position 42, and immediately finds the phone number. No searching required.

## The Challenge of Collisions

You might wonder what happens if two different keys produce the same hash value. This situation is called a collision, and it's one of the fundamental challenges in implementing HashMaps. Imagine two different book titles that, according to your formula, should go on the same shelf. You can't put both books in exactly the same spot, so you need a strategy for handling this conflict.

There are several approaches to handling collisions, but let's focus on the most common one called chaining. With chaining, each position in the HashMap's internal array doesn't just hold a single value. Instead, it holds a small list of all the key-value pairs that hashed to that position. So if both "John" and "Jane" hash to position 42, position 42 would contain a short list with both entries. When you look up "John", the HashMap goes to position 42 and then checks through that small list to find the exact entry for "John". This is still much faster than searching through all the data in the HashMap.

Another approach is called open addressing. When a collision occurs, instead of creating a list at that position, the HashMap looks for the next available empty position and stores the value there. This is like saying, "Well, shelf 42 is full, so let's put it on shelf 43 instead." The HashMap remembers this adjustment so it can find the value later.

## Real-World Applications

HashMaps are everywhere in modern programming because they solve such a common problem: quickly looking up information based on some identifier. When you log into a website, the server might use a HashMap to quickly find your user information based on your username. The username is the key, and your account details are the value.

Databases use hash tables internally to speed up queries. When you search for a record by its ID, the database can use hashing to jump directly to that record instead of scanning through potentially millions of entries. This is why database lookups by primary key are so fast.

Web browsers use HashMaps to implement caches. When you visit a website, the browser might store the website's resources in a HashMap with the URL as the key. The next time you visit that page, the browser can instantly check if it already has those resources cached by looking them up in the HashMap.

Compilers and interpreters use HashMaps to implement symbol tables. When you declare a variable in your code, the compiler stores that variable's information in a HashMap, using the variable name as the key. This allows the compiler to quickly look up information about any variable whenever it encounters that name in the code.

## A Python Implementation

Let me show you how you might implement a simple HashMap in Python. This implementation will help you understand what's happening under the hood, even though in practice you'd usually use Python's built-in dictionary, which is itself a sophisticated HashMap implementation.

\`\`\`python
class HashMap:
    def __init__(self, initial_capacity=16):
        # Start with an array of a certain size
        # Each position will hold a list to handle collisions (chaining)
        self.capacity = initial_capacity
        self.size = 0
        # Create an array of empty lists
        self.buckets = [[] for _ in range(self.capacity)]
    
    def _hash(self, key):
        # Convert the key to a number using Python's built-in hash function
        # Then use modulo to ensure it fits within our array size
        # This is our hash function that determines where to store the value
        return hash(key) % self.capacity
    
    def put(self, key, value):
        # Store or update a key-value pair
        # First, figure out which bucket (position) this key belongs in
        bucket_index = self._hash(key)
        bucket = self.buckets[bucket_index]
        
        # Check if this key already exists in the bucket
        # If so, update its value instead of adding a duplicate
        for i, (existing_key, existing_value) in enumerate(bucket):
            if existing_key == key:
                bucket[i] = (key, value)  # Update existing entry
                return
        
        # Key doesn't exist yet, so add it as a new entry
        bucket.append((key, value))
        self.size += 1
        
        # If the HashMap is getting too full, we should resize it
        # We'll keep this simple for now and just note where it would happen
        load_factor = self.size / self.capacity
        if load_factor > 0.7:
            self._resize()
    
    def get(self, key):
        # Retrieve the value associated with a key
        # Calculate which bucket to look in
        bucket_index = self._hash(key)
        bucket = self.buckets[bucket_index]
        
        # Search through the bucket for our key
        for stored_key, stored_value in bucket:
            if stored_key == key:
                return stored_value
        
        # Key not found
        raise KeyError(f"Key '{key}' not found in HashMap")
    
    def remove(self, key):
        # Remove a key-value pair
        bucket_index = self._hash(key)
        bucket = self.buckets[bucket_index]
        
        # Find and remove the key from the bucket
        for i, (stored_key, stored_value) in enumerate(bucket):
            if stored_key == key:
                del bucket[i]
                self.size -= 1
                return stored_value
        
        raise KeyError(f"Key '{key}' not found in HashMap")
    
    def contains(self, key):
        # Check if a key exists without retrieving its value
        try:
            self.get(key)
            return True
        except KeyError:
            return False
    
    def _resize(self):
        # When the HashMap gets too full, double its size
        # This keeps operations fast by reducing collisions
        old_buckets = self.buckets
        self.capacity *= 2
        self.buckets = [[] for _ in range(self.capacity)]
        self.size = 0
        
        # Re-insert all existing entries with the new capacity
        # This is necessary because the hash function depends on capacity
        for bucket in old_buckets:
            for key, value in bucket:
                self.put(key, value)
\`\`\`

Let's see this HashMap in action with a practical example:

\`\`\`python
# Create a phone book using our HashMap
phone_book = HashMap()

# Add some contacts
phone_book.put("Alice", "555-0100")
phone_book.put("Bob", "555-0101")
phone_book.put("Charlie", "555-0102")
phone_book.put("Diana", "555-0103")

# Look up a phone number - this happens almost instantly
print(phone_book.get("Bob"))  # Output: "555-0101"

# Update an existing entry
phone_book.put("Bob", "555-9999")
print(phone_book.get("Bob"))  # Output: "555-9999"

# Check if a contact exists
print(phone_book.contains("Alice"))   # Output: True
print(phone_book.contains("Edward"))  # Output: False

# Remove a contact
phone_book.remove("Charlie")
# Now trying to get Charlie would raise a KeyError
\`\`\`

## Understanding Load Factor and Performance

One crucial concept for HashMaps is the load factor, which is the ratio of stored items to the total capacity. If you have a HashMap with space for 100 items and you've stored 70 items, your load factor is 0.7 or 70%. The load factor directly impacts performance because it affects how many collisions occur.

When a HashMap has a low load factor, collisions are rare. Most keys hash to their own unique position, and lookups are extremely fast. As the load factor increases, collisions become more common. More items end up sharing the same bucket, which means those buckets contain longer lists that need to be searched through. This is why HashMap implementations typically resize themselves when the load factor exceeds a certain threshold, usually around 0.7 or 0.75.

Resizing involves creating a larger internal array and rehashing all existing entries into the new array. This operation takes time proportional to the number of items in the HashMap, but it happens infrequently enough that it doesn't significantly impact the overall performance. It's like reorganizing your entire library to add more shelves, which takes effort, but then makes finding books faster for a long time afterward.

## Time Complexity in Practice

The beauty of a well-implemented HashMap is its average-case time complexity. For the three main operations—inserting a value, retrieving a value, and deleting a value—a HashMap achieves O(1) average time complexity. This means these operations take roughly the same amount of time whether your HashMap contains ten items or ten million items. This constant-time performance is what makes HashMaps so valuable.

However, it's important to understand that this is average-case performance. In the worst case, if you're extremely unlucky and every single key hashes to the same bucket, all operations would degrade to O(n) time, where n is the number of items. This would turn your HashMap into essentially a single linked list. Good hash functions and proper load factor management make this worst case extremely unlikely in practice, but it's theoretically possible.

## Choosing Good Keys

Not everything makes a good key for a HashMap. Good keys need to be immutable, meaning they can't change after they're created. This is crucial because if a key could change, its hash value might change too. Imagine storing something with key "John" at position 42, but then the key somehow changes to "Joan". The hash of "Joan" might be 58, but your value is still at position 42. You'd never be able to find it again.

This is why languages like Python allow strings, numbers, and tuples to be dictionary keys, but not lists. Strings and numbers can't be modified after creation, but lists can have items added or removed, making them unsuitable as keys. Good keys should also distribute evenly across the hash space to minimize collisions. If your hash function produces the same value for many different keys, you'll get lots of collisions and poor performance.

## HashMaps vs Other Data Structures

Understanding when to use a HashMap versus other data structures is an important skill. If you need to store data and look it up by some identifier, a HashMap is usually the best choice. It gives you constant-time lookups, which is hard to beat. However, HashMaps have no inherent order. If you iterate through a HashMap's entries, they won't come out in any particular sequence.

If you need to maintain items in sorted order, a balanced tree structure like a Red-Black tree might be more appropriate. These give you O(log n) lookups, which is slower than a HashMap's O(1), but they keep items sorted. If you need to frequently access items by their position, like "give me the 100th item", a simple array or list would be better. Arrays give you O(1) access by index, which is faster than a HashMap would be for that use case.

Stacks and queues, which we discussed earlier, are specialized for specific access patterns. You'd use a stack when you need LIFO behavior, not when you need to look things up by a key. Each data structure has its strengths, and choosing the right one depends on what operations you need to perform most frequently.

## Key Takeaways

HashMaps represent a brilliant trade-off in computer science. By using a hash function to convert keys into array indices, they achieve nearly instant lookups at the cost of some memory overhead and the need to handle collisions. The concept of trading memory for speed is common in computing, and HashMaps exemplify this trade-off beautifully.

When you understand HashMaps, you understand one of the most widely-used data structures in modern programming. From databases to compilers to web servers, HashMaps power the fast lookups that make modern software responsive. The next time you search for something by username, look up a word in a dictionary app, or access any kind of data by an identifier, there's likely a HashMap working behind the scenes, quietly delivering instant results from potentially vast amounts of data.
`,
  },
];
