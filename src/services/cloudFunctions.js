import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from './firebaseClient';

/**
 * Cloud Functions Wrapper per pipeline eFootball
 * Chiama le funzioni server-side per OCR, Chat e Task
 */

const functions = getFunctions();

/**
 * OCR Parse Image Function
 */
export const ocrParseImage = async (userId, matchId, type, storageUrl) => {
  try {
    console.log('🔍 Calling OCR Parse Image:', { userId, matchId, type });

    const ocrFunction = httpsCallable(functions, 'ocrParseImage');
    const result = await ocrFunction({
      userId,
      matchId,
      type,
      storageUrl,
    });

    console.log('✅ OCR Parse Image result:', result.data);
    return result.data;
  } catch (error) {
    console.error('❌ OCR Parse Image error:', error);
    throw new Error(`Errore OCR: ${error.message}`);
  }
};

/**
 * Chat Attila Function
 */
export const chatAttila = async (userId, chatId, message, contextRefs = {}) => {
  try {
    console.log('🤖 Calling Chat Attila:', {
      userId,
      chatId,
      message: message.substring(0, 50),
    });

    const chatFunction = httpsCallable(functions, 'chatAttila');
    const result = await chatFunction({
      userId,
      chatId,
      message,
      contextRefs,
    });

    console.log('✅ Chat Attila result:', result.data);
    return result.data;
  } catch (error) {
    console.error('❌ Chat Attila error:', error);
    throw new Error(`Errore chat: ${error.message}`);
  }
};

/**
 * Gen Tasks Function
 */
export const genTasks = async (userId, matchId) => {
  try {
    console.log('📋 Calling Gen Tasks:', { userId, matchId });

    const tasksFunction = httpsCallable(functions, 'genTasks');
    const result = await tasksFunction({
      userId,
      matchId,
    });

    console.log('✅ Gen Tasks result:', result.data);
    return result.data;
  } catch (error) {
    console.error('❌ Gen Tasks error:', error);
    throw new Error(`Errore generazione task: ${error.message}`);
  }
};

/**
 * Helper per ottenere userId corrente
 */
export const getCurrentUserId = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Utente non autenticato');
  }
  return user.uid;
};

/**
 * Wrapper con userId automatico
 */
export const cloudFunctions = {
  ocrParseImage: async (matchId, type, storageUrl) => {
    const userId = getCurrentUserId();
    return await ocrParseImage(userId, matchId, type, storageUrl);
  },

  chatAttila: async (chatId, message, contextRefs = {}) => {
    const userId = getCurrentUserId();
    return await chatAttila(userId, chatId, message, contextRefs);
  },

  genTasks: async matchId => {
    const userId = getCurrentUserId();
    return await genTasks(userId, matchId);
  },
};

export default cloudFunctions;
