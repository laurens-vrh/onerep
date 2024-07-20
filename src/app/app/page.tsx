import { ComposerCard } from "@/components/cards/ComposerCard";
import { CompositionCard } from "@/components/cards/CompositionCard";
import { ListCard } from "@/components/cards/ListCard";
import { GridCard } from "@/components/GridCard";
import { Heading } from "@/components/Heading";
import { UpdateList } from "@/components/UpdateList";
import { getHomeData, getUpdates } from "@/lib/database/Update";
import { getCurrentUser, getUserProfile } from "@/lib/database/User";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

export default async function App() {
	const user = (await getUserProfile((await getCurrentUser())!.id))!;
	const updates = (await getUpdates()) ?? [];
	const homeData = (await getHomeData())!;

	const welcome = user.compositions.length === 0;
	const recentCompositions = user.compositions
		.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
		.slice(-10);
	const recentLists = user.lists
		.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
		.slice(-10);

	return (
		<>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				<div className="xl:col-span-2 mb-4">
					<Heading level={1} className="text-2xl lg:text-5xl">
						Welcome{!welcome && " Back"},{" "}
						<span className="bg-gradient-to-tr from-primary to-primary/50 bg-clip-text text-transparent">
							@{user.username}
						</span>
						!
					</Heading>

					{welcome && (
						<p className="mt-4 text-xl text-muted-foreground">
							Start building your collection by searching for a piece or
							composer.
						</p>
					)}
				</div>

				{recentCompositions.length + recentLists.length > 0 && (
					<Heading
						level={2}
						className={cn(
							"-mb-2",
							updates.length > 0
								? "xl:col-span-2"
								: "md:col-span-2 xl:col-span-3"
						)}
					>
						Recently Updated
					</Heading>
				)}
				{recentCompositions.length > 0 && (
					<GridCard title="Compositions">
						{recentCompositions.map((c) => (
							<CompositionCard
								key={c.composition.id}
								composition={c.composition}
							/>
						))}
					</GridCard>
				)}
				{recentLists.length > 0 && (
					<GridCard title="Lists">
						{recentLists.map((l) => (
							<ListCard key={l.id} list={l} />
						))}
					</GridCard>
				)}

				<div
					className={cn(
						"md:row-start-1 md:col-start-2 xl:col-start-3",
						updates.length > 0 ? "md:row-span-8" : "md:row-span-1"
					)}
				>
					<Heading level={2} className="mb-2">
						Updates
					</Heading>
					<div className="border rounded-lg px-4">
						<UpdateList
							updates={updates}
							message="Follow your friends to see updates about them here!"
						/>
					</div>
				</div>

				{homeData.compositions.length +
					homeData.composers.length +
					homeData.lists.length >
					0 && (
					<Heading
						level={2}
						className={cn(
							"-mb-2",
							updates.length > 0
								? "xl:col-span-2"
								: "md:col-span-2 xl:col-span-3"
						)}
					>
						Popular
					</Heading>
				)}
				{homeData.compositions.length > 0 && (
					<GridCard title="Popular Compositions" forceSingle={true}>
						{homeData.compositions.map((c) => (
							<CompositionCard
								key={c.id}
								composition={c}
								user={user}
								saveButton={true}
							/>
						))}
					</GridCard>
				)}
				{homeData.composers.length > 0 && (
					<GridCard title="Popular Composers" forceSingle={true}>
						{homeData.composers.map((c) => (
							<ComposerCard key={c.id} composer={c} />
						))}
					</GridCard>
				)}
				{homeData.lists.length > 0 && (
					<GridCard title="Popular Lists" forceSingle={true}>
						{homeData.lists.map((l) => (
							<ListCard key={l.id} list={l} showUser={true} />
						))}
					</GridCard>
				)}
			</div>
		</>
	);
}

export const metadata: Metadata = {
	title: "Home",
};
