import { Update } from "@/lib/database/Update";
import { getCurrentUser, getUserProfile } from "@/lib/database/User";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import { ComposerCard } from "./cards/ComposerCard";
import { CompositionCard } from "./cards/CompositionCard";
import { ListCard } from "./cards/ListCard";
import { UserCard } from "./cards/UserCard";

export async function UpdateList({
	updates,
	message,
}: {
	updates: Update[];
	message?: string;
}) {
	if (updates.length === 0)
		return (
			<p className="mx-auto text-muted-foreground w-fit my-6">
				{message ?? "No recent updates."}
			</p>
		);

	const currentUser = (await getUserProfile((await getCurrentUser())!.id))!;

	return updates.map((update, index) => (
		<div
			key={index}
			className={cn("p-6", index + 1 !== updates.length && "border-b")}
		>
			<p className="text-xs">
				{format(
					update.createdAt,
					update.createdAt.getFullYear() === new Date().getFullYear()
						? "MMMM do"
						: "PPP"
				)}
			</p>
			<p className="mb-2">
				<Link
					href={"/app/user/" + update.user.id}
					className="hover:underline font-semibold"
				>
					@{update.user.username}
				</Link>
				{
					{
						FAVORITE: ` added ${update.relatedComposition?.name} to their favorites!`,
						REPERTOIRE: ` added ${update.relatedComposition?.name} to their repertoire!`,
						FOLLOW: ` started following @${update.relatedUser?.username}!`,
						CREATE_LIST: " created a new list!",
						SAVE_COMPOSER: " saved a composer!",
						SAVE_LIST: " saved a list!",
					}[update.type]
				}
			</p>

			<div className="grid gap-2">
				{update.relatedComposition && (
					<CompositionCard
						composition={update.relatedComposition}
						user={currentUser}
						saveButton={true}
					/>
				)}
				{update.relatedList && (
					<ListCard
						list={update.relatedList}
						showUser={update.relatedList.user.id !== update.user.id}
					/>
				)}
				{update.relatedComposer && (
					<ComposerCard composer={update.relatedComposer} />
				)}
				{update.relatedUser && <UserCard user={update.relatedUser} />}
			</div>
		</div>
	));
}
