"use client";

import { DataTable } from "@/components/DataTable";
import { TextLink } from "@/components/TextLink";
import { SaveCompositionButton } from "@/components/buttons/SaveCompositionButton";
import { Button } from "@/components/ui/button";
import { ComposerProfile } from "@/lib/database/Composer";
import { UserProfile } from "@/lib/database/User";
import { readableUrl } from "@/lib/utils";
import { Composition } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
	ArrowDown01,
	ArrowDownAZ,
	ArrowUp01,
	ArrowUpAZ,
	ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type ComposerComposition = Pick<Composition, "id" | "name"> & {
	_count: { users: number };
};
type TableMeta = {
	data: ComposerComposition[];
	setData: ReturnType<typeof useState<ComposerComposition[]>>[1];
};

export const composerCompositionTableColumns: (
	currentUserProfile: Parameters<typeof SaveCompositionButton>[0]["user"]
) => ColumnDef<ComposerComposition>[] = (currentUserProfile) => [
	{
		accessorKey: "position",
		size: 40,
		header: "#",
		cell: ({ row }) => row.index + 1,
	},
	{
		id: "name",
		accessorKey: "name",
		size: 150.5,
		enableResizing: false,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Title
					{column.getIsSorted() === "asc" ? (
						<ArrowDownAZ className="ml-2 h-4 w-4" />
					) : column.getIsSorted() === "desc" ? (
						<ArrowUpAZ className="ml-2 h-4 w-4" />
					) : (
						<ArrowUpDown className="ml-2 h-4 w-4" />
					)}
				</Button>
			);
		},
		cell: ({ row }) => (
			<TextLink href={readableUrl("composition", row.original)} hidden={true}>
				{row.original.name}
			</TextLink>
		),
	},
	{
		id: "saves",
		accessorKey: "_count.users",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Saves
					{column.getIsSorted() === "asc" ? (
						<ArrowDown01 className="ml-2 h-4 w-4" />
					) : column.getIsSorted() === "desc" ? (
						<ArrowUp01 className="ml-2 h-4 w-4" />
					) : (
						<ArrowUpDown className="ml-2 h-4 w-4" />
					)}
				</Button>
			);
		},
	},
	{
		id: "actions",
		size: 100,
		enableResizing: false,
		cell: ({ row }: { row: Row<ComposerComposition> }) => (
			<SaveCompositionButton
				composition={row.original}
				user={currentUserProfile}
			/>
		),
	},
];

export function ComposerCompositionTable({
	composer,
	currentUserProfile,
}: {
	composer: { compositions: ComposerProfile["compositions"] };
	currentUserProfile: UserProfile;
}) {
	return (
		<>
			{composer.compositions.length === 0 && (
				<p className="text-muted-foreground">
					This composer does not yet have any compositions.
				</p>
			)}
			<DataTable
				columns={composerCompositionTableColumns(currentUserProfile)}
				data={composer.compositions}
				searchColumn={composer.compositions.length !== 0 ? "name" : undefined}
				viewOptions={composer.compositions.length !== 0}
				enablePagination={false}
				initialSorting={[{ id: "saves", desc: true }]}
			/>
		</>
	);
}
