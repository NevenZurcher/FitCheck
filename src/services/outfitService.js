import { db, storage } from '../firebase.config';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    updateDoc,
    doc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { geminiService } from './geminiService';

export const outfitService = {
    // Generate outfit
    async generateOutfit(userId, wardrobeItems, constraints) {
        try {
            const outfitSuggestion = await geminiService.generateOutfit(wardrobeItems, constraints);

            // Save outfit to history
            const outfitData = {
                userId,
                items: wardrobeItems.map(item => item.id),
                occasion: constraints.occasion || '',
                weather: constraints.weather || null,
                aiSuggestion: outfitSuggestion,
                imageUrl: null, // Will be updated after image generation
                favorite: false,
                createdAt: new Date()
            };

            const docRef = await addDoc(collection(db, 'outfits'), outfitData);
            return { success: true, id: docRef.id, outfit: outfitSuggestion };
        } catch (error) {
            console.error('Error generating outfit:', error);
            return { success: false, error: error.message };
        }
    },

    // Get outfit history
    async getOutfitHistory(userId) {
        try {
            const q = query(
                collection(db, 'outfits'),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const outfits = [];

            querySnapshot.forEach((doc) => {
                outfits.push({ id: doc.id, ...doc.data() });
            });

            return { success: true, outfits };
        } catch (error) {
            console.error('Error getting outfit history:', error);
            return { success: false, error: error.message, outfits: [] };
        }
    },

    // Toggle favorite
    async toggleFavorite(outfitId, currentFavoriteStatus) {
        try {
            const outfitRef = doc(db, 'outfits', outfitId);
            await updateDoc(outfitRef, { favorite: !currentFavoriteStatus });
            return { success: true };
        } catch (error) {
            console.error('Error toggling favorite:', error);
            return { success: false, error: error.message };
        }
    },

    // Update outfit with generated image
    async updateOutfitImage(outfitId, imageUrl) {
        try {
            console.log('updateOutfitImage called with:', { outfitId, imageUrlLength: imageUrl?.length });

            // Check if image data is too large (Firestore has 1MB limit per document)
            const imageSizeKB = imageUrl ? (imageUrl.length * 3 / 4) / 1024 : 0;
            console.log('Image size:', imageSizeKB.toFixed(2), 'KB');

            let finalImageUrl = imageUrl;

            // If image is too large, upload to Firebase Storage instead
            if (imageSizeKB > 900) {
                console.log('Image too large for Firestore, uploading to Storage...');

                try {
                    // Convert base64 to blob
                    const base64Data = imageUrl.split(',')[1];
                    const mimeType = imageUrl.match(/data:([^;]+);/)[1];
                    const byteCharacters = atob(base64Data);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: mimeType });

                    // Upload to Firebase Storage
                    const storageRef = ref(storage, `outfit-images/${outfitId}.png`);
                    await uploadBytes(storageRef, blob);
                    finalImageUrl = await getDownloadURL(storageRef);

                    console.log('Image uploaded to Storage, URL:', finalImageUrl);
                } catch (storageError) {
                    console.error('Error uploading to Storage:', storageError);
                    return { success: false, error: storageError.message };
                }
            }

            const outfitRef = doc(db, 'outfits', outfitId);
            await updateDoc(outfitRef, { imageUrl: finalImageUrl });
            console.log('Image URL successfully saved to Firestore');
            return { success: true };
        } catch (error) {
            console.error('Error updating outfit image:', error);
            return { success: false, error: error.message };
        }
    }
};
