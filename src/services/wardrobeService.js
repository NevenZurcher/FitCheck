import { db, storage } from '../firebase.config';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { geminiService } from './geminiService';

export const wardrobeService = {
    // Add new clothing item
    async addItem(userId, imageFile, additionalData = {}) {
        try {
            // Upload image to Firebase Storage
            const imageRef = ref(storage, `wardrobe/${userId}/${Date.now()}_${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            const imageUrl = await getDownloadURL(imageRef);

            // Analyze clothing with Gemini Vision
            const aiAnalysis = await geminiService.analyzeClothing(imageFile);

            // Create wardrobe item document
            const itemData = {
                userId,
                imageUrl,
                imagePath: imageRef.fullPath,
                category: aiAnalysis.category || additionalData.category || 'other',
                colors: aiAnalysis.colors || [],
                season: aiAnalysis.season || [],
                style: aiAnalysis.style || [],
                description: aiAnalysis.description || '',
                aiAnalysis,
                favorite: false,
                createdAt: new Date(),
                ...additionalData
            };

            const docRef = await addDoc(collection(db, 'wardrobe'), itemData);
            return { success: true, id: docRef.id, data: itemData };
        } catch (error) {
            console.error('Error adding item:', error);
            return { success: false, error: error.message };
        }
    },

    // Get all wardrobe items for a user
    async getItems(userId) {
        try {
            const q = query(
                collection(db, 'wardrobe'),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const items = [];

            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });

            return { success: true, items };
        } catch (error) {
            console.error('Error getting items:', error);
            return { success: false, error: error.message, items: [] };
        }
    },

    // Update wardrobe item
    async updateItem(itemId, updates) {
        try {
            const itemRef = doc(db, 'wardrobe', itemId);
            await updateDoc(itemRef, updates);
            return { success: true };
        } catch (error) {
            console.error('Error updating item:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete wardrobe item
    async deleteItem(itemId, imagePath) {
        try {
            // Delete image from storage
            if (imagePath) {
                const imageRef = ref(storage, imagePath);
                await deleteObject(imageRef);
            }

            // Delete document from Firestore
            await deleteDoc(doc(db, 'wardrobe', itemId));
            return { success: true };
        } catch (error) {
            console.error('Error deleting item:', error);
            return { success: false, error: error.message };
        }
    },

    // Toggle favorite status
    async toggleFavorite(itemId, currentFavoriteStatus) {
        try {
            const itemRef = doc(db, 'wardrobe', itemId);
            await updateDoc(itemRef, { favorite: !currentFavoriteStatus });
            return { success: true };
        } catch (error) {
            console.error('Error toggling favorite:', error);
            return { success: false, error: error.message };
        }
    }
};
