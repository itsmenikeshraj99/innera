const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const socialScienceData = require('../data/syllabus/Social_Science_syllabus.json');

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

async function uploadSocialScience() {
  console.log('Uploading Social Science syllabus...');

  for (const classData of socialScienceData.classes) {
    const classId = classData.classId;

    // subjects is an OBJECT like { politicalTheory: [...], geography: [...] }
    // NOT an array — so we count keys, not .length
    const subjectKeys = Object.keys(classData.subjects || {});

    await setDoc(
      doc(db, 'syllabus', 'socialScience', 'classes', classId),
      { subjects: classData.subjects }
    );

    console.log(`✅ ${classId} uploaded (${subjectKeys.length} subjects: ${subjectKeys.join(', ')})`);
  }

  console.log('🎉 All done!');
}

uploadSocialScience().catch(console.error);
