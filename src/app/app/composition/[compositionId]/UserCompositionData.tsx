"use client";

import { DateDisplay } from "@/components/DateDisplay";
import { Heading } from "@/components/Heading";
import { Icons } from "@/components/Icons";
import { CompositionFileInput } from "@/components/inputs/CompositionFileInput";
import { DatePicker } from "@/components/inputs/DatePicker";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { updateUserCompositionData } from "@/actions/composition";
import { CompositionProfile } from "@/database/Composition";
import { FileType } from "@prisma/client";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

export function UserCompositionData({
	composition,
}: {
	composition: Pick<CompositionProfile, "id" | "users">;
}) {
	const userCompositionData = composition.users[0];

	const [isLoading, setIsLoading] = useState(false);
	const newNotes = useRef(userCompositionData.notes ?? "");
	const [notes, setNotes] = useState(newNotes.current);
	const [startDate, setStartDate] = useState<Date | undefined>(
		userCompositionData.startDate ?? undefined
	);
	const [endDate, setEndDate] = useState<Date | undefined>(
		userCompositionData.endDate ?? undefined
	);

	const initialMount = useRef(true);
	useEffect(() => {
		if (initialMount.current) {
			initialMount.current = false;
			return;
		}

		if (notes === userCompositionData.notes) return;
		newNotes.current = notes;
		setIsLoading(true);

		setTimeout(() => {
			if (notes !== newNotes.current) return;

			updateUserCompositionData(composition.id, { notes }).then(() =>
				setIsLoading(false)
			);
		}, 1000);
	}, [notes, composition.id, userCompositionData.notes]);

	return (
		<div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2">
			<div className="p-4 rounded-lg border">
				<Heading level={3} className="col-span-2">
					Public
				</Heading>
				<div className="h-min grid grid-cols-[fit-content(10%)_1fr] gap-y-2 gap-x-4 items-center">
					<span className="text-right my-1">Added</span>
					<DateDisplay date={userCompositionData.createdAt} />
					<span className="text-right my-1">Updated</span>
					<DateDisplay date={userCompositionData.updatedAt} />

					<Separator className="col-span-2" />
					<span className="text-right">Started</span>
					<DatePicker
						date={startDate}
						setDate={(date) => {
							setStartDate(date);
							updateUserCompositionData(composition.id, {
								startDate: date === undefined ? null : date,
							});
						}}
					/>
					<span className="text-right">Finished</span>
					<DatePicker
						date={endDate}
						setDate={(date) => {
							setEndDate(date);
							updateUserCompositionData(composition.id, {
								endDate: date === undefined ? null : date,
							});
						}}
					/>
				</div>
			</div>

			<div className="p-4 rounded-lg border">
				<Heading level={3} className="col-span-2">
					Files
				</Heading>
				<div className="h-min grid grid-cols-[fit-content(50%)_1fr] gap-2 items-center">
					<label className="text-right" htmlFor="sheetMusic">
						Sheet music
					</label>
					<CompositionFileInput
						compositionId={composition.id}
						type="sheetMusic"
						file={userCompositionData.files.find(
							(f) => f.type === FileType.SHEETMUSIC
						)}
					/>

					<label className="text-right" htmlFor="performance">
						Performance
					</label>
					<CompositionFileInput
						compositionId={composition.id}
						type="performance"
						file={userCompositionData.files.find(
							(f) => f.type === FileType.PERFORMANCE
						)}
					/>
				</div>
			</div>

			<div className="relative sm:col-span-2 xl:col-span-1">
				<Textarea
					className="p-4 min-h-36 xl:min-h-full rounded-lg"
					placeholder="Write any notes here..."
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
				/>
				{isLoading && (
					<Icons.spinner className=" absolute pointer-events-none h-4 animate-spin right-2 top-3" />
				)}
			</div>
		</div>
	);
}
