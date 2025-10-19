const functions = require('firebase-functions');
const admin = require('firebase-admin');
const vision = require('@google-cloud/vision');

// Inizializza Firebase Admin
admin.initializeApp();

// Inizializza Vision API client
const visionClient = new vision.ImageAnnotatorClient();

// Cloud Function che si attiva quando un'immagine viene caricata su Storage
exports.onImageUpload = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket;
  const filePath = object.name;
  const contentType = object.contentType;

  console.log('🔍 Triggered onImageUpload:', { filePath, contentType });

  // Verifica che sia un'immagine
  if (!contentType || !contentType.startsWith('image/')) {
    console.log('⏭️ Skipping non-image file:', filePath);
    return null;
  }

  // Estrai userId dal path "matches/{userId}/..."
  const pathParts = filePath.split('/');
  if (pathParts.length < 3 || pathParts[0] !== 'matches') {
    console.log('⏭️ Skipping non-match file:', filePath);
    return null;
  }

  const userId = pathParts[1];
  console.log('📸 Processing image for user:', userId);

  try {
    // Costruisci URI per Vision API
    const imageUri = `gs://${fileBucket}/${filePath}`;
    
    console.log('🔍 Calling Vision API on:', imageUri);
    const startTime = Date.now();

    // Chiama Google Vision OCR
    const [result] = await visionClient.textDetection(imageUri);
    const detections = result.textAnnotations;

    const ocrTime = Date.now() - startTime;
    console.log(`⚡ OCR completed in ${ocrTime}ms`);

    if (detections && detections.length > 0) {
      // Estrai tutto il testo rilevato
      const fullText = detections[0].description || '';
      
      // Estrai anche le singole parole con posizioni
      const words = detections.slice(1).map(annotation => ({
        text: annotation.description,
        boundingBox: annotation.boundingPoly
      }));

      // Salva risultato OCR su Firestore
      const ocrResult = {
        userId,
        filePath,
        text: fullText,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        processingTimeMs: ocrTime,
        status: 'completed'
      };

      // Salva in matches/{userId}/ocr/{autoId}
      const ocrRef = admin.firestore()
        .collection('matches')
        .doc(userId)
        .collection('ocr')
        .doc();

      await ocrRef.set(ocrResult);

      // Aggiorna stato match
      await admin.firestore()
        .collection('matches')
        .doc(userId)
        .update({
          status: 'processed',
          lastOCRAt: admin.firestore.FieldValue.serverTimestamp(),
          ocrCount: admin.firestore.FieldValue.increment(1)
        });

      console.log('✅ OCR result saved:', {
        userId,
        textLength: fullText.length,
        processingTime: ocrTime
      });

      return ocrResult;
    } else {
      console.log('⚠️ No text detected in image');
      
      // Salva risultato vuoto
      const ocrResult = {
        userId,
        filePath,
        text: '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        processingTimeMs: ocrTime,
        status: 'no_text_detected'
      };

      await admin.firestore()
        .collection('matches')
        .doc(userId)
        .collection('ocr')
        .add(ocrResult);

      return ocrResult;
    }
  } catch (error) {
    console.error('❌ Error processing image:', error);
    
    // Salva errore
    await admin.firestore()
      .collection('matches')
      .doc(userId)
      .collection('ocr')
      .add({
        userId,
        filePath,
        error: error.message,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'error'
      });

    // Aggiorna stato match
    await admin.firestore()
      .collection('matches')
      .doc(userId)
      .update({
        status: 'error',
        lastError: error.message
      });

    throw error;
  }
});
