import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const mathDataUrl = new URL('../data/syllabus/mathematics.json', import.meta.url);

const firebaseConfig = {
  apiKey: "AIzaSyDkcMPTbRxIsAzy8BdTw7dTtjrFdXdYysU",
  authDomain: "innera-738ea.firebaseapp.com",
  projectId: "innera-738ea",
  storageBucket: "innera-738ea.firebasestorage.app",
  messagingSenderId: "477673580151",
  appId: "1:477673580151:web:f9c59beec9d260f9c872"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadMathSyllabus() {
  console.log('Uploading Mathematics syllabus...');

  const response = await fetch(mathDataUrl);
  const mathData = await response.json();

  for (const classData of mathData.classes) {
    await setDoc(
      doc(db, 'syllabus', 'mathematics', 'classes', classData.classId),
      { chapters: classData.chapters }
    );
    console.log(`✅ ${classData.classId} uploaded`);
  }

  console.log('🎉 All done!');
}

uploadMathSyllabus().catch(console.error);