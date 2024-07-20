"use client";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addComposer } from "@/lib/actions/composer";
import {
	addComposerFormSchema,
	AddComposerFormSchemaData,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function AddComposerDialog({
	trigger,
	open: openProp,
	setOpen: setOpenProp,
}: {
	trigger?: React.ReactNode;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [stateOpen, setStateOpen] = useState(false);
	const [open, setOpen] =
		openProp && setOpenProp
			? [openProp, setOpenProp]
			: [stateOpen, setStateOpen];

	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<AddComposerFormSchemaData>({
		resolver: zodResolver(addComposerFormSchema),
		defaultValues: { name: "" },
	});

	async function onSubmit(values: AddComposerFormSchemaData) {
		setIsLoading(true);
		const result = await addComposer(values);
		setIsLoading(false);

		if (result.success) {
			setOpen(false);
			form.reset();
			toast(`Thank you for adding ${values.name}`, {
				description: "They will be visible to everyone after verification.",
				icon: <CircleCheck className="mr-2 w-4 h-4 my-auto" />,
			});
			router.push(`/app/composer/${result.id}`);
		} else if (result.error) form.setError(...result.error);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Composer</DialogTitle>
					<DialogDescription>
						Add a new composer to the OneRep Library. Please confirm this
						composer does not yet exist first. They will need to be verified
						before they are visible to others in search results.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
						<div className="grid gap-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input {...field} autoComplete="off" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter>
							<Button type="submit" disabled={isLoading} className="mt-2">
								{isLoading ? (
									<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Plus className="mr-2 h-4 w-4" />
								)}
								Add Composer
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
