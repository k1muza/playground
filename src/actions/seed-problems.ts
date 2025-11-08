
'use server';

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { problemsForSeeding } from '@/lib/data';
import { firebaseConfig } from '@/firebase/config';

// This is a server action, so it's safe to use server-side Firebase logic.
// We manage app initialization to avoid re-initializing on every call.
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export async function seedProblems() {
  try {
    console.log('Seeding database...');
    
    const problemsCollection = collection(db, 'problems');
    const batch = writeBatch(db);
    
    for (const problem of problemsForSeeding) {
      const problemRef = doc(problemsCollection, problem.slug);
      
      // Stringify test cases to avoid Firestore nested array issue
      const problemDataForFirestore = {
        ...problem,
        testCases: problem.testCases.map(tc => ({
          input: JSON.stringify(tc.input),
          output: JSON.stringify(tc.output),
        })),
      };

      console.log(`  Queueing problem for write: ${problem.slug}`);
      batch.set(problemRef, problemDataForFirestore);
    }

    await batch.commit();

    console.log('Database seeded successfully!');
    return { success: true, message: `${problemsForSeeding.length} problems have been seeded.` };
  } catch (e) {
    const error = e as Error;
    console.error('Error seeding database:', error);
    return { success: false, message: error.message };
  }
}
