"use client";

import { Button } from "@/components/ui/button";
import { success } from "@/lib/utils";
import { Share2 } from "lucide-react";

export function ShareButton({ path }: { path: string }) {
	return (
		<Button
			className="outline-none select-none cursor-pointer"
			variant="default"
			onClick={() => {
				navigator.clipboard.writeText(process.env.NEXT_PUBLIC_BASE_URL + path);
				success("Link copied to clipboard!");
			}}
		>
			<Share2 className="mr-2 h-4 w-4" /> Share
		</Button>
	);
}
