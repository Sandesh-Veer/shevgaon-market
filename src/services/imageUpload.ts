import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Image Upload Service
 * Supports:
 * 1. Firebase Storage (Standard setup using the existing Firebase config in ./firebase.ts)
 * 2. Cloudinary (Unsigned upload preset via REST API)
 *
 * Config requirements:
 * - Firebase Storage: Requires VITE_FIREBASE_STORAGE_BUCKET in .env
 * - Cloudinary: Requires VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env
 */

export interface UploadOptions {
  provider?: 'firebase' | 'cloudinary' | 'auto';
  folder?: string;
  onProgress?: (progress: number) => void;
}

/**
 * Upload single image to Firebase Storage
 */
export async function uploadToFirebaseStorage(
  file: File,
  folder: string = 'farmers'
): Promise<string> {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized.');
  }

  // Create sanitized unique file name
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${cleanName}`;
  const storageRef = ref(storage, `${folder}/${uniqueName}`);

  // Upload bytes with content type metadata
  const metadata = {
    contentType: file.type || 'image/jpeg',
  };

  const snapshot = await uploadBytes(storageRef, file, metadata);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

/**
 * Upload single image to Cloudinary (Unsigned Upload)
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = 'farmers'
): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary configuration missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok || !data.secure_url) {
    throw new Error(
      data?.error?.message || 'Cloudinary upload failed. Check cloud name and unsigned upload preset.'
    );
  }

  return data.secure_url as string;
}

/**
 * Primary dispatch function: uploads file to Firebase Storage or Cloudinary
 */
export async function uploadImage(
  file: File,
  options: UploadOptions = {}
): Promise<string> {
  const { provider = 'auto', folder = 'farmers' } = options;

  // 1. Explicit Cloudinary selection
  if (provider === 'cloudinary') {
    return await uploadToCloudinary(file, folder);
  }

  // 2. Explicit Firebase Storage selection
  if (provider === 'firebase') {
    return await uploadToFirebaseStorage(file, folder);
  }

  // 3. Auto mode:
  // If Cloudinary environment variables are configured, prefer Cloudinary
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (cloudName && uploadPreset) {
    try {
      return await uploadToCloudinary(file, folder);
    } catch (cloudErr) {
      console.warn('Cloudinary upload failed, attempting Firebase Storage fallback:', cloudErr);
      return await uploadToFirebaseStorage(file, folder);
    }
  }

  // Default to Firebase Storage (already initialized in this repo)
  return await uploadToFirebaseStorage(file, folder);
}

/**
 * Helper to upload multiple images concurrently
 */
export async function uploadMultipleImages(
  files: File[],
  options: UploadOptions = {}
): Promise<string[]> {
  if (!files || files.length === 0) return [];
  const uploadPromises = files.map((file) => uploadImage(file, options));
  return await Promise.all(uploadPromises);
}
