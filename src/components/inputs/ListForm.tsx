import { Icons } from "@/components/Icons";
import { ListIconInput } from "@/components/inputs/ListIconInput";
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
import { Textarea } from "@/components/ui/textarea";
import { ListFormSchemaData } from "@/lib/schemas";
import { Save } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

export function ListForm({
	form,
	onSubmit,
	isLoading,
}: {
	form: UseFormReturn<
		{
			name: string;
			icon: number;
			description: string;
		},
		any,
		undefined
	>;
	onSubmit: (values: ListFormSchemaData) => void;
	isLoading: boolean;
}) {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
				<div className="grid gap-4">
					<div className="flex gap-2">
						<FormField
							control={form.control}
							name="icon"
							render={() => (
								<FormItem>
									<FormLabel>Icon</FormLabel>
									<FormControl>
										<ListIconInput
											initialSelection={form.getValues().icon}
											onChange={(selection: number) => {
												form.setValue("icon", selection);
												form.trigger("icon");
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} autoComplete="off" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea {...field} />
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
							<Save className="mr-2 h-4 w-4" />
						)}
						Save
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
