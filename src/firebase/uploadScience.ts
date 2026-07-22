const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const scienceData = require('../data/syllabus/science.json');

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

async function uploadScienceSyllabus() {
  console.log('Uploading detailed Science syllabus...');
  for (const classData of scienceData.classes) {
    await setDoc(
      doc(db, 'syllabus', 'science', 'classes', classData.classId),
      { subjects: classData.subjects }
    );
    console.log(`✅ ${classData.classId} uploaded`);
  }
  console.log('🎉 All done!');
}

uploadScienceSyllabus().catch(console.error);