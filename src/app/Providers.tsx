import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			enableSystem
			defaultTheme="light"
			disableTransitionOnChange
		>
			{children}
		</ThemeProvider>
	);
}
