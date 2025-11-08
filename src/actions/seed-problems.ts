
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
    
    const batch = writeBatch(db);
    
    for (const problem of problemsForSeeding) {
      // 1. Create the main problem document
      const problemRef = doc(db, 'problems', problem.slug);
      const { testCases, ...problemData } = problem;
      console.log(`  Queueing problem for write: ${problem.slug}`);
      batch.set(problemRef, problemData);

      // 2. Create a document for each test case in the subcollection
      const testCasesCollection = collection(db, 'problems', problem.slug, 'testCases');
      for (const tc of testCases) {
        const testCaseRef = doc(testCasesCollection); // Auto-generate ID
        const testCaseData = {
          input: JSON.stringify(tc.input),
          output: JSON.stringify(tc.output),
        };
        console.log(`    Queueing test case for ${problem.slug}`);
        batch.set(testCaseRef, testCaseData);
      }
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

    