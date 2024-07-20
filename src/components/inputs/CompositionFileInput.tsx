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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteFile } from "@/lib/actions/file";
import { File } from "@prisma/client";
import { CircleCheck, CircleX, Download, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function CompositionFileInput({
	compositionId,
	type,
	file: initialFile,
}: {
	compositionId: number;
	type: "sheetMusic" | "performance";
	file?: Pick<File, "id" | "name" | "url">;
}) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [file, setFile] = useState(initialFile);
	const formattedType = type === "sheetMusic" ? "sheet music" : "performance";

	return file ? (
		<div className="flex justify-between">
			<Link
				href={file.url}
				className="flex-1 flex justify-start border rounded-md text-sm px-4 py-2 items-center"
			>
				<Download className="w-4 h-4 mr-2 flex-shrink-0" />
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger className="w-full text-left h-5 text-ellipsis overflow-hidden">
							{file.name}
						</TooltipTrigger>
						<TooltipContent>
							<p>{file.name}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</Link>
			<AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<AlertDialogTrigger asChild>
					<Button variant="ghost" className="p-0 ml-2 hover:text-destructive">
						<Trash2 className="w-4 h-4" />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to delete this {formattedType}?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action is irreversible.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							onClick={async () => {
								await deleteFile(file.id);
								setDialogOpen(false);
								setFile(undefined);
							}}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	) : (
		<Input
			id={type}
			type="file"
			accept={type === "sheetMusic" ? ".pdf" : "audio/*"}
			onChange={async (e) => {
				const inputFile = e.target.files?.[0];
				if (!inputFile) return;
				if (inputFile.size > 5000000)
					return toast("File size cannot exceed 5 MB.", {
						icon: <CircleX className="mr-2 w-4 h-4 my-auto" />,
					});

				const response = await fetch(
					process.env.NEXT_PUBLIC_API_BASE +
						`/file?compositionId=${compositionId}&name=${encodeURIComponent(
							inputFile.name
						)}&type=${inputFile.type}`,
					{
						method: "POST",
						body: await inputFile.arrayBuffer(),
					}
				);
				const result = await response
					.json()
					.catch((e) => ({ success: false, error: e }));

				if (!result.success)
					return toast(`Error uploading ${formattedType}`, {
						description: result.error ?? "",
						icon: <CircleX className="mr-2 w-4 h-4 my-auto" />,
					});

				toast(`${formattedType} uploaded!`, {
					icon: <CircleCheck className="mr-2 w-4 h-4 my-auto" />,
				});
				setFile(result.file);
			}}
		/>
	);
}
