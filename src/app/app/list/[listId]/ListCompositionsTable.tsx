"use client";

import { SaveCompositionButton } from "@/components/buttons/SaveCompositionButton";
import { DataTable } from "@/components/DataTable";
import { DateDisplay } from "@/components/DateDisplay";
import { SaveCompositionAlertDialog } from "@/components/dialogs/SaveCompositionAlertDialog";
import { DatePicker } from "@/components/inputs/DatePicker";
import { TextLink } from "@/components/TextLink";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	saveComposition,
	updatePosition,
	updateUserCompositionData,
} from "@/actions/composition";
import { ListProfile } from "@/database/List";
import { UserProfile } from "@/database/User";
import { ArrayElement } from "@/lib/types/utilities";
import { dataTableSelectColumn, readableUrl } from "@/lib/utils";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { format } from "date-fns";
import {
	ArrowDown,
	ArrowDownAZ,
	ArrowUp,
	ArrowUpAZ,
	ArrowUpDown,
	CalendarArrowDown,
	CalendarArrowUp,
	CircleCheck,
	CircleX,
	ListPlus,
	MoreHorizontal,
	X,
} from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

type TableComposition = ArrayElement<ListProfile["compositions"]>;
type TableMeta = {
	data: TableComposition[];
	setData: ReturnType<typeof useState<TableComposition[]>>[1];
};

export const listCompositionTableColumns: (
	showActions: boolean,
	list: ListProfile,
	[dialogOpen, setDialogOpen]: [boolean, Dispatch<SetStateAction<boolean>>],
	[currentCompositionId, setCurrentCompositionId]: [
		number | undefined,
		Dispatch<SetStateAction<number | undefined>>
	],
	currentUserProfile: UserProfile
) => ColumnDef<TableComposition>[] = (
	showActions,
	list,
	[dialogOpen, setDialogOpen],
	[currentCompositionId, setCurrentCompositionId],
	currentUserProfile
) => [
	...(showActions ? [dataTableSelectColumn<TableComposition>()] : []),
	{
		accessorKey: "position",
		size: 40,

		header: ({ column }) => {
			return (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					#
					{column.getIsSorted() === "asc" ? (
						<ArrowDown className="ml-1 h-4 w-4" />
					) : column.getIsSorted() === "desc" ? (
						<ArrowUp className="ml-1 h-4 w-4" />
					) : (
						<ArrowUpDown className="ml-1 h-4 w-4" />
					)}
				</Button>
			);
		},
		cell: ({ row, table }) => {
			return (
				<div className="flex items-center gap-1">
					{showActions && (
						<div className="flex flex-col justify-center text-muted-foreground">
							<Button
								variant="ghost"
								className="p-0 h-4"
								onClick={async () => {
									if (row.original.position === 1) return;
									const meta = table.options.meta as TableMeta;
									const newCompositions =
										(
											await updatePosition(
												row.original.composition.id,
												row.original.listId,
												row.original.position,
												-1
											)
										).list?.compositions ?? meta.data;
									meta.setData(newCompositions);
								}}
							>
								<ArrowUp className="w-4 h-4" />
							</Button>
							<Button
								variant="ghost"
								className="p-0 h-4"
								onClick={async () => {
									const meta = table.options.meta as TableMeta;
									if (row.original.position === meta.data.length) return;
									const newCompositions =
										(
											await updatePosition(
												row.original.composition.id,
												row.original.listId,
												row.original.position,
												+1
											)
										).list?.compositions ?? meta.data;
									meta.setData(newCompositions);
								}}
							>
								<ArrowDown className="w-4 h-4" />
							</Button>
						</div>
					)}
					{row.original.position}
				</div>
			);
		},
	},
	{
		id: "name",
		accessorKey: "composition.name",
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
			<>
				<TextLink
					href={readableUrl("composition", row.original.composition)}
					className="font-semibold"
					hidden={true}
				>
					{row.original.composition.name}
				</TextLink>
				<p className="text-sm">
					By{" "}
					{row.original.composition.composers.map((composer, i) => (
						<TextLink
							key={composer.id}
							href={readableUrl("composer", composer)}
							hidden={true}
							className="relative z-10"
						>
							{composer.name}
							{i + 1 === row.original.composition.composers.length ? "" : ", "}
						</TextLink>
					))}
				</p>
			</>
		),
	},
	{
		id: "finished",
		accessorFn: (row) => row.composition.users[0].endDate,
		sortingFn: "datetime",
		sortDescFirst: true,

		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Finished
					{column.getIsSorted() === "asc" ? (
						<CalendarArrowUp className="ml-2 h-4 w-4" />
					) : column.getIsSorted() === "desc" ? (
						<CalendarArrowDown className="ml-2 h-4 w-4" />
					) : (
						<ArrowUpDown className="ml-2 h-4 w-4" />
					)}
				</Button>
			);
		},
		cell: ({ row, table }) =>
			showActions ? (
				<DatePicker
					date={row.original.composition.users[0].endDate}
					onChange={(date) => {
						updateUserCompositionData(row.original.composition.id, {
							endDate: date ?? null,
						});

						const meta = table.options.meta as TableMeta;
						const rowIndex = meta.data.findIndex(
							(c) => c.composition.id === row.original.composition.id
						);
						const data = [...meta.data];
						data[rowIndex].composition.users[0].endDate = date ?? null;
						meta.setData(data);

						// 	meta.data.find(
						// 	(r) => r.composition.id === row.original.composition.id
						// )!;
						// oldRow.composition.users = [
						// 	{ ...row.original.composition.users[0], endDate: date ?? null },
						// ];
						// meta.setData([
						// 	...meta.data.filter(
						// 		(r) => r.composition.id !== row.original.composition.id
						// 	),
						// 	oldRow,
						// ]);
					}}
				/>
			) : row.original.composition.users[0].endDate ? (
				format(row.original.composition.users[0].endDate, "PPP")
			) : (
				""
			),
	},
	{
		id: "updated",
		accessorFn: (row) => row.composition.users[0].updatedAt,
		sortingFn: "datetime",
		sortDescFirst: true,

		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Updated
					{column.getIsSorted() === "asc" ? (
						<CalendarArrowUp className="ml-2 h-4 w-4" />
					) : column.getIsSorted() === "desc" ? (
						<CalendarArrowDown className="ml-2 h-4 w-4" />
					) : (
						<ArrowUpDown className="ml-2 h-4 w-4" />
					)}
				</Button>
			);
		},
		cell: ({ row }) => <DateDisplay date={row.original.createdAt} />,
	},
	{
		id: "added",
		accessorFn: (row) => row.createdAt,
		sortingFn: "datetime",
		sortDescFirst: true,

		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Added
					{column.getIsSorted() === "asc" ? (
						<CalendarArrowUp className="ml-2 h-4 w-4" />
					) : column.getIsSorted() === "desc" ? (
						<CalendarArrowDown className="ml-2 h-4 w-4" />
					) : (
						<ArrowUpDown className="ml-2 h-4 w-4" />
					)}
				</Button>
			);
		},
		cell: ({ row }) => <DateDisplay date={row.original.createdAt} />,
	},
	...(showActions
		? [
				{
					id: "actions",
					size: 64,
					enableResizing: false,
					header: ({ table }: { table: Table<TableComposition> }) => {
						return (
							<SaveCompositionAlertDialog
								list={list.id}
								open={dialogOpen}
								setOpen={setDialogOpen}
								saveFn={(l: number, save: boolean) =>
									saveFn(currentCompositionId!, l, save, table)
								}
							/>
						);
					},
					cell: ({
						row,
						table,
					}: {
						row: Row<TableComposition>;
						table: Table<TableComposition>;
					}) => {
						const savedIn = list.user.lists.filter((l) =>
							l.compositions.find(
								(c) => c.compositionId === row.original.composition.id
							)
						);

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
										className="cursor-pointer flex gap-2 items-center"
										onClick={async () => {
											setCurrentCompositionId(row.original.composition.id);
											if (savedIn.length === 1) return setDialogOpen(true);
											saveFn(
												row.original.composition.id,
												list.id,
												false,
												table
											);
										}}
									>
										<X className="w-4 h-4" />
										Remove
									</DropdownMenuItem>
									<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
										<SaveCompositionButton
											composition={row.original.composition}
											user={currentUserProfile}
											button={
												<div className="cursor-pointer flex gap-2 items-center w-full">
													<ListPlus className="w-4 h-4" /> Save
												</div>
											}
										/>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						);
					},
				},
		  ]
		: [
				{
					id: "actions",
					size: 100,
					enableResizing: false,
					cell: ({ row }: { row: Row<TableComposition> }) => (
						<SaveCompositionButton
							composition={row.original.composition}
							user={currentUserProfile}
						/>
					),
				},
		  ]),
];

async function saveFn(
	compositionId: number,
	listId: number,
	save: boolean,
	table: Table<TableComposition>
) {
	const result = await saveComposition(compositionId, listId, save);

	if (!result.success)
		return toast(`Error ${save ? "saving" : "removing"} composition`, {
			description: result.error ?? "",
			icon: <CircleX className="mr-2 w-4 h-4 my-auto" />,
		});

	const meta = table.options.meta as TableMeta;
	const position = meta.data.find(
		(c) => c.composition.id === compositionId
	)!.position;
	meta.setData(
		meta.data
			.filter((c) => c.composition.id !== compositionId)
			.map((c) => {
				if (c.position > position) c.position -= 1;
				return c;
			})
	);
}

export const listCompositionsTableBulkActions = (
	listId: Parameters<typeof saveFn>[1]
) => [
	{
		icon: X,
		name: "Remove",
		callback: async (
			table: Table<TableComposition>,
			compositions: TableComposition[]
		) => {
			compositions.forEach((c) =>
				saveFn(c.composition.id, listId, false, table)
			);
			table.setRowSelection({});
		},
	},
];

export function ListCompositionsTable({
	list,
	showActions,
	currentUserProfile,
}: {
	list: ListProfile;
	showActions: boolean;
	currentUserProfile: UserProfile;
}) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [currentCompositionId, setCurrentCompositionId] = useState<number>();

	return (
		<>
			{list.compositions.length === 0 && showActions && (
				<p className="text-muted-foreground">
					Add compositions to this list by using the search bar
				</p>
			)}
			<DataTable
				columns={listCompositionTableColumns(
					showActions,
					list,
					[dialogOpen, setDialogOpen],
					[currentCompositionId, setCurrentCompositionId],
					currentUserProfile
				)}
				data={list.compositions}
				searchColumn={
					showActions && list.compositions.length !== 0 ? "name" : undefined
				}
				bulkActions={listCompositionsTableBulkActions(list.id)}
				viewOptions={showActions && list.compositions.length !== 0}
				enablePagination={false}
				initialSorting={[{ desc: false, id: "position" }]}
				initialVisibility={{ updated: false }}
			/>
		</>
	);
}
