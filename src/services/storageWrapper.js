import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './firebaseClient';

/**
 * Firebase Storage Wrapper per pipeline eFootball
 * Gestisce upload immagini per OCR e persistenza
 */

/**
 * Upload immagine con progress tracking
 */
export const uploadImage = async (userId, file, type, onProgress = null) => {
  try {
    // Validazione file
    if (!file || !file.type.startsWith('image/')) {
      throw new Error("File non valido: deve essere un'immagine");
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB max
      throw new Error('File troppo grande: massimo 10MB');
    }

    // Genera nome file unico
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${type}_${timestamp}.${fileExtension}`;
    const storageRef = ref(storage, `users/${userId}/images/${fileName}`);

    console.log('📤 Uploading image:', fileName);

    // Upload con tracking progress
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        snapshot => {
          // Progress tracking
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`📊 Upload progress: ${Math.round(progress)}%`);

          if (onProgress) {
            onProgress(Math.round(progress));
          }
        },
        error => {
          console.error('❌ Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            // Upload completato, ottieni URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('✅ Image uploaded successfully:', downloadURL);

            resolve({
              url: downloadURL,
              fileName,
              type,
              timestamp,
              size: file.size,
            });
          } catch (error) {
            console.error('❌ Error getting download URL:', error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('❌ Upload image error:', error);
    throw error;
  }
};

/**
 * Upload immagine roster (Step 1)
 */
export const uploadRosterImage = async (userId, file, onProgress = null) => {
  return await uploadImage(userId, file, 'roster', onProgress);
};

/**
 * Upload immagine statistiche (Step 2)
 */
export const uploadStatsImage = async (userId, file, onProgress = null) => {
  return await uploadImage(userId, file, 'stats', onProgress);
};

/**
 * Upload immagine heatmap/voti (Step 3)
 */
export const uploadHeatmapImage = async (userId, file, onProgress = null) => {
  return await uploadImage(userId, file, 'heatmap', onProgress);
};

/**
 * Upload immagine voti (Step 3)
 */
export const uploadVotesImage = async (userId, file, onProgress = null) => {
  return await uploadImage(userId, file, 'votes', onProgress);
};

/**
 * Upload immagine avversario (Step 4)
 */
export const uploadOpponentImage = async (userId, file, onProgress = null) => {
  return await uploadImage(userId, file, 'opponent', onProgress);
};

/**
 * Elimina immagine
 */
export const deleteImage = async (userId, fileName) => {
  try {
    const imageRef = ref(storage, `users/${userId}/images/${fileName}`);
    await deleteObject(imageRef);
    console.log('✅ Image deleted:', fileName);
    return true;
  } catch (error) {
    console.error('❌ Error deleting image:', error);
    return false;
  }
};

/**
 * Upload batch di immagini per OCR
 */
export const uploadImagesForOCR = async (userId, images, onProgress = null) => {
  try {
    const results = [];
    const totalImages = Object.keys(images).length;
    let completedImages = 0;

    console.log(`📤 Uploading ${totalImages} images for OCR...`);

    for (const [type, file] of Object.entries(images)) {
      if (!file) continue;

      try {
        const result = await uploadImage(userId, file, type, progress => {
          if (onProgress) {
            const overallProgress =
              ((completedImages + progress / 100) / totalImages) * 100;
            onProgress(Math.round(overallProgress));
          }
        });

        results.push({
          type,
          ...result,
        });

        completedImages++;
        console.log(`✅ Uploaded ${type}: ${completedImages}/${totalImages}`);
      } catch (error) {
        console.error(`❌ Error uploading ${type}:`, error);
        results.push({
          type,
          error: error.message,
        });
      }
    }

    console.log('✅ Batch upload completed:', results);
    return results;
  } catch (error) {
    console.error('❌ Batch upload error:', error);
    throw error;
  }
};

/**
 * Ottieni URL pubblico per immagine
 */
export const getImageURL = async (userId, fileName) => {
  try {
    const imageRef = ref(storage, `users/${userId}/images/${fileName}`);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error('❌ Error getting image URL:', error);
    return null;
  }
};

/**
 * Lista immagini utente
 */
export const listUserImages = async userId => {
  try {
    // Nota: Firebase Storage non ha una funzione list diretta
    // Questa funzione dovrebbe essere implementata con Cloud Functions
    // o mantenendo una lista in Firestore
    console.log('📋 Listing user images (implementare con Cloud Functions)');
    return [];
  } catch (error) {
    console.error('❌ Error listing images:', error);
    return [];
  }
};

/**
 * Valida file immagine
 */
export const validateImageFile = file => {
  const errors = [];

  if (!file) {
    errors.push('Nessun file selezionato');
    return errors;
  }

  if (!file.type.startsWith('image/')) {
    errors.push("Il file deve essere un'immagine");
  }

  if (file.size > 10 * 1024 * 1024) {
    errors.push('Il file è troppo grande (massimo 10MB)');
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Formato non supportato. Usa JPG, PNG o WebP');
  }

  return errors;
};

export default {
  uploadImage,
  uploadRosterImage,
  uploadStatsImage,
  uploadHeatmapImage,
  uploadVotesImage,
  uploadOpponentImage,
  deleteImage,
  uploadImagesForOCR,
  getImageURL,
  listUserImages,
  validateImageFile,
};
