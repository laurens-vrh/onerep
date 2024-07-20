"use client";

import {
	emptySearchResults,
	SearchResults as SearchResultsType,
} from "@/app/api/search/SearchResults";
import { ComposerCard } from "@/components/cards/ComposerCard";
import { CompositionCard } from "@/components/cards/CompositionCard";
import { ListCard } from "@/components/cards/ListCard";
import { UserCard } from "@/components/cards/UserCard";
import { AddComposerDialog } from "@/components/dialogs/AddComposerDialog";
import { AddCompositionDialog } from "@/components/dialogs/AddCompositionDialog";
import { Heading } from "@/components/Heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";

export function SearchResults({
	term,
	user,
}: {
	term: string;
	user: Parameters<typeof CompositionCard>[0]["user"];
}) {
	const [results, setResults] = useState<SearchResultsType>(emptySearchResults);

	useEffect(() => {
		fetch(
			process.env.NEXT_PUBLIC_API_BASE + "/search?full=true&term=" + term
		).then((res) => res.json().then((data) => setResults(data)));
	}, [term]);

	const noCompositionOrComposerResults =
		results.compositions.length === 0 || results.composers.length === 0;

	return (
		<div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
			{noCompositionOrComposerResults && (
				<p className="col-span-2">
					{"Can't find a "}
					<AddCompositionDialog
						trigger={
							<button className="underline cursor-pointer">composition</button>
						}
					/>{" "}
					or{" "}
					<AddComposerDialog
						trigger={
							<button className="underline cursor-pointer">composer</button>
						}
					/>
					?
				</p>
			)}

			{results.compositions.length > 0 && (
				<Card>
					<CardHeader className="pb-2">
						<Heading level={3}>Compositions</Heading>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-2">
						{results.compositions.map((composition) => (
							<CompositionCard
								key={composition.id}
								composition={composition}
								user={user}
								saveButton={true}
							/>
						))}
					</CardContent>
				</Card>
			)}
			{results.composers.length > 0 && (
				<Card>
					<CardHeader className="pb-2">
						<Heading level={3}>Composers</Heading>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-2">
						{results.composers.map((composer) => (
							<ComposerCard key={composer.id} composer={composer} />
						))}
					</CardContent>
				</Card>
			)}
			{results.lists.length > 0 && (
				<Card>
					<CardHeader className="pb-2">
						<Heading level={3}>Lists</Heading>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-2">
						{results.lists.map((list) => (
							<ListCard key={list.id} list={list} showUser={true} />
						))}
					</CardContent>
				</Card>
			)}
			{results.users.length > 0 && (
				<Card>
					<CardHeader className="pb-2">
						<Heading level={3}>Users</Heading>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-2">
						{results.users.map((u) => (
							<UserCard key={u.id} user={u} />
						))}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
