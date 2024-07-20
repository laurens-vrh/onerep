"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	approveComposition,
	deleteComposition,
} from "@/lib/actions/composition";
import { dataTableSelectColumn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
	ArrowDown01,
	ArrowDownAZ,
	ArrowUp01,
	ArrowUpAZ,
	ArrowUpDown,
	CircleCheck,
	CircleX,
	MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { TableComposition } from "./UnapprovedCompositionTable";

export const compositionColumns: ColumnDef<TableComposition>[] = [
	dataTableSelectColumn<TableComposition>(),
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
			<Link prefetch={false} href={`/app/composition/${row.original.id}`}>
				{row.original.name}
			</Link>
		),
	},
	{
		accessorKey: "composers",
		size: 300,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Composers
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
		cell: ({ row }) => row.original.composers.map((a) => a.name).join(", "),
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
		id: "lists",
		accessorKey: "_count.lists",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Lists
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
		cell: ({ row, table }) => {
			const composition = row.original;

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
								const result = await approveComposition(composition.id, false);
								if (!result.success)
									return toast(
										`Error disapproving composition ${composition.name}`,
										{
											description: result.error ?? "",
											icon: <CircleX className="mr-2 w-4 h-4 my-auto" />,
										}
									);
								toast(`Disapproved composition ${composition.name}`, {
									icon: <CircleCheck className="mr-2 w-4 h-4 my-auto" />,
								});

								if (table.options.meta) {
									const meta = table.options.meta as {
										data: TableComposition[];
										setData: ReturnType<typeof useState<TableComposition[]>>[1];
									};
									meta.setData(
										meta.data.filter((c) => c.id !== composition.id)
									);
								}
							}}
						>
							Disapprove
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={async () => {
								const result = await deleteComposition(composition.id);
								if (!result.success)
									return toast(
										`Error deleting composition ${composition.name}`,
										{
											description: result.error ?? "",
											icon: <CircleX className="mr-2 w-4 h-4 my-auto" />,
										}
									);
								toast(`Deleted composition ${composition.name}`, {
									icon: <CircleCheck className="mr-2 w-4 h-4 my-auto" />,
								});

								if (table.options.meta) {
									const meta = table.options.meta as {
										data: TableComposition[];
										setData: ReturnType<typeof useState<TableComposition[]>>[1];
									};
									meta.setData(
										meta.data.filter((c) => c.id !== composition.id)
									);
								}
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