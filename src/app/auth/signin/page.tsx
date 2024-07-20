import { Metadata } from "next";
import { UserAuthForm } from "@/app/auth/UserAuthForm";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Authentication",
	description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
	return (
		<>
			<Link
				href="/auth/signup"
				className={cn(
					buttonVariants({ variant: "ghost" }),
					"absolute right-4 top-4 md:right-8 md:top-8"
				)}
			>
				Sign Up
			</Link>
			<div className="flex flex-col space-y-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">
					Sign in to your account
				</h1>
				<p className="text-sm text-muted-foreground">
					Enter your details below to sign in to your account
				</p>
			</div>
			<UserAuthForm type="signin" />
		</>
	);
}
