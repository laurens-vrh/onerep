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
import { ListFormData } from "@/lib/schemas";
import { Plus, Save, Trash2Icon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { ListProfile } from "@/database/List";
import { List } from "@prisma/client";
import { UserProfile } from "@/database/User";
import { deleteList } from "@/actions/list";
import { usePathname, useRouter } from "next/navigation";
import { error, success } from "@/lib/utils";

export function ListForm({
	form,
	onSubmit,
	isLoading,
	edit,
	list,
	user,
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
	onSubmit: (values: ListFormData) => void;
	isLoading: boolean;
	edit?: boolean;
	list?: Pick<List, "id" | "name" | "custom">;
	user?: UserProfile;
}) {
	const pathname = usePathname();
	const router = useRouter();

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

				<DialogFooter className="mt-2">
					{edit && list?.custom && user && (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									type="button"
									variant="destructive"
									disabled={isLoading}
									className="text-primary-foreground"
								>
									<Trash2Icon className="mr-2 h-4 w-4" />
									Delete
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Are you sure you want to delete your list {list?.name}?
									</AlertDialogTitle>
									<AlertDialogDescription>
										{(() => {
											const deletedCompositions = user.compositions.filter(
												(c) => {
													const lists = user.lists.filter((l) =>
														l.compositions.find(
															(c2) => c.composition.id === c2.composition.id
														)
													);

													return (
														lists.length === 1 &&
														lists.find((l) => l.id === list.id)
													);
												}
											);

											if (deletedCompositions.length > 0)
												return (
													<>
														All data you have associated with the following
														compositions, including notes, files, etc., will be
														irreversibly deleted:
														<ul className="list-disc pl-4 mt-2">
															{deletedCompositions.map((c) => (
																<li key={c.composition.id}>
																	{c.composition.name}
																</li>
															))}
														</ul>
													</>
												);
											return "This action is irreversible.";
										})()}
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										variant="destructive"
										className="text-primary-foreground"
										onClick={async () => {
											const result = await deleteList(list.id);
											if (!result.success)
												return error(
													`Error deleting list ${list.name}`,
													result.error
												);

											success(`List ${list.name} deleted!`);
											if (pathname.startsWith("/app/list/"))
												router.push("/app");
										}}
									>
										<Trash2Icon className="mr-2 h-4 w-4" />
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}
					<Button type="submit" disabled={isLoading}>
						{isLoading ? (
							<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
						) : edit ? (
							<Save className="mr-2 h-4 w-4" />
						) : (
							<Plus className="mr-2 h-4 w-4" />
						)}
						{edit ? "Save" : "Create"}
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
