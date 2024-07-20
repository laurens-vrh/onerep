import { Icons } from "@/components/Icons";
import { DatePicker } from "@/components/inputs/DatePicker";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenuCheckboxItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
	Check,
	DownloadIcon,
	FileMusic,
	ListPlus,
	SearchIcon,
} from "lucide-react";
import { ReactNode } from "react";

function StepCard({
	step,
	title,
	content,
	children,
}: {
	step: number;
	title: string;
	content: string;
	children: ReactNode;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<div className="bg-gradient-to-tr from-primary to-primary/60 text-white rounded-full w-12 h-12 font-extrabold text-2xl grid place-items-center">
						{step}
					</div>
					<div className="flex-grow">
						{title}
						<Separator className="mt-1" />
					</div>
				</CardTitle>
				<p className="text-muted-foreground pb-2">{content}</p>
				<div>{children}</div>
			</CardHeader>
		</Card>
	);
}

export function LandingExplanation() {
	return (
		<section id="features" className="container py-24 space-y-8">
			<h2 className="text-3xl lg:text-4xl font-bold md:text-center">
				How It{" "}
				<span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
					Works
				</span>
			</h2>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				<StepCard
					step={1}
					title="Search for a composition"
					content="If your piece is not listed, you can always add it to the library manually."
				>
					<div className="border border-b-0 w-full rounded-md rounded-b-none flex items-center px-3">
						<SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
						<input
							name="search"
							className="h-8 w-full py-3 text-sm outline-none"
							placeholder="Search for compositions, composers, lists..."
							autoComplete="off"
							value="Peril in Pantomime"
							readOnly
						/>
					</div>
					<div className="rounded-b-md border w-full shadow-md">
						<div className="p-2">
							<span className="text-sm text-muted-foreground font-medium">
								Compositions
							</span>
							<div className="mt-2 rounded-sm px-3 py-2 border flex items-center">
								<FileMusic className="mr-2 h-6 w-6" />
								<div className="grid grid-cols-1">
									<span className="w-full">Peril in Pantomime</span>
									<span className="text-sm">By Tom Brier</span>
								</div>
							</div>
						</div>
					</div>
				</StepCard>
				<StepCard
					step={2}
					title="Add to your Library"
					content="A composition can be added to multiple lists."
				>
					<div className="flex flex-col gap-1 items-center">
						<Button className="outline-none select-none">
							<ListPlus className="mr-2 h-4 w-4" /> Save
						</Button>
						<div className="rounded-md border bg-popover p-1 text-popover-foreground shadow-md text-sm">
							<p className="font-semibold p-2 py-1">Add to List</p>
							<Separator />
							<div className="grid grid-cols-2">
								{[
									{
										name: "Repertoire",
										icon: 0,
									},
									{
										name: "Want to play",
										icon: 1,
									},
									{
										name: "Archive",
										icon: 2,
									},
									{
										name: "Favorites",
										icon: 3,
									},
								].map((list, index) => {
									const Icon = Icons.listIcons[list.icon];
									return (
										<Button
											key={list.name}
											variant="ghost"
											className="justify-start"
										>
											{index === 0 && <Check className="mr-2 h-4 w-4" />}
											<Icon
												className={cn("mr-2 h-4 w-4", index === 2 && "ml-6")}
											/>
											{list.name}
										</Button>
									);
								})}
							</div>
						</div>
					</div>
				</StepCard>
				<StepCard
					step={3}
					title="Add Notes"
					content="You can add dates, sheet music, and more."
				>
					<div className="">
						<div className="h-min grid grid-cols-[max-content_1fr] gap-y-1 gap-x-2 items-center">
							<span className="text-right">Started</span>
							<DatePicker date={new Date(Date.now() - 7 * 24 * 3600 * 1000)} />
							<span className="text-right">Finished</span>
							<DatePicker date={undefined} />
							<span className="text-right">Sheets</span>
							<div className="flex-1 flex justify-start border rounded-md text-sm px-4 py-2 items-center">
								<DownloadIcon className="w-4 h-4 mr-2" />
								Peril_in_Pantomime.pdf
							</div>
							<Textarea
								className="col-span-2 min-h-10 h-10 focus-visible:ring-0 resize-none"
								placeholder="Write any notes here..."
								value=""
								readOnly
							/>
						</div>
					</div>
				</StepCard>
			</div>
		</section>
	);
}
