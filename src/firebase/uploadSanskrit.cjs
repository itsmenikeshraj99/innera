const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const sanskritData = require('../data/syllabus/Sanskrit.json');

const firebaseConfig = {
  apiKey: "AIzaSyDkcMPTbRxIsA_y8BdTw7dTtjrFdXdYysU",
  authDomain: "innera-738ea.firebaseapp.com",
  projectId: "innera-738ea",
  storageBucket: "innera-738ea.firebasestorage.app",
  messagingSenderId: "477673580151",
  appId: "1:477673580151:web:f9c59beec1c9d260f9c872"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadSanskrit() {
  console.log('Uploading Sanskrit syllabus...');
  for (const classData of sanskritData.classes) {
    await setDoc(
      doc(db, 'syllabus', 'sanskrit', 'classes', classData.classId),
      { subjects: classData.subjects }
    );
    console.log(`✅ ${classData.classId} uploaded`);
  }
  console.log('🎉 All done!');
}

uploadSanskrit().catch(console.error);