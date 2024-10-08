import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import { CircleCheckIcon, CircleXIcon } from "lucide-react";
import { ExternalToast, toast } from "sonner";
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

export function capitalizeFirst(string: string) {
	return string[0].toUpperCase() + string.slice(1);
}

export const readableUrl = (
	type: "list" | "composer" | "composition",
	{ id, name }: { id: number; name: string }
) =>
	`/app/${type}/${id}-${encodeURIComponent(
		name.toLowerCase().replace(/\s/g, "-")
	)}`;

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

export function error(
	title: string,
	description?: string,
	data?: ExternalToast
) {
	toast(title, {
		description: description ?? "",
		icon: <CircleXIcon className="mr-2 w-4 h-4 my-auto" />,
		...data,
	});
}

export function success(
	title: string,
	description?: string,
	data?: ExternalToast
) {
	toast(title, {
		description: description ?? "",
		icon: <CircleCheckIcon className="mr-2 w-4 h-4 my-auto" />,
		...data,
	});
}
