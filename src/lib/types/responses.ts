export type UserSignUpFormResponse =
	| { success: true }
	| { success: false; error?: string };

export type UserSignInFormResponse = { success: false; error: string };
export type AddCompositionFormResponse =
	| { success: true; id: number }
	| {
			success: false;
			error?: ["name" | "composers", { message: string }];
	  };
export type AddComposerFormResponse =
	| { success: true; id: number }
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
