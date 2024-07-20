import { FileMusic } from "lucide-react";
import { HTMLAttributes, ReactNode } from "react";
import { Icons } from "./Icons";
import { cn } from "@/lib/utils";

export function PageHeader({
	type,
	title,
	icon: Icon,
	description,
	composer,
	badge,
	actions,
	small,
}: {
	type?: string;
	title: string;
	icon:
		| typeof FileMusic
		| (({ className }: { className: string }) => ReactNode);
	description?: string | string[];
	composer?: ReactNode;
	badge?: ReactNode;
	actions?: ReactNode;
	small?: boolean;
}) {
	return (
		<div className="flex flex-col sm:flex-row sm:justify-between">
			<div className="sm:self-center grid grid-cols-[min-content_1fr] items-center">
				<div className="col-start-1 mr-1 sm:row-span-2 sm:mr-4 lg:px-8">
					<Icon
						className={cn(
							"w-6 h-6 sm:w-24 sm:h-24 lg:w-44 lg:h-44",
							small && "w-6 h-6 sm:w-24 sm:h-24 sm:px-4"
						)}
					/>
				</div>
				{type && (
					<p className="text-xl col-start-2 sm:text-lg sm:self-end">{type}</p>
				)}
				<div className="col-span-2 sm:col-span-1 sm:self-start">
					<h1 className="text-4xl lg:text-6xl font-bold mt-1 mb-3">{title}</h1>
					{badge}
					{(typeof description === "string"
						? [description]
						: description ?? []
					).map((desc, index) => (
						<p key={index} className="text-muted-foreground mt-1">
							{desc}
						</p>
					))}
					{composer && <p className="text-lg mt-1">{composer}</p>}
				</div>
			</div>

			<div className="self-start grid grid-flow-col mt-2 sm:mt-0 sm:grid-flow-row gap-2">
				{actions}
			</div>
		</div>
	);
}
