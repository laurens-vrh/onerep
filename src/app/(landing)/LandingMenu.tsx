import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function LandingMenu() {
	return (
		<header className="w-full border-b z-10 relative bg-background">
			<Menubar className="h-14 sm:max-w-[75vw] mx-auto rounded-none border-none flex justify-between">
				<Link href="/" className="text-lg font-bold flex items-center">
					<Icons.logo className="w-8 h-8 mr-1" />
					OneRep
				</Link>
				<div className="flex gap-2">
					<Button asChild variant="ghost">
						<Link href="/signin">Sign in</Link>
					</Button>
					<Button asChild variant="default">
						<Link href="/signin">
							Launch <ArrowRight className="w-4 h-4 ml-2" />
						</Link>
					</Button>
				</div>
			</Menubar>
		</header>
	);
}
