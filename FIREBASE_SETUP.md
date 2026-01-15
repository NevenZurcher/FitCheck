# Firebase Setup Guide

## Issue: Storage Permission Denied

If you're getting `storage/unauthorized` errors, you need to configure Firebase Storage security rules.

## Fix: Update Firebase Storage Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click on the **Rules** tab
5. Replace the default rules with the following:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to read and write their own wardrobe items
    match /wardrobe/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Optional: Allow public read access to wardrobe images
    // Uncomment if you want to share outfit images publicly
    // match /wardrobe/{userId}/{allPaths=**} {
    //   allow read: if true;
    //   allow write: if request.auth != null && request.auth.uid == userId;
    // }
  }
}
```

6. Click **Publish** to save the rules

## Also Update Firestore Rules

While you're at it, update your Firestore Database rules:

1. Navigate to **Firestore Database** in the left sidebar
2. Click on the **Rules** tab
3. Replace with:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Wardrobe items - users can only access their own items
    match /wardrobe/{itemId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                      request.resource.data.userId == request.auth.uid;
    }
    
    // Outfits - users can only access their own outfits
    match /outfits/{outfitId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                      request.resource.data.userId == request.auth.uid;
    }
  }
}
```

4. Click **Publish**

## Test Again

After updating the rules:
1. Refresh your browser
2. Try uploading an image again
3. It should work now! ✅

## Security Notes

These rules ensure:
- ✅ Only authenticated users can upload images
- ✅ Users can only access their own wardrobe items
- ✅ Users can only access their own outfits
- ✅ No one can access another user's data

## Troubleshooting

If you still get errors:
- Make sure you're signed in to the app
- Check the Firebase Console for any error messages
- Verify your Firebase project is on the Blaze (pay-as-you-go) plan if needed
- Wait 1-2 minutes for rules to propagate
