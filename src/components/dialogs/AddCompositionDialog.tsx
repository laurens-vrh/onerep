"use client";

import { Icons } from "@/components/Icons";
import { SearchableComposerListInput } from "@/components/inputs/SearchableComposerListInput";
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
import { addComposition } from "@/lib/actions/composition";
import {
	addCompositionFormSchema,
	AddCompositionFormSchemaData,
} from "@/lib/schemas";
import { readableUrl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Composer } from "@prisma/client";
import { CircleCheck, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function AddCompositionDialog({
	trigger,
	open: openProp,
	setOpen: setOpenProp,
	initialComposers,
}: {
	trigger?: React.ReactNode;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	initialComposers?: Pick<Composer, "id" | "name">[];
}) {
	const [stateOpen, setStateOpen] = useState(false);
	const [open, setOpen] =
		openProp && setOpenProp
			? [openProp, setOpenProp]
			: [stateOpen, setStateOpen];

	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<AddCompositionFormSchemaData>({
		resolver: zodResolver(addCompositionFormSchema),
		defaultValues: {
			name: "",
			composers: initialComposers?.map((a) => a.id) ?? [],
		},
	});

	async function onSubmit(values: AddCompositionFormSchemaData) {
		setIsLoading(true);

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

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Composition</DialogTitle>
					<DialogDescription>
						Add a new composition to the OneRep Library. Please confirm this
						composition does not yet exist first. The composition will need to
						be verified before it is visible to others in search results.
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
							<FormField
								control={form.control}
								name="composers"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Composers</FormLabel>
										<FormControl>
											<SearchableComposerListInput
												onChange={(
													selection: Pick<Composer, "id" | "name">[]
												) => {
													form.setValue(
														"composers",
														selection.map((a) => a.id)
													);
													form.trigger("composers");
												}}
												initialComposers={initialComposers}
											/>
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
								Add Composition
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
