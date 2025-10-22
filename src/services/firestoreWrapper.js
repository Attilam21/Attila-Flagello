import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebaseClient';

/**
 * Firebase Firestore Wrapper per pipeline eFootball
 * Mantiene la stessa semantica del localStorage ma con persistenza cloud
 */

// ===== DATA MODEL MAPPING =====

/**
 * Salva dati del roster (Step 1)
 */
export const saveRoster = async (userId, rosterData) => {
  try {
    const rosterRef = doc(db, 'users', userId, 'roster', 'current');
    await setDoc(rosterRef, {
      ...rosterData,
      updatedAt: Timestamp.now(),
      step: 1
    });
    
    // Cache locale per offline
    localStorage.setItem('roster_cache', JSON.stringify(rosterData));
    
    console.log('✅ Roster salvato in Firestore');
    return true;
  } catch (error) {
    console.error('❌ Errore salvataggio roster:', error);
    return false;
  }
};

/**
 * Carica dati del roster (Step 1)
 */
export const loadRoster = async (userId) => {
  try {
    const rosterRef = doc(db, 'users', userId, 'roster', 'current');
    const rosterDoc = await getDoc(rosterRef);
    
    if (rosterDoc.exists()) {
      const data = rosterDoc.data();
      console.log('✅ Roster caricato da Firestore');
      return data;
    } else {
      // Fallback a cache locale
      const cache = localStorage.getItem('roster_cache');
      if (cache) {
        console.log('📦 Roster caricato da cache locale');
        return JSON.parse(cache);
      }
      return null;
    }
  } catch (error) {
    console.error('❌ Errore caricamento roster:', error);
    // Fallback a cache locale
    const cache = localStorage.getItem('roster_cache');
    if (cache) {
      console.log('📦 Roster caricato da cache locale (fallback)');
      return JSON.parse(cache);
    }
    return null;
  }
};

/**
 * Salva dati match (Step 2-4)
 */
export const saveMatch = async (userId, matchId, matchData) => {
  try {
    const matchRef = doc(db, 'users', userId, 'matches', matchId);
    await setDoc(matchRef, {
      ...matchData,
      userId,
      matchId,
      updatedAt: Timestamp.now()
    });
    
    // Cache locale
    localStorage.setItem(`match_${matchId}_cache`, JSON.stringify(matchData));
    
    console.log('✅ Match salvato in Firestore:', matchId);
    return true;
  } catch (error) {
    console.error('❌ Errore salvataggio match:', error);
    return false;
  }
};

/**
 * Carica dati match (Step 2-4)
 */
export const loadMatch = async (userId, matchId) => {
  try {
    const matchRef = doc(db, 'users', userId, 'matches', matchId);
    const matchDoc = await getDoc(matchRef);
    
    if (matchDoc.exists()) {
      const data = matchDoc.data();
      console.log('✅ Match caricato da Firestore:', matchId);
      return data;
    } else {
      // Fallback a cache locale
      const cache = localStorage.getItem(`match_${matchId}_cache`);
      if (cache) {
        console.log('📦 Match caricato da cache locale:', matchId);
        return JSON.parse(cache);
      }
      return null;
    }
  } catch (error) {
    console.error('❌ Errore caricamento match:', error);
    // Fallback a cache locale
    const cache = localStorage.getItem(`match_${matchId}_cache`);
    if (cache) {
      console.log('📦 Match caricato da cache locale (fallback):', matchId);
      return JSON.parse(cache);
    }
    return null;
  }
};

/**
 * Salva messaggio chat (Step 5)
 */
export const saveChatMessage = async (userId, chatId, messageData) => {
  try {
    const messagesRef = collection(db, 'users', userId, 'chats', chatId, 'messages');
    const docRef = await addDoc(messagesRef, {
      ...messageData,
      userId,
      chatId,
      timestamp: Timestamp.now()
    });
    
    console.log('✅ Messaggio chat salvato:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Errore salvataggio messaggio chat:', error);
    return null;
  }
};

/**
 * Carica cronologia chat (Step 5)
 */
export const loadChatHistory = async (userId, chatId, limitCount = 50) => {
  try {
    const messagesRef = collection(db, 'users', userId, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('✅ Cronologia chat caricata:', messages.length, 'messaggi');
    return messages.reverse(); // Cronologico
  } catch (error) {
    console.error('❌ Errore caricamento cronologia chat:', error);
    return [];
  }
};

/**
 * Listener real-time per cronologia chat
 */
export const listenToChatHistory = (userId, chatId, callback) => {
  try {
    const messagesRef = collection(db, 'users', userId, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      callback(messages);
    });
  } catch (error) {
    console.error('❌ Errore listener chat:', error);
    return null;
  }
};

/**
 * Salva task coach (Step 5)
 */
export const saveTasks = async (userId, tasksData) => {
  try {
    const tasksRef = doc(db, 'users', userId, 'tasks', 'current');
    await setDoc(tasksRef, {
      ...tasksData,
      userId,
      updatedAt: Timestamp.now()
    });
    
    // Cache locale
    localStorage.setItem('tasks_cache', JSON.stringify(tasksData));
    
    console.log('✅ Task salvati in Firestore');
    return true;
  } catch (error) {
    console.error('❌ Errore salvataggio task:', error);
    return false;
  }
};

/**
 * Carica task coach (Step 5)
 */
export const loadTasks = async (userId) => {
  try {
    const tasksRef = doc(db, 'users', userId, 'tasks', 'current');
    const tasksDoc = await getDoc(tasksRef);
    
    if (tasksDoc.exists()) {
      const data = tasksDoc.data();
      console.log('✅ Task caricati da Firestore');
      return data;
    } else {
      // Fallback a cache locale
      const cache = localStorage.getItem('tasks_cache');
      if (cache) {
        console.log('📦 Task caricati da cache locale');
        return JSON.parse(cache);
      }
      return null;
    }
  } catch (error) {
    console.error('❌ Errore caricamento task:', error);
    // Fallback a cache locale
    const cache = localStorage.getItem('tasks_cache');
    if (cache) {
      console.log('📦 Task caricati da cache locale (fallback)');
      return JSON.parse(cache);
    }
    return null;
  }
};

/**
 * Salva snapshot knowledge base
 */
export const saveKBSnapshot = async (userId, kbData) => {
  try {
    const kbRef = doc(db, 'users', userId, 'kb_snapshot', 'current');
    await setDoc(kbRef, {
      ...kbData,
      userId,
      updatedAt: Timestamp.now()
    });
    
    console.log('✅ KB snapshot salvato in Firestore');
    return true;
  } catch (error) {
    console.error('❌ Errore salvataggio KB snapshot:', error);
    return false;
  }
};

/**
 * Carica snapshot knowledge base
 */
export const loadKBSnapshot = async (userId) => {
  try {
    const kbRef = doc(db, 'users', userId, 'kb_snapshot', 'current');
    const kbDoc = await getDoc(kbRef);
    
    if (kbDoc.exists()) {
      const data = kbDoc.data();
      console.log('✅ KB snapshot caricato da Firestore');
      return data;
    }
    return null;
  } catch (error) {
    console.error('❌ Errore caricamento KB snapshot:', error);
    return null;
  }
};

// ===== UTILITY FUNCTIONS =====

/**
 * Genera ID unico per match
 */
export const generateMatchId = () => {
  return `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Genera ID unico per chat
 */
export const generateChatId = () => {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Pulisce cache locale
 */
export const clearLocalCache = () => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes('_cache')) {
      localStorage.removeItem(key);
    }
  });
  console.log('🧹 Cache locale pulita');
};

/**
 * Sincronizza cache locale con Firestore
 */
export const syncCacheWithFirestore = async (userId) => {
  try {
    console.log('🔄 Sincronizzazione cache locale con Firestore...');
    
    // Sincronizza roster
    const roster = await loadRoster(userId);
    if (roster) {
      localStorage.setItem('roster_cache', JSON.stringify(roster));
    }
    
    // Sincronizza task
    const tasks = await loadTasks(userId);
    if (tasks) {
      localStorage.setItem('tasks_cache', JSON.stringify(tasks));
    }
    
    console.log('✅ Sincronizzazione completata');
  } catch (error) {
    console.error('❌ Errore sincronizzazione:', error);
  }
};

export default {
  saveRoster,
  loadRoster,
  saveMatch,
  loadMatch,
  saveChatMessage,
  loadChatHistory,
  listenToChatHistory,
  saveTasks,
  loadTasks,
  saveKBSnapshot,
  loadKBSnapshot,
  generateMatchId,
  generateChatId,
  clearLocalCache,
  syncCacheWithFirestore
};
