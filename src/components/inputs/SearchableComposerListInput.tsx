"use client";

import { cn } from "@/lib/utils";
import { Composer } from "@prisma/client";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Icons } from "../Icons";
import { ComposerDialog } from "../dialogs/ComposerDialog";

export function SearchableComposerListInput({
	onChange,
	initialComposers,
}: {
	onChange: (selection: Pick<Composer, "id" | "name">[]) => void;
	initialComposers?: Pick<Composer, "id" | "name">[];
}) {
	const [selection, setSelection] = useState<Pick<Composer, "id" | "name">[]>(
		initialComposers ?? []
	);

	const [search, setSearch] = useState("");
	const newSearch = useRef("");
	const [results, setResults] = useState<Pick<Composer, "id" | "name">[]>([]);

	useEffect(() => {
		if (search === "") return;
		newSearch.current = search;

		setTimeout(() => {
			if (search !== newSearch.current) return;

			fetch(
				process.env.NEXT_PUBLIC_API_BASE + "/search-composers?term=" + search
			).then((res) =>
				res.json().then((data) => {
					setResults(data);
				})
			);
		}, 200);
	}, [search]);

	return (
		<div>
			<ul>
				{selection.map((a) => (
					<li
						className="px-2 py-1.5 mb-2 rounded-lg border flex justify-between items-center text-sm"
						key={a.id}
					>
						<div className="flex items-center">
							<Icons.composer className="mr-2 h-4 w-4" />
							<span>{a.name}</span>
						</div>
						<X
							className="w-4 h-4 cursor-pointer"
							onClick={() => {
								const newSelection = selection.filter((s) => s.id !== a.id);
								setSelection(newSelection);
								onChange(newSelection);
							}}
						/>
					</li>
				))}
			</ul>

			<div className="rounded-lg border">
				<div className="flex items-center px-3">
					<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
					<input
						className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground border-none"
						id=":r4:-form-item"
						placeholder="Search for composers..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
						}}
					/>
				</div>

				{search !== "" && (
					<div
						className={cn(
							"text-center text-sm text-muted-foreground border-t",
							results.length > 0 ? "py-2" : "py-4"
						)}
					>
						{results.length === 0 && <p>No results found.</p>}
						<p>
							{"Can't find a "}
							<ComposerDialog
								trigger={
									<button className="underline underline-offset-4 hover:text-primary cursor-pointer">
										composer
									</button>
								}
								redirect={false}
							/>
							?
						</p>
					</div>
				)}

				<ul
					className={cn(
						results.length > 0 && "border-t",
						search === "" && "hidden"
					)}
				>
					{results.map((result, i) => (
						<li
							className="flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 m-1 text-sm outline-none hover:bg-accent focus:bg-accent"
							key={result.id}
							onClick={() => {
								if (selection.find((a) => a.id === result.id)) return;
								const newSelection = [...selection, result];
								setSelection(newSelection);
								onChange(newSelection);
							}}
							tabIndex={i}
						>
							<Icons.composer className="mr-2 h-4 w-4" />
							<span>{result.name}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
