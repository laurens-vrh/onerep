import { ApprovementBadge } from "@/components/ApprovementBadge";
import { BackButton } from "@/components/buttons/BackButton";
import { GeneralSaveButton } from "@/components/buttons/GeneralSaveButton";
import { ShareButton } from "@/components/buttons/ShareButton";
import { ListCard } from "@/components/cards/ListCard";
import { CompositionDialog } from "@/components/dialogs/CompositionDialog";
import { Heading } from "@/components/Heading";
import { PageHeader } from "@/components/PageHeader";
import { SeparatorDot } from "@/components/SeparatorDot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getComposer } from "@/lib/database/Composer";
import { getCurrentUser, getUserProfile } from "@/lib/database/User";
import { Pencil, Plus, User } from "lucide-react";
import { ComposerCompositionTable } from "./ComposerCompositionTable";
import { Icons } from "@/components/Icons";
import { GridCard } from "@/components/GridCard";
import { prisma } from "@/lib/database/prisma";
import { Metadata } from "next";
import { readableUrl } from "@/lib/utils";
import { ComposerDialog } from "@/components/dialogs/ComposerDialog";
import { Role } from "@prisma/client";

export default async function Page({
	params,
}: {
	params: { composerId: string };
}) {
	const composer = await getComposer(
		parseInt(params.composerId.split("-")[0]) ?? 0
	);
	if (!composer)
		return (
			<>
				<Heading level={1}>Composer</Heading>
				<p className="text-lg my-4">This composer is unknown.</p>
				<BackButton />
			</>
		);

	const { id } = (await getCurrentUser())!;
	const user = (await getUserProfile(id))!;

	return (
		<div className="flex flex-col gap-4">
			<PageHeader
				icon={Icons.composer}
				title={composer.name}
				type="Composer"
				composer={
					<>
						{composer.compositions.length} compositions
						<SeparatorDot />
						{composer._count.savedBy} saves
					</>
				}
				badge={
					!composer.approved ? (
						<ApprovementBadge type="composition" approved={composer.approved} />
					) : undefined
				}
				actions={
					<>
						<GeneralSaveButton
							type="composer"
							id={composer.id}
							saved={!!user.savedComposers.find((a) => a.id === composer.id)}
						/>
						<CompositionDialog
							trigger={
								<Button className="outline-none select-none" variant="default">
									<Plus className="mr-2 h-4 min-w-4" />
									Composition
								</Button>
							}
							composers={[composer]}
						/>
						<ShareButton path={readableUrl("composer", composer)} />

						{user.role === Role.ADMIN && (
							<ComposerDialog
								trigger={
									<Button className="outline-none select-none">
										<Pencil className="mr-2 h-4 min-w-4" />
										Edit
									</Button>
								}
								composer={composer}
								edit={true}
							/>
						)}
					</>
				}
			/>

			<ComposerCompositionTable composer={composer} currentUserProfile={user} />

			{composer.lists.length > 0 && (
				<div>
					<Heading level={2} className="mb-2">
						Related
					</Heading>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						{composer.lists.length > 0 && (
							<GridCard title={"Lists with " + composer.name}>
								{composer.lists.map((list) => (
									<ListCard key={list.id} list={list} />
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
	params: { composerId: string };
}): Promise<Metadata> {
	const composer = await prisma.composer.findUnique({
		where: { id: parseInt(params.composerId) ?? 0 },
		select: { name: true },
	});
	return {
		title: composer?.name ?? "Unknown composer",
	};
}
