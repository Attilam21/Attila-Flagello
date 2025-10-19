import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { collection, doc, setDoc, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Configurazione Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Helper per upload immagine match
export const uploadMatchImage = async (file, userId) => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}.png`;
    const storagePath = `matches/${userId}/${fileName}`;
    
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

// Helper per ascoltare risultati OCR
export const listenToOCRResults = (userId, callback) => {
  const ocrRef = collection(db, 'matches', userId, 'ocr');
  const q = query(ocrRef, orderBy('createdAt', 'desc'), limit(1));
  
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
