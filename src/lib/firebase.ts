import { cert, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

function firebaseAppSingleton() {
	return initializeApp({
		credential: cert({
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(
				/\\n/g,
				"\n"
			),
			projectId: process.env.FIREBASE_PROJECT_ID,
		}),
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	});
}

declare global {
	var firebaseApp: undefined | ReturnType<typeof firebaseAppSingleton>;
}

export const firebase = globalThis.firebaseApp ?? firebaseAppSingleton();
globalThis.firebaseApp = firebase;

export const storageBucket = getStorage(firebase).bucket();
