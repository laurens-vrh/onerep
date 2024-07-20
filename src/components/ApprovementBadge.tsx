import { CircleAlert, CircleCheck, CircleHelp } from "lucide-react";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function ApprovementBadge({
	type,
	approved,
}: {
	type: "composer" | "composition";
	approved: boolean | null;
}) {
	return approved === true ? (
		<Popover>
			<PopoverTrigger asChild>
				<Badge variant="default" className="cursor-pointer select-none">
					Approved
					<CircleCheck className="w-4 h-4 ml-1" />
				</Badge>
			</PopoverTrigger>
			<PopoverContent className="w-60 text-sm p-3">
				This {type} has been approved.
			</PopoverContent>
		</Popover>
	) : approved === false ? (
		<Popover>
			<PopoverTrigger asChild>
				<Badge variant="default" className="cursor-pointer select-none">
					Disapproved
					<CircleAlert className="w-4 h-4 ml-1" />
				</Badge>
			</PopoverTrigger>
			<PopoverContent className="w-60 text-sm p-3">
				This {type} has been disapproved. It is not visible in public search
				results, but only to you.
			</PopoverContent>
		</Popover>
	) : (
		<Popover>
			<PopoverTrigger asChild>
				<Badge variant="default" className="cursor-pointer select-none">
					Unverified <CircleHelp className="w-4 h-4 ml-1" />
				</Badge>
			</PopoverTrigger>
			<PopoverContent className="w-60 text-sm p-3">
				This {type} is unverified and will not appear in search results for
				others until it has been approved.
			</PopoverContent>
		</Popover>
	);
}
