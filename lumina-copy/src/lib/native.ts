import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { GoogleAuth } from '@southdevs/capacitor-google-auth';
import { saveAs } from 'file-saver';
import { supabase } from './supabase';

export const isNative = Capacitor.isNativePlatform();

const GOOGLE_WEB_CLIENT_ID = import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID;

export async function signInWithGoogleNative(): Promise<void> {
  if (!GOOGLE_WEB_CLIENT_ID) {
    throw new Error('VITE_GOOGLE_WEB_CLIENT_ID is not set');
  }
  await GoogleAuth.initialize({ clientId: GOOGLE_WEB_CLIENT_ID });
  const googleUser = await GoogleAuth.signIn({ scopes: ['email', 'profile'] });
  const idToken = googleUser.authentication?.idToken;
  if (!idToken) {
    throw new Error('Google did not return an ID token');
  }
  const { error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  });
  if (error) throw error;
}

export async function signInWithGoogle(): Promise<void> {
  if (isNative) {
    await signInWithGoogleNative();
    return;
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/app`,
    },
  });
  if (error) throw error;
}

export const APP_BASE_URL = 'https://luminamemories.netlify.app';

export async function clearServiceWorkerCaches(): Promise<void> {
  if (!isNative) return;
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
    if (navigator.serviceWorker) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
  } catch (error) {
    console.error('Failed to clear service worker caches:', error);
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function downloadBlob(blob: Blob, filename: string): Promise<void> {
  if (!isNative) {
    saveAs(blob, filename);
    return;
  }

  const base64 = await blobToBase64(blob);
  const safeName = filename.replace(/[^\w.-]+/g, '_');
  await Filesystem.writeFile({
    path: safeName,
    data: base64,
    directory: Directory.Cache,
    recursive: true,
  });
  const fileUri = await Filesystem.getUri({
    path: safeName,
    directory: Directory.Cache,
  });
  await Share.share({ title: filename, url: fileUri.uri });
}

export async function shareText(title: string, text: string, url: string): Promise<void> {
  const shareData = { title, text, url };

  if (isNative) {
    await Share.share(shareData);
    return;
  }

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share(shareData);
      return;
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
    }
  }

  await copyText(url);
}

export async function copyText(text: string): Promise<void> {
  if (isNative) {
    await Clipboard.write({ string: text });
    return;
  }
  await navigator.clipboard.writeText(text);
}
