"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { addComposition, updateComposition } from "@/lib/actions/composition";
import { CompositionFormData, compositionFormSchema } from "@/lib/schemas";
import { readableUrl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Composer, Composition } from "@prisma/client";
import { CircleCheck, CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CompositionForm } from "../inputs/CompositionForm";

export function CompositionDialog({
	trigger,
	open: openProp,
	setOpen: setOpenProp,
	composition,
	composers,
	edit,
}: {
	trigger?: React.ReactNode;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	composition?: Pick<Composition, "id" | "name">;
	composers?: Pick<Composer, "id" | "name">[];
	edit?: boolean;
}) {
	const [stateOpen, setStateOpen] = useState(false);
	const [open, setOpen] =
		openProp && setOpenProp
			? [openProp, setOpenProp]
			: [stateOpen, setStateOpen];

	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<CompositionFormData>({
		resolver: zodResolver(compositionFormSchema),
		defaultValues: {
			name: composition?.name ?? "",
			composers: composers?.map((a) => a.id) ?? [],
		},
	});

	async function onSubmit(values: CompositionFormData) {
		setIsLoading(true);

		if (edit && composition!) {
			const result = await updateComposition(composition.id, values);
			setIsLoading(false);

			if (result.success) {
				setOpen(false);
				router.refresh();
			} else if (result.error) {
				if (typeof result.error === "object") form.setError(...result.error);
				else
					return toast("Error updating composition", {
						description: result.error,
						icon: <CircleX className="mr-2 w-4 h-4 my-auto" />,
					});
			}
		} else {
			const result = await addComposition(values);
			setIsLoading(false);

			if (result.success) {
				setOpen(false);
				form.reset();
				toast(`Thank you for adding ${values.name}`, {
					description: "It will be visible to everyone after verification.",
					icon: <CircleCheck className="mr-2 w-4 h-4 my-auto" />,
				});
				router.push(readableUrl("composition", result.composition));
			} else if (result.error) form.setError(...result.error);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

			<DialogContent className="sm:max-w-[425px]">
				{edit ? (
					<DialogHeader>
						<DialogTitle>Edit Composition</DialogTitle>
					</DialogHeader>
				) : (
					<DialogHeader>
						<DialogTitle>Add Composition</DialogTitle>
						<DialogDescription>
							Add a new composition to the OneRep Library. Please confirm this
							composition does not yet exist first. The composition will need to
							be verified before it is visible to others in search results.
						</DialogDescription>
					</DialogHeader>
				)}

				<CompositionForm
					form={form}
					onSubmit={onSubmit}
					isLoading={isLoading}
					edit={edit}
					initialComposers={composers}
				/>
			</DialogContent>
		</Dialog>
	);
}
