import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { List } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";

export function SaveCompositionAlertDialog<
	T extends Pick<List, "id"> | number
>({
	open,
	setOpen,
	list,
	name,
	saveFn,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	list: T | undefined;
	name?: string;
	saveFn: (l: NonNullable<T>, save: boolean) => any;
}) {
	const pathname = usePathname();
	const router = useRouter();

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to remove {name ?? "this composition"} from
						your Library?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This will remove all data you have associated with this composition,
						including notes, files, etc.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={async () => {
							if (!list) return;

							await saveFn(list, false);
							setOpen(false);
							if (pathname.startsWith("/app/composition/")) router.refresh();
						}}
					>
						Remove
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
