import { ComposerFormData } from "@/lib/schemas";
import { PlusIcon, SaveIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Icons } from "../Icons";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export function ComposerForm({
	form,
	onSubmit,
	isLoading,
	edit,
}: {
	form: UseFormReturn<ComposerFormData, any, undefined>;
	onSubmit: (values: ComposerFormData) => void;
	isLoading: boolean;
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
						{edit ? "Save" : "Add Composer"}
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
