"use client";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useWindowSize } from "@/hooks/useWindowSize";
import { PrivateUser, UserProfile } from "@/database/User";
import { ReactNode, useState } from "react";
import { Menu } from "./Menu";
import { Sidebar } from "./Sidebar";

export function AppLayout({
	user,
	children,
}: {
	user: PrivateUser & UserProfile;
	children: ReactNode;
}) {
	const renderSidebar = useWindowSize().width >= 1024;
	const [showSidebar, setShowSidebar] = useState(true);

	return (
		<>
			<Menu
				user={user}
				showSidebar={showSidebar}
				setShowSidebar={setShowSidebar}
			/>

			<div className="relative h-[calc(100vh-2.5rem)] w-screen border-t bg-background">
				{renderSidebar && showSidebar ? (
					<ResizablePanelGroup direction="horizontal">
						<ResizablePanel
							defaultSize={15}
							minSize={10}
							maxSize={30}
							className="max-lg:hidden"
						>
							<Sidebar user={user} />
						</ResizablePanel>
						<ResizableHandle className="max-lg:hidden" />
						<ResizablePanel defaultSize={85}>{children}</ResizablePanel>
					</ResizablePanelGroup>
				) : (
					children
				)}
			</div>
		</>
	);
}
