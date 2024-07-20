"use client";

import { Button } from "@/components/ui/button";
import { CircleCheck, Share2 } from "lucide-react";
import { toast } from "sonner";

export function ShareButton({ path }: { path: string }) {
	return (
		<Button
			className="outline-none select-none cursor-pointer"
			variant="default"
			onClick={() => {
				navigator.clipboard.writeText(process.env.NEXT_PUBLIC_BASE_URL + path);
				toast("Link copied to clipboard!", {
					icon: <CircleCheck className="mr-2 w-4 h-4 my-auto" />,
				});
			}}
		>
			<Share2 className="mr-2 h-4 w-4" /> Share
		</Button>
	);
}
