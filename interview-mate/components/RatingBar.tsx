"use client";

import * as React from "react";

import { Progress } from "@/components/ui/progress";
import convertRatingToPercentage from "./RatingToPercentage";

export function RatingBar({ rating }: { rating: string | undefined }) {
	const percent = rating ? convertRatingToPercentage(rating) : 0;
	const [progress, setProgress] = React.useState<number>(percent);

	return (
		<div>
			<Progress
				value={progress}
				className="w-[60%] bg"
			/>
		</div>
	);
}
