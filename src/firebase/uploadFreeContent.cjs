const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

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

async function uploadFreeContent() {
  console.log('Uploading free content config...');

  // Mathematics — class wise free chapters
  const mathFree = {
    class6: { freeChapters: [1], freeTopicsInChapter: { 1: [0, 1, 2] } },
    class7: { freeChapters: [1], freeTopicsInChapter: { 1: [0, 1, 2] } },
    class8: { freeChapters: [1], freeTopicsInChapter: { 1: [0, 1, 2] } },
    class9: { freeChapters: [1], freeTopicsInChapter: { 1: [0, 1, 2] } },
    class10: { freeChapters: [1], freeTopicsInChapter: { 1: [0, 1, 2] } },
    class11: { freeChapters: [1], freeTopicsInChapter: { 1: [0, 1, 2] } },
    class12: { freeChapters: [1], freeTopicsInChapter: { 1: [0, 1, 2] } },
  };

  await setDoc(doc(db, 'freeContent', 'mathematics'), mathFree);
  console.log('✅ Mathematics free content uploaded');

  // Science
  const scienceFree = {
    class6: { freeChapters: ['physics_0', 'chemistry_0'], freeTopicsInChapter: { 'physics_0': [0, 1], 'chemistry_0': [0, 1] } },
    class7: { freeChapters: ['physics_0'], freeTopicsInChapter: { 'physics_0': [0, 1] } },
    class8: { freeChapters: ['physics_0'], freeTopicsInChapter: { 'physics_0': [0, 1] } },
    class9: { freeChapters: ['physics_0'], freeTopicsInChapter: { 'physics_0': [0, 1] } },
    class10: { freeChapters: ['physics_0'], freeTopicsInChapter: { 'physics_0': [0, 1] } },
    class11: { freeChapters: ['physics_0'], freeTopicsInChapter: { 'physics_0': [0, 1] } },
    class12: { freeChapters: ['physics_0'], freeTopicsInChapter: { 'physics_0': [0, 1] } },
  };

  await setDoc(doc(db, 'freeContent', 'science'), scienceFree);
  console.log('✅ Science free content uploaded');

  console.log('🎉 All done!');
}

uploadFreeContent().catch(console.error);