import { Icons } from "@/components/Icons";
import "@/styles/globals.css";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
				<div className="absolute inset-0 bg-neutral-900" />
				<div className="relative z-20 flex items-center text-lg font-medium">
					<Icons.logo className="mr-2 h-6 w-6" />
					OneRep
				</div>
			</div>
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					{children}
				</div>
			</div>
		</div>
	);
}
