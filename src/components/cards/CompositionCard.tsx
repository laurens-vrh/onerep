import { Button } from "@/components/ui/button";
import { Composer, Composition, List } from "@prisma/client";
import { FileMusic, ListCheck, ListPlus } from "lucide-react";
import Link from "next/link";
import { SaveCompositionButton } from "../buttons/SaveCompositionButton";
import { SeparatorDot } from "../SeparatorDot";
import { readableUrl } from "@/lib/utils";
import { TextLink } from "../TextLink";
import { Fragment } from "react";

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
				href={readableUrl("composition", composition)}
				className="absolute inset-0 peer"
			/>
			<li className="flex cursor-pointer select-none items-center justify-between rounded-sm px-3 py-2 border outline-none peer-hover:bg-accent">
				<div className="flex items-center">
					<FileMusic className="mr-2 h-6 w-6" />
					<div className="grid grid-cols-1">
						<span className="w-full">{composition.name}</span>
						<span className="text-sm">
							By{" "}
							{composition.composers.map((composer, i) => (
								<Fragment key={composer.id}>
									<TextLink
										href={readableUrl("composer", composer)}
										hidden={true}
										className="font-semibold relative z-10"
									>
										{composer.name}
									</TextLink>
									{composition.composers.length !== i + 1 && ", "}
								</Fragment>
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
							small={true}
						/>
					)}
				</div>
			</li>
		</div>
	);
}
