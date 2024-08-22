import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CompositionFormData } from "@/lib/schemas";
import { UseFormReturn } from "react-hook-form";
import { SearchableComposerListInput } from "./SearchableComposerListInput";
import { Composer } from "@prisma/client";
import { PlusIcon, SaveIcon } from "lucide-react";

export function CompositionForm({
	form,
	onSubmit,
	isLoading,
	initialComposers,
	edit,
}: {
	form: UseFormReturn<CompositionFormData, any, undefined>;
	onSubmit: (values: CompositionFormData) => void;
	isLoading: boolean;
	initialComposers?: Pick<Composer, "id" | "name">[];
	edit?: boolean;
}) {
	return (
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
										onChange={(selection: Pick<Composer, "id">[]) => {
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
						) : edit ? (
							<SaveIcon className="mr-2 h-4 w-4" />
						) : (
							<PlusIcon className="mr-2 h-4 w-4" />
						)}
						{edit ? "Save" : "Add Composition"}
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
