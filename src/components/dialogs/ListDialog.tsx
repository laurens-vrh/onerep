"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { error, success } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ListForm } from "../inputs/ListForm";
import { ListFormData, listFormSchema } from "@/lib/schemas";
import { List } from "@prisma/client";
import { UserProfile } from "@/database/User";
import { updateList } from "@/actions/list";

export function ListDialog({
	trigger,
	open: openProp,
	setOpen: setOpenProp,
	list,
	edit,
	user,
}: {
	trigger?: React.ReactNode;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;

	list: Pick<List, "id" | "name" | "description" | "icon" | "custom">;
	edit?: boolean;
	user?: UserProfile;
}) {
	const [stateOpen, setStateOpen] = useState(false);
	const [open, setOpen] =
		openProp && setOpenProp
			? [openProp, setOpenProp]
			: [stateOpen, setStateOpen];

	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<ListFormData>({
		resolver: zodResolver(listFormSchema),
		defaultValues: {
			name: list.name,
			description: list.description ?? "",
			icon: list.icon,
		},
	});

	async function onSubmit(values: ListFormData) {
		setIsLoading(true);
		const result = await updateList(list.id, values);
		setIsLoading(false);
		setOpen(false);

		if (!result.success)
			return error(`Error updating list ${values.name}`, result.error);
		success(`List ${values.name} updated`);
		router.refresh();
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{edit ? "Edit List" : " Create List"}</DialogTitle>
				</DialogHeader>

				<ListForm
					form={form}
					onSubmit={onSubmit}
					isLoading={isLoading}
					edit={edit}
					list={list}
					user={user}
				/>
			</DialogContent>
		</Dialog>
	);
}
