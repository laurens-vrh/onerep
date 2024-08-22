import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

export function TextLink({
	href,
	className,
	hidden,
	children,
}: {
	href: string;
	className?: string;
	hidden?: boolean;
	children: ReactNode;
}) {
	return (
		<Link
			href={href}
			className={cn(
				"underline-offset-4 hover:text-primary focus:text-primary",
				hidden ? "hover:underline focus:underline" : "underline",
				className
			)}
		>
			{children}
		</Link>
	);
}
