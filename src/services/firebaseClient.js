import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { collection, doc, setDoc, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Configurazione Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBxD9-4kFNrY2136M5M-Ht7kXJ37LhzeJI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "attila-475314.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "attila-475314",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "attila-475314.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "814206807853",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:814206807853:web:256884e64c9d867509eda4"
};

// Inizializza Firebase
console.log('🔥 Initializing Firebase with config:', {
  apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ Missing',
  authDomain: firebaseConfig.authDomain ? '✅ Set' : '❌ Missing',
  projectId: firebaseConfig.projectId ? '✅ Set' : '❌ Missing',
  storageBucket: firebaseConfig.storageBucket ? '✅ Set' : '❌ Missing',
  messagingSenderId: firebaseConfig.messagingSenderId ? '✅ Set' : '❌ Missing',
  appId: firebaseConfig.appId ? '✅ Set' : '❌ Missing'
});

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log('✅ Firebase initialized successfully');

// Helper per upload immagine match
export const uploadMatchImage = async (file, userId) => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}.png`;
    const storagePath = `uploads/${userId}/${fileName}`;

    // Upload su Firebase Storage
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Salva metadati su Firestore
    const matchDoc = {
      userId,
      filePath: storagePath,
      downloadURL,
      status: 'uploaded',
      createdAt: new Date(),
      fileName
    };

    await setDoc(doc(db, 'matches', userId), matchDoc);

    console.log('✅ Immagine caricata:', { userId, filePath: storagePath });

    return storagePath;
  } catch (error) {
    console.error('❌ Errore upload:', error);
    throw error;
  }
};

// Helper per ascoltare risultati OCR in tempo reale
export const listenToOCRResults = (userId, callback) => {
  const ocrRef = collection(db, 'matches', userId, 'ocr');
  const q = query(ocrRef, orderBy('updatedAt', 'desc'), limit(1));

  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const latestOCR = snapshot.docs[0].data();
      callback(latestOCR);
    }
  });
};

// Helper per ascoltare stato match
export const listenToMatchStatus = (userId, callback) => {
  const matchRef = doc(db, 'matches', userId);
  
  return onSnapshot(matchRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

export { app, auth, db, storage };
