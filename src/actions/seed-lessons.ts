
'use server';

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import { lessons } from '@/lib/lessons';
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

export async function seedLessons() {
  try {
    console.log('Seeding lessons...');
    
    const batch = writeBatch(db);
    
    for (const lesson of lessons) {
      const lessonRef = doc(db, 'lessons', lesson.slug);
      console.log(`  Queueing lesson for write: ${lesson.slug}`);
      batch.set(lessonRef, lesson);
    }

    await batch.commit();

    console.log('Lessons seeded successfully!');
    return { success: true, message: `${lessons.length} lessons have been seeded.` };
  } catch (e) {
    const error = e as Error;
    console.error('Error seeding lessons:', error);
    return { success: false, message: error.message };
  }
}
    