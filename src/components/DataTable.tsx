"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type {
	ColumnSizingState,
	ColumnSort,
	Table as TableType,
} from "@tanstack/react-table";
import { LucideProps } from "lucide-react";
import React, { useState } from "react";
import { DataTableColumnDivider } from "./DataTableColumnDivider";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export function DataTable<TData, TValue>({
	columns,
	data: inputData,
	searchColumn,
	bulkActions,
	viewOptions = true,
	enablePagination = true,
	initialSorting = [],
	initialVisibility = {},
}: {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchColumn?: string;
	bulkActions?: {
		icon: React.ForwardRefExoticComponent<
			Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
		>;
		name: string;
		callback: (table: TableType<TData>, selection: TData[]) => void;
	}[];
	viewOptions?: boolean;
	enablePagination?: boolean;
	initialSorting?: ColumnSort[];
	initialVisibility?: VisibilityState;
}) {
	const [data, setData] = useState(inputData);
	const [sorting, setSorting] = useState<SortingState>(initialSorting);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		useState<VisibilityState>(initialVisibility);
	const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
	const [rowSelection, setRowSelection] = useState({});

	const table = useReactTable({
		data,
		columns,

		enableColumnResizing: true,
		columnResizeMode: "onChange",
		onColumnSizingChange: setColumnSizing,

		getCoreRowModel: getCoreRowModel(),
		...(enablePagination
			? { getPaginationRowModel: getPaginationRowModel() }
			: {}),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,

		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			columnSizing,
		},
		meta: {
			data,
			setData,
		},
	});

	const selectedRows = Object.entries(rowSelection)
		.filter((e) => e[1])
		.map((e) => parseInt(e[0]));

	const headerSizes: Record<string, number | "auto"> = {};

	return (
		<div className="max-w-full">
			<div className="flex items-center py-2">
				{searchColumn && (
					<Input
						placeholder="Search..."
						value={
							(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table.getColumn(searchColumn)?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
				)}

				{bulkActions &&
					selectedRows.length > 0 &&
					bulkActions.map((action) => (
						<Button
							key={action.name}
							className="ml-2"
							onClick={() =>
								action.callback(
									table,
									selectedRows.map((r) => data[r])
								)
							}
						>
							<action.icon className="h-4 w-4 mr-2" />
							{action.name}
						</Button>
					))}

				{viewOptions && <DataTableViewOptions table={table} />}
			</div>

			<ScrollArea className="rounded-md border mb-2 [&_.overflow-auto:has(table)]:overflow-hidden">
				<Table style={{ width: `max(${table.getTotalSize()}, 100%)` }}>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header, index) => {
									headerSizes[header.id] =
										header.getSize() === 150.5 ? "auto" : header.getSize();
									return (
										<TableHead
											key={header.id}
											className="relative"
											style={{ width: headerSizes[header.column.id] }}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}

											<DataTableColumnDivider header={header} />
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											style={{
												width: headerSizes[cell.column.id],
												minWidth: cell.column.columnDef.minSize,
											}}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				<ScrollBar orientation="horizontal" />
			</ScrollArea>
			{enablePagination && <DataTablePagination table={table} />}
		</div>
	);
}
