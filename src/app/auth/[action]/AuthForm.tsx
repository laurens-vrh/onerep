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
import { signUp } from "@/actions/user";
import {
	SignInData,
	signInSchema,
	SignUpData,
	signUpSchema,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function AuthForm({
	type,
	callbackUrl,
}: {
	type: "signup" | "signin";
	callbackUrl: string;
}) {
	const searchParams = useSearchParams();
	const error = searchParams.get("code");

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const form = useForm<SignUpData | SignInData>({
		resolver: zodResolver(type === "signup" ? signUpSchema : signInSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
			usernameOrEmail: "",
		},
	});

	async function onSubmit(values: SignUpData | SignInData) {
		setIsLoading(true);
		if (type === "signup") {
			const result = await signUp(values as SignUpData);

			if (!result.success) {
				if (result.error === "IN_USE") {
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

		await signIn("credentials", {
			...(type === "signin"
				? values
				: {
						usernameOrEmail: (values as SignUpData).email,
						password: values.password,
				  }),
			callbackUrl,
		});
		setIsLoading(false);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
				<div>
					{type === "signup" ? (
						<>
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
						</>
					) : (
						<FormField
							control={form.control}
							name="usernameOrEmail"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="sr-only">Username or email</FormLabel>
									<FormControl>
										<Input placeholder="username or email" {...field} />
									</FormControl>
									<FormMessage>
										{error === "INVALID_CREDENTIALS" && "Invalid credentials"}
									</FormMessage>
								</FormItem>
							)}
						/>
					)}

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="sr-only">Password</FormLabel>
								<FormControl>
									<Input placeholder="password" type="password" {...field} />
								</FormControl>
								<FormMessage>
									{error === "INVALID_CREDENTIALS" && "Invalid credentials"}
								</FormMessage>
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
					{type === "signup" ? "Sign up" : "Sign in"} with Password
				</Button>
			</form>
		</Form>
	);
}
