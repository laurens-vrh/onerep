import { Icons } from "@/components/Icons";
import { z } from "zod";

export type SignUpData = z.infer<typeof signUpSchema>;
export const signUpSchema = z
	.object({
		username: z
			.string()
			.toLowerCase()
			.min(4, { message: "Username must be between 4 and 32 characters" })
			.max(32, { message: "Username must be between 4 and 32 characters" })
			.regex(/^[a-z0-9-]+$/i, {
				message: "Username can only contain letters, numbers, and -",
			}),
		email: z.string().email(),
		password: z.string(),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export type SignInData = z.infer<typeof signInSchema>;
export const signInSchema = z.object({
	usernameOrEmail: z.string().min(1, { message: "Username or email required" }),
	password: z.string().min(1, { message: "Password required" }),
});

/*z
		.string()
		.toLowerCase()
		.min(4, { message: "Username must be between 4 and 32 characters" })
		.max(32, { message: "Username must be between 4 and 32 characters" })
		.regex(/^[a-z0-9-]+$/i, {
			message: "Username can only contain letters, numbers, and -",
		}),*/

export type CompositionFormData = z.infer<typeof compositionFormSchema>;
export const compositionFormSchema = z.object({
	name: z.string().min(1, { message: "Name required" }),
	composers: z.array(z.number()).min(1, { message: "Composer required" }),
});

export type AddComposerFormSchemaData = z.infer<typeof addComposerFormSchema>;
export const addComposerFormSchema = z.object({
	name: z.string().min(1, { message: "Name required" }),
});

export type ListFormSchemaData = z.infer<typeof listFormSchema>;
export const listFormSchema = z.object({
	name: z.string().min(1, { message: "Name required" }),
	description: z.string(),
	icon: z.number().min(0).max(Icons.listIcons.length),
});
