import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

export const metadata: Metadata = {
	title: {
		default: "OneRep",
		template: "%s | OneRep",
	},
	description: "Your Online Musical Repertoire",
	metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
	openGraph: {
		title: "OneRep",
		description: "Your Online Musical Repertoire",
		url: "/",
	},
	icons: [
		{
			type: "image/svg+xml",
			url: "/favicon.svg",
		},
		{
			type: "image/png",
			url: "/favicon.png",
		},
	],
};

export const viewport: Viewport = {
	themeColor: "#4760ff",
};
