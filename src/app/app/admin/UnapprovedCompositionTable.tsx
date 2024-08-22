"use client";

import { approveComposition, approveCompositions } from "@/actions/composition";
import { Button } from "@/components/ui/button";
import { dataTableSelectColumn, error, success } from "@/lib/utils";
import { Composer, Composition } from "@prisma/client";
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
import { useState } from "react";

export type TableComposition = Pick<Composition, "id" | "name" | "approved"> & {
	composers: Pick<Composer, "name">[];
	_count: {
		lists: number;
		users: number;
	};
};

async function approve(
	table: Table<TableComposition>,
	composition: TableComposition,
	approved: boolean
) {
	const result = await approveComposition(composition.id, approved);
	if (!result.success)
		return error(
			`Error ${approved ? "" : "dis"}approving composition ${composition.name}`,
			result.error
		);
	success(
		`${approved ? "A" : "Disa"}pproved composition ${composition.name}`,
		undefined,
		{
			action: {
				label: "Undo",
				onClick: () => approveComposition(composition.id, null),
			},
		}
	);

	if (table.options.meta) {
		const meta = table.options.meta as {
			data: TableComposition[];
			setData: ReturnType<typeof useState<TableComposition[]>>[1];
		};
		meta.setData(meta.data.filter((r) => r.id !== composition.id));
	}
}

async function approveMany(
	table: Table<TableComposition>,
	compositions: TableComposition[],
	approved: boolean
) {
	const compositionIds = compositions.map((a) => a.id);

	const result = await approveCompositions(compositionIds, approved);
	if (!result.success)
		return error(
			`Error ${approved ? "" : "dis"}approving ${
				compositions.length
			} compositions`,
			result.error
		);
	success(
		`${approved ? "A" : "Disa"}pproved ${compositions.length} compositions`,
		undefined,
		{
			action: {
				label: "Undo",
				onClick: () => approveCompositions(compositionIds, null),
			},
		}
	);

	if (table.options.meta) {
		const meta = table.options.meta as {
			data: TableComposition[];
			setData: ReturnType<typeof useState<TableComposition[]>>[1];
		};
		meta.setData(meta.data.filter((r) => !compositionIds.includes(r.id)));
		table.setRowSelection({});
	}
}

export const unapprovedCompositionColumns: ColumnDef<TableComposition>[] = [
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
	},
	{
		accessorKey: "composers",
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
		id: "actions",
		size: 140,
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

export const unapprovedCompositionBulkActions = [
	{
		icon: Check,
		name: "Approve",
		callback: async (
			table: Table<TableComposition>,
			compositions: TableComposition[]
		) => approveMany(table, compositions, true),
	},
	{
		icon: X,
		name: "Disapprove",
		callback: async (
			table: Table<TableComposition>,
			compositions: TableComposition[]
		) => approveMany(table, compositions, false),
	},
];
