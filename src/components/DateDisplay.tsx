import { format } from "date-fns";
import { CalendarDays, CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function DateDisplay({
	date,
	button = false,
}: {
	date?: Date;
	button?: boolean;
}) {
	return !button && !date ? null : (
		<Button
			variant="outline"
			className={cn(
				"justify-start text-left font-normal",
				!date && "text-muted-foreground",
				!button ? "hover:bg-background cursor-auto" : "w-full"
			)}
		>
			{button ? (
				<CalendarDays className="mr-2 h-4 w-4" />
			) : (
				<CalendarIcon className="mr-2 h-4 w-4" />
			)}
			{date ? format(date, "PPP") : <span>Pick a date</span>}
		</Button>
	);
}
