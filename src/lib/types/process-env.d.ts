export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NEXT_PUBLIC_BASE_URL: string;
			NEXT_PUBLIC_API_BASE: string;

			AUTH_URL: string;
			AUTH_SECRET: string;
			AUTH_GOOGLE_ID: string;
			AUTH_GOOGLE_SECRET: string;
			AUTH_DISCORD_ID: string;
			AUTH_DISCORD_SECRET: string;
			AUTH_GITHUB_ID: string;
			AUTH_GITHUB_SECRET: string;
			AUTH_TWITCH_ID: string;
			AUTH_TWITCH_SECRET: string;

			POSTGRES_PRISMA_URL: string;
			POSTGRES_URL_NON_POOLING: string;

			FIREBASE_CLIENT_EMAIL: string;
			FIREBASE_PRIVATE_KEY: string;
			FIREBASE_PROJECT_ID: string;
			FIREBASE_STORAGE_BUCKET: string;
		}
	}
}
