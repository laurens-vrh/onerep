import { Icons } from "@/components/Icons";
import { Metadata } from "next";
import { AuthButtons } from "./AuthButtons";

export const metadata: Metadata = {
	title: "Authentication",
	description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
	return (
		<div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
				<div className="absolute inset-0 bg-neutral-900" />
				<div className="relative z-20 flex items-center text-lg font-medium">
					<Icons.logo className="mr-2 h-6 w-6" />
					OneRep
				</div>
			</div>
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">
							Sign in to your account
						</h1>
						<p className="text-sm text-muted-foreground">
							Select one of the providers listed below to sign in to your
							account
						</p>
					</div>
					<AuthButtons />
				</div>
			</div>
		</div>
	);
}
