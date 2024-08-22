"use client";

import { ComposerCard } from "@/components/cards/ComposerCard";
import { CompositionCard } from "@/components/cards/CompositionCard";
import { ListCard } from "@/components/cards/ListCard";
import { UserCard } from "@/components/cards/UserCard";
import { ComposerDialog } from "@/components/dialogs/ComposerDialog";
import { CompositionDialog } from "@/components/dialogs/CompositionDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { emptySearchResults, SearchResults } from "../api/search/SearchResults";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TextLink } from "@/components/TextLink";

export function MainSearch({
	user,
	full,
}: {
	user: Parameters<typeof CompositionCard>[0]["user"];
	full?: boolean;
}) {
	const [focused, setFocused] = useState(false);
	const [search, setSearch] = useState("");
	const newSearch = useRef("");
	const [results, setResults] = useState<SearchResults>();

	const pathname = usePathname();
	useEffect(() => setFocused(false), [pathname]);

	const [addCompositionDialogOpen, setAddCompositionDialogOpen] =
		useState(false);
	const [addComposerDialogOpen, setAddComposerDialogOpen] = useState(false);

	const { compositions, composers, lists, users } =
		results ?? emptySearchResults;

	useEffect(() => {
		if (search === "") return;
		newSearch.current = search;

		setTimeout(() => {
			if (search !== newSearch.current) return;

			fetch(process.env.NEXT_PUBLIC_API_BASE + "/search?term=" + search).then(
				(res) => res.json().then((data) => setResults(data))
			);
		}, 200);
	}, [search]);

	const noCompositionOrComposerResults =
		compositions.length === 0 || composers.length === 0;
	const noResults =
		compositions.length + composers.length + lists.length + users.length === 0;

	return (
		<div
			className={cn(
				"hover:w-80 md:hover:w-[28rem] focus-within:w-80 md:focus-within:w-[28rem] overflow-x-hidden overflow-y-visible transition-all",
				search === "" ? "w-[6.2rem]" : "w-80 md:w-[28rem]",
				full ? "w-full hover:w-full focus-within:w-full" : ""
			)}
			onBlur={(event) => !event.relatedTarget && setFocused(false)}
			onFocus={() => setFocused(true)}
		>
			<div
				className={cn(
					"my-auto border w-full",
					search === "" || !focused ? "rounded-lg" : "rounded-t-lg"
				)}
			>
				<div className="flex items-center px-3">
					<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
					<input
						name="search"
						className="h-8 w-full py-3 text-sm outline-none placeholder:text-muted-foreground"
						placeholder="Search for compositions, composers, lists..."
						autoComplete="off"
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
						}}
					/>
				</div>

				<div
					className={cn(
						"absolute z-20 rounded-b-lg border w-80 md:w-[28rem] translate-x-[-1px] bg-background shadow-md",
						(search === "" || !focused) && "hidden",
						full && "w-[calc(23rem-1px)] max-w-[calc(100vw-2rem-1px)]"
					)}
				>
					<ScrollArea viewportClassName="max-h-[90vh]">
						{search !== "" && (
							<>
								<div
									className={cn(
										"text-center text-sm text-muted-foreground",
										noResults ? "my-10" : "my-2"
									)}
								>
									{noResults && <p>No results found.</p>}
									{!noResults && (
										<TextLink
											href={"/app/search/" + search}
											className="flex items-center w-fit mx-auto"
										>
											View full results
											<ArrowRight className="w-4 h-4 ml-1" />
										</TextLink>
									)}
									{noCompositionOrComposerResults && (
										<>
											{"Can't find a "}
											<CompositionDialog
												open={addCompositionDialogOpen}
												setOpen={setAddCompositionDialogOpen}
												trigger={
													<button className="underline underline-offset-4 hover:text-primary cursor-pointer">
														composition
													</button>
												}
											/>{" "}
											or{" "}
											<ComposerDialog
												open={addComposerDialogOpen}
												setOpen={setAddComposerDialogOpen}
												trigger={
													<button className="underline underline-offset-4 hover:text-primary cursor-pointer">
														composer
													</button>
												}
											/>
											?
										</>
									)}
								</div>
								{!noResults && <Separator />}
							</>
						)}

						{compositions.length > 0 && (
							<div className="p-2">
								<span className="text-sm text-muted-foreground font-medium">
									Compositions
								</span>
								<ul className="mt-2 flex flex-col gap-2">
									{compositions.map((composition) => (
										<CompositionCard
											key={composition.id}
											composition={composition}
											user={user}
											saveButton={true}
										/>
									))}
								</ul>
							</div>
						)}

						{composers.length > 0 && compositions.length > 0 && <Separator />}
						{composers.length > 0 && (
							<div className="p-2">
								<span className="text-sm text-muted-foreground font-medium">
									Composers
								</span>
								<ul className="mt-2 flex flex-col gap-2">
									{composers.map((composer) => {
										return (
											<ComposerCard key={composer.id} composer={composer} />
										);
									})}
								</ul>
							</div>
						)}

						{lists.length > 0 &&
							(composers.length > 0 || compositions.length > 0) && (
								<Separator />
							)}
						{lists.length > 0 && (
							<div className="p-2">
								<span className="text-sm text-muted-foreground font-medium">
									Lists
								</span>
								<ul className="mt-2 flex flex-col gap-2">
									{lists.map((list) => (
										<ListCard key={list.id} list={list} />
									))}
								</ul>
							</div>
						)}

						{users.length > 0 &&
							(composers.length > 0 ||
								compositions.length > 0 ||
								lists.length > 0) && <Separator />}
						{users.length > 0 && (
							<div className="p-2">
								<span className="text-sm text-muted-foreground font-medium">
									Users
								</span>
								<ul className="mt-2 flex flex-col gap-2">
									{users.map((user) => (
										<UserCard key={user.username} user={user} />
									))}
								</ul>
							</div>
						)}
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
