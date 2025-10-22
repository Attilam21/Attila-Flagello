import { auth, storage } from './firebaseClient';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

/**
 * Upload Helper per OCR trigger
 * Upload diretto su Storage con metadati per trigger automatico
 */

/**
 * Upload immagine su Storage con metadati per trigger OCR
 */
export const uploadImageForOCR = async (file, type, matchId = 'current') => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('Utente non autenticato');
    }

    // Mappa tipi per metadati
    const typeMapping = {
      'stats': 'MATCH_STATS',
      'ratings': 'VOTES', 
      'heatmapOffensive': 'HEATMAP',
      'heatmapDefensive': 'HEATMAP',
      'opponent': 'OPPONENT_FORMATION'
    };

    const metadataType = typeMapping[type] || type.toUpperCase();
    
    // Upload diretto su Storage con metadati
    const fileName = `${type}_${Date.now()}.jpg`;
    const storageRef = ref(storage, `users/${userId}/images/${fileName}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file, {
      customMetadata: {
        uid: userId,
        type: metadataType,
        matchId: matchId
      }
    });

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('📊 Upload progress:', progress + '%');
        },
        (error) => {
          console.error('❌ Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('✅ Upload completed:', downloadURL);
            resolve({
              url: downloadURL,
              fileName: fileName,
              type: metadataType,
              matchId: matchId,
              timestamp: Date.now()
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
};

/**
 * Converte file in base64
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * Fallback: Simula upload per test
 */
export const simulateUpload = async (file, type) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        url: `https://example.com/images/${type}_${Date.now()}.jpg`,
        fileName: `${type}_${Date.now()}.jpg`,
        type,
        timestamp: Date.now(),
        size: file.size,
        simulated: true
      });
    }, 1000);
  });
};

export default {
  uploadImageForOCR,
  simulateUpload
};
