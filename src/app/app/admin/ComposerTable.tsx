"use client";

import { approveComposer, deleteComposer } from "@/actions/composer";
import { TextLink } from "@/components/TextLink";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	dataTableSelectColumn,
	error,
	readableUrl,
	success,
} from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
	ArrowDown01,
	ArrowDownAZ,
	ArrowUp01,
	ArrowUpAZ,
	ArrowUpDown,
	MoreHorizontal,
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { TableComposer } from "./UnapprovedComposerTable";

type TableMeta = {
	data: TableComposer[];
	setData: Dispatch<SetStateAction<TableComposer[]>>;
};

export const composerColumns: ColumnDef<TableComposer>[] = [
	dataTableSelectColumn<TableComposer>(),
	{
		accessorKey: "id",
		size: 100,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Id
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
		accessorKey: "name",
		size: 150.5,
		enableResizing: false,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Name
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
			<TextLink href={readableUrl("composer", row.original)} hidden={true}>
				{row.original.name}
			</TextLink>
		),
	},
	{
		id: "compositions",
		accessorKey: "_count.compositions",
		size: 180,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Compositions
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
		id: "saves",
		accessorKey: "_count.savedBy",
		size: 128,
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
		size: 64,
		enableResizing: false,
		cell: ({ row, table }) => {
			const composer = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={async () => {
								const result = await approveComposer(composer.id, false);
								if (!result.success)
									return error(
										`Error disapproving composer ${composer.name}`,
										result.error
									);
								success(`Disapproved composer ${composer.name}`);

								const meta = table.options.meta as TableMeta;
								meta.setData(meta.data.filter((a) => a.id !== composer.id));
							}}
						>
							Disapprove
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={async () => {
								const result = await deleteComposer(composer.id);
								if (!result.success)
									return error(
										`Error deleting composer ${composer.name}`,
										result.error
									);
								success(`Deleted composer ${composer.name}`);

								const meta = table.options.meta as TableMeta;
								meta.setData(meta.data.filter((a) => a.id !== composer.id));
							}}
							className="text-destructive"
						>
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
