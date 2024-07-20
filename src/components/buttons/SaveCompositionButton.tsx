"use client";

import * as React from "react";

import { SaveCompositionAlertDialog } from "@/components/dialogs/SaveCompositionAlertDialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { saveComposition } from "@/lib/actions/composition";
import { Composition, List } from "@prisma/client";
import { CircleX, ListCheck, ListPlus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Icons } from "../Icons";

export function SaveCompositionButton({
	user,
	composition,
	button,
}: {
	user: {
		lists: (Pick<List, "id" | "name" | "icon"> & {
			compositions: { composition: Pick<Composition, "id"> }[];
		})[];
	};
	composition: Pick<Composition, "id" | "name">;
	button?: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();

	const [isLoading, setIsLoading] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const [dialogOpen, setDialogOpen] = React.useState(false);

	const [currentList, setCurrentList] =
		React.useState<Pick<List, "id" | "name">>();
	const [listsSavedIn, setListsSavedIn] = React.useState(
		user.lists
			.filter((l) =>
				l.compositions.find((c) => c.composition.id === composition.id)
			)
			.map((l) => l.id)
	);
	const saved = listsSavedIn.length > 0;

	async function save(list: Pick<List, "id" | "name">, save: boolean) {
		setIsLoading(true);
		const result = await saveComposition(composition.id, list.id, save);
		setIsLoading(false);

		if (!result.success)
			return toast(
				`Error ${save ? "saving" : "removing"} ${composition.name} ${
					save ? "to" : "from"
				} ${list.name}`,
				{
					description: result.error ?? "",
					icon: <CircleX className="mr-2 w-4 h-4 my-auto" />,
				}
			);

		if (save && result.listComposition)
			setListsSavedIn([...listsSavedIn, list.id]);
		else setListsSavedIn(listsSavedIn.filter((id) => id !== list.id));

		if (pathname === "/app/list/" + list.id) router.refresh();
	}

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<SaveCompositionAlertDialog
				list={currentList}
				open={dialogOpen}
				setOpen={setDialogOpen}
				saveFn={save}
				name={composition.name}
			/>

			<DropdownMenuTrigger asChild>
				{button ?? (
					<Button
						className="outline-none select-none cursor-pointer"
						variant={saved ? "secondary" : "default"}
					>
						{saved ? (
							<>
								<ListCheck className="mr-2 h-4 w-4" /> Saved
							</>
						) : (
							<>
								<ListPlus className="mr-2 h-4 w-4" /> Save
							</>
						)}
					</Button>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Add to list</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{user.lists.map((list) => {
					const Icon = Icons.listIcons[list.icon];
					const checked = listsSavedIn.includes(list.id);

					return (
						<DropdownMenuCheckboxItem
							className="cursor-pointer"
							key={list.id}
							checked={checked}
							onSelect={(event) => event.preventDefault()}
							disabled={isLoading}
							onCheckedChange={async () => {
								if (checked && listsSavedIn.length === 1) {
									setCurrentList(list);
									setDialogOpen(true);
								} else if (!saved) {
									await save(list, !checked);
									if (pathname === "/app/composition/" + composition.id)
										router.refresh();
								} else await save(list, !checked);
							}}
						>
							<Icon className="w-4 h-4 mr-2" />
							{list.name}
						</DropdownMenuCheckboxItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
