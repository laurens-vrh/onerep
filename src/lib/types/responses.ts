import { Composer, Composition } from "@prisma/client";

export type UserSignUpFormResponse =
	| { success: true }
	| { success: false; error?: string };

export type UserSignInFormResponse = { success: false; error: string };
export type CompositionFormResponse =
	| { success: true; composition: Pick<Composition, "id" | "name"> }
	| {
			success: false;
			error?: ["name" | "composers", { message: string }];
	  };
export type AddComposerFormResponse =
	| { success: true; composer: Pick<Composer, "id" | "name"> }
	| {
			success: false;
			error?: ["name", { message: string }];
	  };

export type ToastResponse =
	| {
			success: true;
	  }
	| {
			success: false;
			error?: string;
	  };
export type ApproveComposerResponse = ToastResponse;
export type ApproveCompositionResponse = ToastResponse;
export type SaveCompositionResponse = ToastResponse;
