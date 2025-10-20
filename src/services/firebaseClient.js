import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  Timestamp,
  getDoc,
  updateDoc,
  deleteDoc,
  where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Configurazione Firebase
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    'AIzaSyBxD9-4kFNrY2136M5M-Ht7kXJ37LhzeJI',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'attila-475314.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'attila-475314',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'attila-475314.appspot.com',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '814206807853',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:814206807853:web:256884e64c9d867509eda4',
};

// Inizializza Firebase
console.log('🔥 Initializing Firebase with config:', {
  apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ Missing',
  authDomain: firebaseConfig.authDomain ? '✅ Set' : '❌ Missing',
  projectId: firebaseConfig.projectId ? '✅ Set' : '❌ Missing',
  storageBucket: firebaseConfig.storageBucket ? '✅ Set' : '❌ Missing',
  messagingSenderId: firebaseConfig.messagingSenderId ? '✅ Set' : '❌ Missing',
  appId: firebaseConfig.appId ? '✅ Set' : '❌ Missing',
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
      fileName,
    };

    await setDoc(doc(db, 'matches', userId), matchDoc);

    console.log('✅ Immagine caricata:', { userId, filePath: storagePath });

    return downloadURL;
  } catch (error) {
    console.error('❌ Errore upload:', error);
    throw error;
  }
};

// Helper per ascoltare risultati OCR in tempo reale
export const listenToOCRResults = (userId, callback) => {
  const ocrRef = collection(db, 'matches', userId, 'ocr');
  const q = query(ocrRef, orderBy('updatedAt', 'desc'), limit(1));

  return onSnapshot(q, snapshot => {
    if (!snapshot.empty) {
      const latestOCR = snapshot.docs[0].data();
      callback(latestOCR);
    }
  });
};

// Helper per ascoltare stato match
export const listenToMatchStatus = (userId, callback) => {
  const matchRef = doc(db, 'matches', userId);

  return onSnapshot(matchRef, doc => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

// Save parsed match statistics under user collection
export const saveMatchStats = async (userId, match) => {
  const colRef = collection(db, 'users', userId, 'matches');
  const payload = {
    ...match,
    createdAt: Timestamp.now(),
  };
  const refDoc = await addDoc(colRef, payload);
  return { id: refDoc.id, ...payload };
};

// Subscribe to user's match history (latest first)
export const listenToMatchHistory = (userId, callback, limitCount = 20) => {
  const colRef = collection(db, 'users', userId, 'matches');
  const q = query(colRef, orderBy('createdAt', 'desc'), limit(limitCount));
  return onSnapshot(q, snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(items);
  });
};

// ---------- Players CRUD ----------
export const addPlayer = async (userId, player) => {
  const colRef = collection(db, 'users', userId, 'players');
  const payload = {
    ...player,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const refDoc = await addDoc(colRef, payload);
  return { id: refDoc.id, ...payload };
};

export const updatePlayer = async (userId, playerId, updates) => {
  const refDoc = doc(db, 'users', userId, 'players', playerId);
  await updateDoc(refDoc, { ...updates, updatedAt: Timestamp.now() });
};

export const deletePlayerById = async (userId, playerId) => {
  const refDoc = doc(db, 'users', userId, 'players', playerId);
  await deleteDoc(refDoc);
};

export const getPlayerById = async (userId, playerId) => {
  const refDoc = doc(db, 'users', userId, 'players', playerId);
  const snap = await getDoc(refDoc);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const listenToPlayers = (userId, callback) => {
  const colRef = collection(db, 'users', userId, 'players');
  const q = query(colRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(items);
  });
};

// ---------- Player images (profile/stats/skills) ----------
export const uploadPlayerImage = async (
  userId,
  playerId,
  file,
  kind = 'profile'
) => {
  const timestamp = Date.now();
  const fileName = `${kind}_${timestamp}.png`;
  const storagePath = `player_images/${userId}/${playerId}/${fileName}`;
  const storageRef = ref(storage, storagePath);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  // Optionally, we can update the player doc with image URL field
  try {
    const imageField =
      kind === 'profile'
        ? 'profileImageUrl'
        : kind === 'stats'
          ? 'statsImageUrl'
          : 'skillsImageUrl';
    await updatePlayer(userId, playerId, { [imageField]: downloadURL });
  } catch (e) {
    console.warn('Could not update player with image URL:', e);
  }
  return { storagePath, downloadURL };
};

// ---------- AI Chat History ----------
export const saveChatMessage = async (userId, sessionId, message) => {
  // Ensure session doc exists with owner
  const sessionRef = doc(db, 'ai_chat_history', sessionId);
  await setDoc(sessionRef, { userId }, { merge: true });

  const messagesCol = collection(db, 'ai_chat_history', sessionId, 'messages');
  const payload = {
    ...message, // { role: 'user'|'assistant', text: string, meta? }
    userId,
    createdAt: Timestamp.now(),
  };
  const refDoc = await addDoc(messagesCol, payload);
  return { id: refDoc.id, ...payload };
};

export const listenToChatMessages = (
  userId,
  sessionId,
  callback,
  limitCount = 50
) => {
  const messagesCol = collection(db, 'ai_chat_history', sessionId, 'messages');
  const q = query(messagesCol, orderBy('createdAt', 'asc'), limit(limitCount));
  return onSnapshot(q, snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // Filter by owner just in case
    callback(items.filter(m => m.userId === userId));
  });
};

export { app, auth, db, storage };
