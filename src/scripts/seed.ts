#!/usr/bin/env bun
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { problemsForSeeding } from '../lib/data';
import { firebaseConfig } from '../firebase/config';

async function main() {
  console.log('Seeding database...');
  
  // Initialize Firebase client SDK
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);

  const problemsCollection = collection(db, 'problems');
  
  for (const problem of problemsForSeeding) {
    const problemRef = doc(problemsCollection, problem.slug);
    console.log(`  Writing problem: ${problem.slug}`);
    await setDoc(problemRef, problem);
  }

  console.log('Database seeded successfully!');
  
  // Need to exit explicitly, otherwise the script will hang
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

    