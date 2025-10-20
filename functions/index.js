const functions = require('firebase-functions');
const admin = require('firebase-admin');
const vision = require('@google-cloud/vision');

// Inizializza Firebase Admin
admin.initializeApp();

// Inizializza Vision API client
const visionClient = new vision.ImageAnnotatorClient();

// Cloud Function che si attiva quando un'immagine viene caricata su Storage
exports.onImageUpload = functions.storage.object().onFinalize(async object => {
  const fileBucket = object.bucket;
  const filePath = object.name;
  const contentType = object.contentType;
  const requestId = object.name.split('/').pop().split('.')[0];

  console.log('🔍 Triggered onImageUpload:', {
    filePath,
    contentType,
    requestId,
  });

  // Verifica che sia un'immagine
  if (!contentType || !contentType.startsWith('image/')) {
    console.log('⏭️ Skipping non-image file:', filePath);
    return null;
  }

  // Estrai userId dal path "uploads/{userId}/..."
  const pathParts = filePath.split('/');
  if (pathParts.length < 3 || pathParts[0] !== 'uploads') {
    console.log('⏭️ Skipping non-upload file:', filePath);
    return null;
  }

  const userId = pathParts[1];
  console.log('📸 Processing image for user:', userId, 'requestId:', requestId);

  try {
    const startTime = Date.now();

    // Aggiorna stato a processing
    await admin
      .firestore()
      .collection('matches')
      .doc(userId)
      .collection('ocr')
      .doc('latest')
      .set({
        userId,
        filePath,
        status: 'processing',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        requestId,
      });

    // Costruisci URI per Vision API
    const imageUri = `gs://${fileBucket}/${filePath}`;

    console.log('🔍 Calling Vision API on:', imageUri);

    // Chiama Google Vision OCR
    const [result] = await visionClient.textDetection(imageUri);
    const detections = result.textAnnotations;

    const ocrTime = Date.now() - startTime;
    console.log(`⚡ OCR completed in ${ocrTime}ms`);

    functions.logger.info('OCR processing completed', {
      requestId,
      uid: userId,
      path: filePath,
      processingTimeMs: ocrTime,
    });

    if (detections && detections.length > 0) {
      // Estrai tutto il testo rilevato
      const fullText = detections[0].description || '';

      // Salva risultato OCR su Firestore
      const ocrResult = {
        userId,
        filePath,
        text: fullText,
        status: 'done',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        processingTimeMs: ocrTime,
        requestId,
      };

      // Salva in matches/{userId}/ocr/latest
      await admin
        .firestore()
        .collection('matches')
        .doc(userId)
        .collection('ocr')
        .doc('latest')
        .set(ocrResult);

      console.log('✅ OCR result saved:', {
        userId,
        textLength: fullText.length,
        processingTime: ocrTime,
        requestId,
      });

      return ocrResult;
    } else {
      console.log('⚠️ No text detected in image');

      // Salva risultato vuoto
      const ocrResult = {
        userId,
        filePath,
        text: '',
        status: 'done',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        processingTimeMs: ocrTime,
        requestId,
      };

      await admin
        .firestore()
        .collection('matches')
        .doc(userId)
        .collection('ocr')
        .doc('latest')
        .set(ocrResult);

      return ocrResult;
    }
  } catch (error) {
    functions.logger.error('OCR processing failed', {
      requestId,
      uid: userId,
      path: filePath,
      error: error.message,
    });

    // Salva errore
    await admin
      .firestore()
      .collection('matches')
      .doc(userId)
      .collection('ocr')
      .doc('latest')
      .set({
        userId,
        filePath,
        status: 'error',
        error: error.message,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        requestId,
      });

    throw error;
  }
});
