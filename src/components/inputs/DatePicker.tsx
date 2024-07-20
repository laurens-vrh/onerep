"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { SelectSingleEventHandler } from "react-day-picker";
import { DateDisplay } from "../DateDisplay";

export function DatePicker({
	date: dateProp,
	setDate: setDateProp,
	onChange,
}: {
	date: Date | null | undefined;
	setDate?: SelectSingleEventHandler;
	onChange?: SelectSingleEventHandler;
}) {
	const datePropOrUndefined = dateProp !== null ? dateProp : undefined;
	const [dateState, setDateState] = useState(datePropOrUndefined);
	const [date, setDate] = setDateProp
		? [datePropOrUndefined, setDateProp]
		: [dateState, setDateState];

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div>
					<DateDisplay date={date} button={true} />
				</div>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={date}
					onSelect={(...date) => {
						setDate(...date);
						if (onChange) onChange(...date);
					}}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
