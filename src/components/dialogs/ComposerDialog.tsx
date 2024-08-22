"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { addComposer, updateComposer } from "@/lib/actions/composer";
import { readableUrl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ComposerForm } from "../inputs/ComposerForm";
import { ComposerFormData, composerFormSchema } from "@/lib/schemas";
import { Composer } from "@prisma/client";

export function ComposerDialog({
	trigger,
	open: openProp,
	setOpen: setOpenProp,
	edit,
	composer,
}: {
	trigger?: React.ReactNode;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	composer?: Pick<Composer, "id" | "name">;
	edit?: boolean;
}) {
	const [stateOpen, setStateOpen] = useState(false);
	const [open, setOpen] =
		openProp && setOpenProp
			? [openProp, setOpenProp]
			: [stateOpen, setStateOpen];

	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<ComposerFormData>({
		resolver: zodResolver(composerFormSchema),
		defaultValues: { name: "", ...composer },
	});

	async function onSubmit(values: ComposerFormData) {
		if (edit && composer!) {
			const result = await updateComposer(composer.id, values);
			setIsLoading(false);

			if (result.success) {
				setOpen(false);
				router.refresh();
			} else if (result.error)
				return toast("Error updating composer", {
					description: result.error,
					icon: <CircleX className="mr-2 w-4 h-4 my-auto" />,
				});
		} else {
			const result = await addComposer(values);
			setIsLoading(false);

			if (result.success) {
				setOpen(false);
				form.reset();
				toast(`Thank you for adding ${values.name}`, {
					description: "They will be visible to everyone after verification.",
					icon: <CircleCheck className="mr-2 w-4 h-4 my-auto" />,
				});
				router.push(readableUrl("composer", result.composer));
			} else if (result.error) form.setError(...result.error);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

			<DialogContent className="sm:max-w-[425px]">
				{edit ? (
					<DialogHeader>
						<DialogTitle>Edit Composer</DialogTitle>
					</DialogHeader>
				) : (
					<DialogHeader>
						<DialogTitle>Add Composer</DialogTitle>
						<DialogDescription>
							Add a new composer to the OneRep Library. Please confirm this
							composer does not yet exist first. They will need to be verified
							before they are visible to others in search results.
						</DialogDescription>
					</DialogHeader>
				)}

				<ComposerForm
					form={form}
					isLoading={isLoading}
					onSubmit={onSubmit}
					edit={edit}
				/>
			</DialogContent>
		</Dialog>
	);
}
