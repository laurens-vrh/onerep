"use client";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/lib/actions/user";
import {
	userSignInFormSchema,
	UserSignInFormSchemaData,
	userSignUpFormSchema,
	UserSignUpFormSchemaData,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";

export function UserAuthForm({ type }: { type: "signup" | "signin" }) {
	const params = useParams<{ redirectTo?: string }>();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const form = useForm<UserSignUpFormSchemaData | UserSignInFormSchemaData>({
		resolver: zodResolver(
			type === "signup" ? userSignUpFormSchema : userSignInFormSchema
		),
		defaultValues: {},
	});

	async function onSubmit(
		values: UserSignUpFormSchemaData | UserSignInFormSchemaData
	) {
		setIsLoading(true);
		if (type === "signup") {
			const result = await signUp(values);

			if (!result.success) {
				if (result.error === "ALREADY_USED") {
					form.setError("username", {
						message: "Username or email already in use",
					});
					form.setError("email", {
						message: "Username or email already in use",
					});
				}
				setIsLoading(false);
				return;
			}
		}

		const result = await signIn(values, params.redirectTo);
		if (!result?.success) {
			if (result?.error === "INVALID_EMAIL")
				form?.setError("email", {
					message: "Email not known",
				});
			if (result?.error === "INVALID_PASSWORD")
				form?.setError("password", {
					message: "Password incorrect",
				});
		}
		setIsLoading(false);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
				<div>
					{type === "signup" ? (
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="sr-only">Username</FormLabel>
									<FormControl>
										<Input placeholder="username" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					) : null}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="sr-only">Email</FormLabel>
								<FormControl>
									<Input placeholder="email" {...field} type="email" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="sr-only">Password</FormLabel>
								<FormControl>
									<Input placeholder="password" type="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{type === "signup" ? (
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="sr-only">Confirm password</FormLabel>
									<FormControl>
										<Input
											placeholder="confirm password"
											type="password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					) : null}
				</div>

				<Button disabled={isLoading}>
					{isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
					{type === "signup" ? "Sign up" : "Sign in"} with Email
				</Button>
			</form>
		</Form>
	);
}
