"use client";

import { ListForm } from "@/components/inputs/ListForm";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { updateList } from "@/lib/actions/list";
import { ListFormSchemaData, listFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { List } from "@prisma/client";
import { CircleCheck, CircleX, Pencil } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function EditListButton({
	list,
	button,
}: {
	list: Pick<List, "id" | "name" | "description" | "icon">;
	button?: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();

	const [open, setOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);

	const form = useForm<ListFormSchemaData>({
		resolver: zodResolver(listFormSchema),
		defaultValues: {
			name: list.name,
			description: list.description ?? "",
			icon: list.icon,
		},
	});

	async function onSubmit(values: ListFormSchemaData) {
		setIsLoading(true);
		const result = await updateList(list.id, values);
		setIsLoading(false);
		setOpen(false);

		if (!result.success)
			return toast(`Error updating list ${values.name}`, {
				description: result.error ?? "",
				icon: <CircleX className="mr-2 w-4 h-4 my-auto" />,
			});

		toast(`List ${values.name} updated`, {
			icon: <CircleCheck className="mr-2 w-4 h-4 my-auto" />,
		});
		router.refresh();
	}

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Edit List</DialogTitle>
					</DialogHeader>

					<ListForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
				</DialogContent>
			</Dialog>

			<div
				onClick={(e) => {
					e.preventDefault();
					setOpen(true);
				}}
				aria-label="Edit list"
				role="button"
				className="select-none cursor-pointer"
			>
				{button ?? (
					<Button className="outline-none w-full" variant="default">
						<Pencil className="mr-2 h-4 w-4" /> Edit
					</Button>
				)}
			</div>
		</>
	);
}
