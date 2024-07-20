import { ApprovementBadge } from "@/components/ApprovementBadge";
import { BackButton } from "@/components/buttons/BackButton";
import { SaveCompositionButton } from "@/components/buttons/SaveCompositionButton";
import { ShareButton } from "@/components/buttons/ShareButton";
import { CompositionCard } from "@/components/cards/CompositionCard";
import { ListCard } from "@/components/cards/ListCard";
import { Heading } from "@/components/Heading";
import { PageHeader } from "@/components/PageHeader";
import { SeparatorDot } from "@/components/SeparatorDot";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getComposition } from "@/lib/database/Composition";
import { getCurrentUser, getUserProfile } from "@/lib/database/User";
import { FileMusic } from "lucide-react";
import Link from "next/link";
import { UserCompositionData } from "./UserCompositionData";
import { GridCard } from "@/components/GridCard";
import { prisma } from "@/lib/database/prisma";
import { Metadata } from "next";

export default async function Page({
	params,
}: {
	params: { compositionId: string };
}) {
	const composition = await getComposition(parseInt(params.compositionId) ?? 0);
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
							<Link
								key={composer.id}
								href={`/app/composer/${composer.id}`}
								className="hover:underline"
							>
								{composer.name}
								{composition.composers.length === i + 1 ? "" : ", "}
							</Link>
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
						<ShareButton path={"/app/composition/" + composition.id} />
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
