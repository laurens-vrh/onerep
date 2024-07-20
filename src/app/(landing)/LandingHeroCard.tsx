import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { MusicIcon } from "lucide-react";
import { ReactNode } from "react";

export function LandingHeroCard({
	className,
	title,
	icon: Icon,
	children,
}: {
	className: string;
	title: string;
	icon: typeof MusicIcon;
	children: ReactNode;
}) {
	return (
		<Card
			className={cn(
				"absolute drop-shadow-xl shadow-black/10 dark:shadow-white/10",
				className
			)}
		>
			<CardHeader className="flex md:flex-row justify-start items-start gap-2">
				<div className="w-full">
					<CardTitle className="flex items-center gap-2">
						<div className="mt-1 w-min bg-primary/20 p-2 rounded-2xl">
							<Icon className="w-4 h-4" />
						</div>
						<div className="w-full">
							{title}
							<Separator className="mt-1" />
						</div>
					</CardTitle>
					<div className="mt-2 text-sm">{children}</div>
				</div>
			</CardHeader>
		</Card>
	);
}
