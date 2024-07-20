"use client";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export function ListIconInput({
	initialSelection,
	onChange,
}: {
	initialSelection: number;
	onChange: (selection: number) => void;
}) {
	const [open, setOpen] = useState(false);
	const [selection, setSelection] = useState(initialSelection);

	const Icon = Icons.listIcons[selection];

	return (
		<Popover open={open}>
			<PopoverTrigger asChild>
				<div>
					<Button
						type="button"
						variant="outline"
						className="p-2"
						onClick={() => setOpen(!open)}
					>
						<Icon className="w-6 h-6" />
					</Button>
				</div>
			</PopoverTrigger>
			<PopoverContent className="p-2 grid grid-cols-3 gap-2 w-fit">
				{Icons.listIcons.map((ListIcon, index) => (
					<Button
						key={index}
						type="button"
						variant="outline"
						className={`p-2 ${selection === index ? "bg-secondary" : ""}`}
						onClick={() => {
							setSelection(index);
							onChange(index);
							setOpen(false);
						}}
					>
						<ListIcon className="w-6 h-6" />
					</Button>
				))}
			</PopoverContent>
		</Popover>
	);
}
