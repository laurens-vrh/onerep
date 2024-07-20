"use client";

import { Button } from "@/components/ui/button";
import { generalSave } from "@/lib/actions/composer";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function GeneralSaveButton({
	type,
	id,
	saved,
}: {
	type: "list" | "composer" | "user";
	id: number;
	saved: boolean;
}) {
	const router = useRouter();

	return (
		<Button
			className="outline-none select-none cursor-pointer"
			variant={saved ? "secondary" : "default"}
			onClick={async () => {
				await generalSave(type, id, !saved);
				router.refresh();
			}}
		>
			{saved ? (
				<>
					<BookmarkCheck className="mr-2 h-4 w-4 stroke-[2.7]" />
					{type === "user" ? "Following" : "Saved"}
				</>
			) : (
				<>
					<Bookmark className="mr-2 h-4 w-4 stroke-[2.7]" />
					{type === "user" ? "Follow" : "Save"}
				</>
			)}
		</Button>
	);
}
