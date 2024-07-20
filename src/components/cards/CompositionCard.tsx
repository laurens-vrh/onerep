import { Button } from "@/components/ui/button";
import { Composer, Composition, List } from "@prisma/client";
import { FileMusic, ListCheck, ListPlus } from "lucide-react";
import Link from "next/link";
import { SaveCompositionButton } from "../buttons/SaveCompositionButton";
import { SeparatorDot } from "../SeparatorDot";

export function CompositionCard({
	composition,
	saveButton,
	user,
}: {
	composition: Pick<Composition, "id" | "name"> & {
		composers: Pick<Composer, "id" | "name">[];
		_count?: {
			users: number;
		};
	};
	saveButton?: boolean;
	user?: {
		compositions: { composition: Pick<Composition, "id"> }[];
		lists: (Pick<List, "id" | "name" | "icon"> & {
			compositions: {
				composition: Pick<Composition, "id">;
			}[];
		})[];
	};
}) {
	const saved = !!user?.compositions.find(
		(c) => c.composition.id === composition.id
	);

	return (
		<div className="relative">
			<Link
				href={`/app/composition/${composition.id}`}
				className="absolute inset-0 peer"
			/>
			<li className="flex cursor-pointer select-none items-center justify-between rounded-sm px-3 py-2 border outline-none peer-hover:bg-accent">
				<div className="flex items-center">
					<FileMusic className="mr-2 h-6 w-6" />
					<div className="grid grid-cols-1">
						<span className="w-full">{composition.name}</span>
						<span className="text-sm">
							By{" "}
							{composition.composers.map((a, i) => (
								<Link
									key={a.id}
									href={`/app/composer/${a.id}`}
									className="font-semibold hover:underline relative z-10"
								>
									{a.name}
									{i + 1 === composition.composers.length ? "" : ", "}
								</Link>
							))}
							{composition._count?.users ? (
								<>
									<SeparatorDot />
									{composition._count.users} saves
								</>
							) : null}
						</span>
					</div>
				</div>
				<div className="relative z-10">
					{saveButton && user && (
						<SaveCompositionButton
							composition={composition}
							user={user}
							button={
								<Button
									variant={saved ? "secondary" : "default"}
									className="cursor-pointer aspect-square p-2"
								>
									{saved ? (
										<ListCheck className="w-4 h-4" />
									) : (
										<ListPlus className="w-4 h-4" />
									)}
								</Button>
							}
						/>
					)}
				</div>
			</li>
		</div>
	);
}
