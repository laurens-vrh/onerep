import { ApprovementBadge } from "@/components/ApprovementBadge";
import { BackButton } from "@/components/buttons/BackButton";
import { SaveCompositionButton } from "@/components/buttons/SaveCompositionButton";
import { ShareButton } from "@/components/buttons/ShareButton";
import { CompositionCard } from "@/components/cards/CompositionCard";
import { ListCard } from "@/components/cards/ListCard";
import { GridCard } from "@/components/GridCard";
import { Heading } from "@/components/Heading";
import { PageHeader } from "@/components/PageHeader";
import { SeparatorDot } from "@/components/SeparatorDot";
import { getComposition } from "@/database/Composition";
import { prisma } from "@/database/prisma";
import { getCurrentUser, getUserProfile } from "@/database/User";
import { FileMusic, Pencil, Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { UserCompositionData } from "./UserCompositionData";
import { readableUrl } from "@/lib/utils";
import { TextLink } from "@/components/TextLink";
import { CompositionDialog } from "@/components/dialogs/CompositionDialog";
import { Button } from "@/components/ui/button";
import { Role } from "@prisma/client";
import { Fragment } from "react";

export default async function Page({
	params,
}: {
	params: { compositionId: string };
}) {
	const composition = await getComposition(
		parseInt(params.compositionId.split("-")[0]) ?? 0
	);
	if (!composition)
		return (
			<>
				<Heading level={1}>Composition</Heading>
				<p className="text-lg my-4">This composition is unknown.</p>
				<BackButton />
			</>
		);
	const { id } = (await getCurrentUser())!;
	const user = (await getUserProfile(id))!;

	return (
		<div className="flex flex-col gap-4">
			<PageHeader
				icon={FileMusic}
				title={composition.name}
				type="Composition"
				composer={
					<>
						By{" "}
						{composition.composers.map((composer, i) => (
							<Fragment key={composer.id}>
								<TextLink href={readableUrl("composer", composer)}>
									{composer.name}
								</TextLink>
								{composition.composers.length === i + 1 ? "" : ", "}
							</Fragment>
						))}
						<SeparatorDot />
						{composition._count.users} saves
					</>
				}
				badge={
					!composition.approved ? (
						<ApprovementBadge
							type="composition"
							approved={composition.approved}
						/>
					) : undefined
				}
				actions={
					<>
						<SaveCompositionButton composition={composition} user={user} />
						<ShareButton path={readableUrl("composition", composition)} />

						{user.role === Role.ADMIN && (
							<CompositionDialog
								trigger={
									<Button className="outline-none select-none">
										<Pencil className="mr-2 h-4 min-w-4" />
										Edit
									</Button>
								}
								composition={composition}
								composers={composition.composers}
								edit={true}
							/>
						)}
					</>
				}
			/>

			<div>
				<Heading level={2} className="mb-2">
					Your notes
				</Heading>

				{!composition.users[0] ? (
					<p>
						Add this composition to one of your lists to add notes, sheet music,
						etc.
					</p>
				) : (
					<UserCompositionData composition={composition} />
				)}
			</div>

			{composition.otherCompositions.length + composition.lists.length > 0 && (
				<div>
					<Heading level={2} className="mb-2">
						Related
					</Heading>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						{composition.otherCompositions.length > 0 && (
							<GridCard
								title={
									"Other compositions by " +
									composition.composers.map((a) => a.name).join(", ")
								}
							>
								{composition.otherCompositions.map((c) => (
									<CompositionCard
										key={c.id}
										composition={c}
										saveButton={true}
										user={user}
									/>
								))}
							</GridCard>
						)}
						{composition.lists.length > 0 && (
							<GridCard title="Lists with this composition">
								{composition.lists.map((list) => (
									<ListCard key={list.list.id} list={list.list} />
								))}
							</GridCard>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export async function generateMetadata({
	params,
}: {
	params: { compositionId: string };
}): Promise<Metadata> {
	const composition = await prisma.composition.findUnique({
		where: { id: parseInt(params.compositionId) ?? 0 },
		select: { name: true, composers: { select: { name: true } } },
	});
	return {
		title: composition
			? composition.name +
			  " by " +
			  composition.composers.map((a) => a.name).join(", ")
			: "Unknown composition",
	};
}
