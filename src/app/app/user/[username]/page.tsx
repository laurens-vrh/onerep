import { BackButton } from "@/components/buttons/BackButton";
import { GeneralSaveButton } from "@/components/buttons/GeneralSaveButton";
import { ShareButton } from "@/components/buttons/ShareButton";
import { ComposerCard } from "@/components/cards/ComposerCard";
import { CompositionCard } from "@/components/cards/CompositionCard";
import { ListCard } from "@/components/cards/ListCard";
import { UserCard } from "@/components/cards/UserCard";
import { GridCard } from "@/components/GridCard";
import { Heading } from "@/components/Heading";
import { PageHeader } from "@/components/PageHeader";
import { SeparatorDot } from "@/components/SeparatorDot";
import { TextLink } from "@/components/TextLink";
import { Badge } from "@/components/ui/badge";
import { UpdateList } from "@/components/UpdateList";
import { prisma } from "@/database/prisma";
import {
	getCurrentUser,
	getUserProfile,
	getUserProfileByUsername,
} from "@/database/User";
import { Composer, Role } from "@prisma/client";
import { format } from "date-fns";
import { Shield, User } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export default async function Page({
	params,
}: {
	params: { username: string };
}) {
	const user = await getUserProfileByUsername(params.username);
	if (!user)
		return (
			<>
				<Heading level={1}>User</Heading>
				<p className="text-lg my-4">This user is unknown.</p>
				<BackButton />
			</>
		);

	const currentUser = (await getUserProfile((await getCurrentUser())!.id))!;
	const favoritesList = user.lists.find((l) => !l.custom && l.position === 4);
	const composers = user.lists
		.reduce((previous, current) => {
			current.compositions.forEach((c) => {
				c.composition.composers.forEach((composer) => {
					const previousComposer = previous.find((c2) => composer.id === c2.id);
					previous = previous.filter((c2) => c2.id !== composer.id);
					previous.push({
						...composer,
						count: (previousComposer?.count ?? 0) + 1,
					});
				});
			});
			return previous;
		}, [] as (Pick<Composer, "id" | "name"> & { count?: number })[])
		.toSorted((a, b) => (b.count ?? 0) - (a.count ?? 0))
		.slice(0, 9);

	return (
		<div className="flex flex-col gap-4">
			<PageHeader
				icon={User}
				title={"@" + user.username}
				type="User"
				description={"Joined " + format(user.createdAt, "PPP")}
				composer={
					<>
						{user.compositions.length} saves
						<SeparatorDot />
						{user.lists.length} lists
						<SeparatorDot />
						{user.followers.length} followers
						<SeparatorDot />
						{user.following.length} following
					</>
				}
				badge={
					user.role === Role.ADMIN ? (
						<Badge variant="default" className="select-none">
							<Shield className="w-4 h-4 mr-1" />
							Administrator
						</Badge>
					) : null
				}
				actions={
					<>
						{user.id !== currentUser.id && (
							<GeneralSaveButton
								id={user.id}
								type="user"
								saved={!!currentUser.following.find((u) => u.id === user.id)}
							/>
						)}
						<ShareButton path={"/app/user/" + user.username} />
					</>
				}
			/>

			<div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					{favoritesList && favoritesList.compositions.length > 0 && (
						<GridCard
							title={
								<TextLink href={"/app/list/" + favoritesList.id}>
									Favorite Compositions
								</TextLink>
							}
							forceSingle={true}
						>
							{favoritesList.compositions.map((c) => (
								<CompositionCard
									key={c.composition.id}
									composition={c.composition}
									user={currentUser}
									saveButton={true}
								/>
							))}
						</GridCard>
					)}

					{user.lists.length > 0 && (
						<GridCard title="Lists" forceSingle={true}>
							{user.lists.map((list) => (
								<ListCard key={list.id} list={list} />
							))}
						</GridCard>
					)}

					{composers.length > 0 && (
						<GridCard
							title={`Composers in lists by @${user.username}`}
							forceSingle={true}
						>
							{composers.slice(0, 7).map((composer) => (
								<ComposerCard key={composer.id} composer={composer} />
							))}
						</GridCard>
					)}

					{user.following.length > 0 && (
						<GridCard title="Following" forceSingle={true}>
							{user.following.map((u) => (
								<UserCard key={u.id} user={u} />
							))}
						</GridCard>
					)}

					<div className="md:row-start-1 md:row-span-6 md:col-start-2 xl:col-start-3">
						<Heading level={2} className="mb-2">
							Updates
						</Heading>
						<div className="border rounded-lg">
							<UpdateList updates={user.updates} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export async function generateMetadata({
	params,
}: {
	params: { username: string };
}): Promise<Metadata> {
	const user = await prisma.user.findUnique({
		where: { username: params.username },
		select: { username: true },
	});
	return {
		title: user ? "@" + user.username : "Unknown user",
	};
}
