import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function matchesWildcard(path: string, pattern: string): boolean {
	if (pattern.endsWith("/*")) {
		const basePattern = pattern.slice(0, -2);
		return path.startsWith(basePattern);
	}
	return path === pattern;
}

export function dataTableSelectColumn<T>(): ColumnDef<T> {
	return {
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="mr-4"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="mr-4"
			/>
		),
		enableSorting: false,
		enableHiding: false,

		enableResizing: false,
		size: 48,
	};
}
