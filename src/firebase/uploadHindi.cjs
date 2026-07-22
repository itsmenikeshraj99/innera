const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const hindiData = require('../data/syllabus/Hindi.json');

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

async function uploadHindi() {
  console.log('Uploading Hindi syllabus...');
  for (const classData of hindiData.classes) {
    await setDoc(
      doc(db, 'syllabus', 'hindi', 'classes', classData.classId),
      { subjects: classData.subjects }
    );
    console.log(`✅ ${classData.classId} uploaded`);
  }
  console.log('🎉 All done!');
}

uploadHindi().catch(console.error);