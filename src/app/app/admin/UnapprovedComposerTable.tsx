"use client";

import { approveComposer, approveComposers } from "@/actions/composer";
import { Button } from "@/components/ui/button";
import { dataTableSelectColumn, error, success } from "@/lib/utils";
import { Composer } from "@prisma/client";
import { ColumnDef, Table } from "@tanstack/react-table";
import {
	ArrowDown01,
	ArrowDownAZ,
	ArrowUp01,
	ArrowUpAZ,
	ArrowUpDown,
	Check,
	X,
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

export type TableComposer = Pick<Composer, "id" | "name" | "approved"> & {
	_count: { compositions: number; savedBy: number };
};
type TableMeta = {
	data: TableComposer[];
	setData: Dispatch<SetStateAction<TableComposer[]>>;
};

async function approve(
	table: Table<TableComposer>,
	composer: TableComposer,
	approved: boolean
) {
	const result = await approveComposer(composer.id, approved);
	if (!result.success)
		return error(
			`Error ${approved ? "" : "dis"}approving composer ${composer.name}`,
			result.error
		);
	success(
		`${approved ? "A" : "Disa"}pproved composer ${composer.name}`,
		undefined,
		{
			action: {
				label: "Undo",
				onClick: () => approveComposer(composer.id, null),
			},
		}
	);

	if (table.options.meta) {
		const meta = table.options.meta as TableMeta;
		meta.setData(meta.data.filter((r) => r.id !== composer.id));
	}
}

async function approveMany(
	table: Table<TableComposer>,
	composers: TableComposer[],
	approved: boolean
) {
	const composerIds = composers.map((a) => a.id);

	const result = await approveComposers(composerIds, approved);
	if (!result.success)
		return error(
			`Error ${approved ? "" : "dis"}approving ${composers.length} composers`,
			result.error
		);
	success(
		`${approved ? "A" : "Disa"}pproved ${composers.length} composers`,
		undefined,
		{
			action: {
				label: "Undo",
				onClick: () => approveComposers(composerIds, null),
			},
		}
	);

	if (table.options.meta) {
		const meta = table.options.meta as {
			data: Composer[];
			setData: ReturnType<typeof useState<Composer[]>>[1];
		};
		meta.setData(meta.data.filter((r) => !composerIds.includes(r.id)));
		table.setRowSelection({});
	}
}

export const unapprovedComposerColumns: ColumnDef<TableComposer>[] = [
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
	},
	{
		id: "compositions",
		accessorKey: "_count.compositions",
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
		id: "actions",
		size: 120,
		enableResizing: false,
		cell: ({ row, table }) => {
			const composer = row.original;

			return (
				<div className="flex justify-center items-center gap-2">
					<Button
						variant="secondary"
						onClick={async () => approve(table, composer, true)}
						className="aspect-square p-3"
					>
						<Check />
					</Button>

					<Button
						variant="secondary"
						onClick={() => approve(table, composer, false)}
						className="aspect-square p-3"
					>
						<X />
					</Button>
				</div>
			);
		},
	},
];

export const unapprovedComposerBulkActions = [
	{
		icon: Check,
		name: "Approve",
		callback: async (table: Table<TableComposer>, composers: TableComposer[]) =>
			approveMany(table, composers, true),
	},
	{
		icon: X,
		name: "Disapprove",
		callback: async (table: Table<TableComposer>, composers: TableComposer[]) =>
			approveMany(table, composers, false),
	},
];
