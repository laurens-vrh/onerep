import { Composer } from "@prisma/client";
import { User } from "lucide-react";
import Link from "next/link";
import { SeparatorDot } from "../SeparatorDot";
import { Icons } from "../Icons";

export function ComposerCard({
	composer,
}: {
	composer: Pick<Composer, "id" | "name"> & {
		_count?: { compositions: number; savedBy: number };
	};
}) {
	return (
		<Link href={`/app/composer/${composer.id}`}>
			<li className="flex cursor-pointer select-none items-center rounded-sm px-3 py-2 border outline-none hover:bg-accent">
				<Icons.composer className="mr-2 h-6 w-6" />
				<div className="grid grid-cols-1">
					<span className="w-full">{composer.name}</span>
					{composer._count && (
						<span className="text-sm">
							{composer._count.compositions} compositions <SeparatorDot />
							{composer._count.savedBy} saves
						</span>
					)}
				</div>
			</li>
		</Link>
	);
}
