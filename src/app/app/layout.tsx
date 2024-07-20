import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser, getUserProfile } from "@/lib/database/User";
import { AppLayout } from "./AppLayout";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Error from "./error";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const privateUser = (await getCurrentUser())!;
	const user = {
		...privateUser,
		...(await getUserProfile(privateUser.id))!,
	};

	return (
		<>
			<div className="h-screen grid">
				<AppLayout user={user}>
					<ScrollArea
						className="h-full px-4 md:px-8"
						viewportClassName="relative [&>div]:!block"
					>
						<ErrorBoundary errorComponent={Error}>
							<div className="py-4 md:py-8 w-full">{children}</div>
						</ErrorBoundary>
					</ScrollArea>
				</AppLayout>
			</div>

			<Toaster />
		</>
	);
}
