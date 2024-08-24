import { BackButton } from "@/components/buttons/BackButton";
import { GeneralSaveButton } from "@/components/buttons/GeneralSaveButton";
import { ShareButton } from "@/components/buttons/ShareButton";
import { CompositionCard } from "@/components/cards/CompositionCard";
import { ListCard } from "@/components/cards/ListCard";
import { ListDialog } from "@/components/dialogs/ListDialog";
import { GridCard } from "@/components/GridCard";
import { Heading } from "@/components/Heading";
import { Icons } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { SeparatorDot } from "@/components/SeparatorDot";
import { TextLink } from "@/components/TextLink";
import { Button } from "@/components/ui/button";
import { getList } from "@/database/List";
import { prisma } from "@/database/prisma";
import { getCurrentUser, getUserProfile } from "@/database/User";
import { readableUrl } from "@/lib/utils";
import { format } from "date-fns";
import { PencilIcon } from "lucide-react";
import { Metadata } from "next";
import { ListCompositionsTable } from "./ListCompositionsTable";

export default async function Page({ params }: { params: { listId: string } }) {
	const { id } = (await getCurrentUser())!;
	const user = (await getUserProfile(id))!;
	const list = await getList(parseInt(params.listId.split("-")[0]) ?? 0);
	if (!list)
		return (
			<>
				<Heading level={1}>List</Heading>
				<p className="text-lg my-4">This list is unknown.</p>
				<BackButton />
			</>
		);

	const saved = user.savedLists.map((l) => l.id).includes(list.id);
	const otherLists = list.user.lists.filter((l) => l.id !== list.id);

	return (
		<div className="flex flex-col gap-4">
			<PageHeader
				icon={Icons.listIcons[list.icon]}
				type="List"
				title={list.name}
				description={[
					...(list.description ? [list.description] : []),
					`Created ${format(list.createdAt, "PPP")} • Updated
						${format(list.updatedAt, "PPP")}`,
				]}
				composer={
					<>
						By{" "}
						<TextLink href={`/app/user/${list.user.username}`}>
							@{list.user.username}
						</TextLink>
						{list.custom && (
							<>
								<SeparatorDot />
								{list._count.savedBy} saves
							</>
						)}
						<SeparatorDot />
						{list.compositions.length} compositions
					</>
				}
				actions={
					<>
						{list.user.id !== user.id && list.custom && (
							<GeneralSaveButton type="list" saved={saved} id={list.id} />
						)}
						<ShareButton path={readableUrl("list", list)} />
						{list.user.id === user.id && (
							<ListDialog
								list={list}
								edit={true}
								user={user}
								trigger={
									<Button className="outline-none w-full" variant="default">
										<PencilIcon className="mr-2 h-4 w-4" /> Edit
									</Button>
								}
							/>
						)}
					</>
				}
			/>

			<ListCompositionsTable
				list={list}
				showActions={list.user.id === user.id}
				currentUserProfile={user}
			/>

			{(user.id !== list.user.id || list.otherCompositions.length > 0) && (
				<div>
					<Heading level={2} className="mb-2">
						Related
					</Heading>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						{user.id !== list.user.id && (
							<GridCard title={"Other lists by @" + list.user.username}>
								{otherLists.map((l) => (
									<ListCard key={l.id} list={l} showUser={false} />
								))}
							</GridCard>
						)}
						{list.otherCompositions.length > 0 && (
							<GridCard title="Other compositions by composers in this list">
								{list.otherCompositions.map((c) => (
									<CompositionCard
										key={c.id}
										composition={c}
										saveButton={true}
										user={user}
									/>
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
	params: { listId: string };
}): Promise<Metadata> {
	const list = await prisma.list.findUnique({
		where: { id: parseInt(params.listId) ?? 0 },
		select: {
			name: true,
			description: true,
			user: { select: { username: true } },
		},
	});
	return {
		title: list?.name
			? list.name + " (@" + list?.user.username + ")"
			: "Unkown list",
		description: list?.description ?? "",
	};
}
