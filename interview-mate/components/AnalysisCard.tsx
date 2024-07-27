import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import DateTimeDisplay from "./TimeConverter";
import { DrawerComp } from "./Drawer";
interface PartialDetialEl {
	description: string;
	meetingId: string;
	id: number;
	users: string;
	dateAndTime: string; // ISO 8601 date-time string
}
export default function AnalysisCard({
	partialDetails,
}: {
	partialDetails: PartialDetialEl;
}) {
	const meetingType = partialDetails.meetingId.includes("meeting");

	return (
		<Card className="min-h-[258px]">
			<CardHeader>
				<CardTitle className="flex justify-between items-center">
					<div className="text-2xl">
						{meetingType ? "Meeting" : "Mock Interview"}
					</div>
					<div className="font-light">
						{DateTimeDisplay(partialDetails.dateAndTime).slice(
							0,
							17
						)}
					</div>
				</CardTitle>
				<CardDescription className="text-xl">
					{meetingType
						? partialDetails.meetingId.slice(9)
						: partialDetails.meetingId.slice(16)}
				</CardDescription>
			</CardHeader>
			<CardContent className="text-xl h-24">
				{partialDetails.description.length > 150 ? (
					<>{partialDetails.description.slice(0, 150)}...</>
				) : (
					<>{partialDetails.description}</>
				)}
			</CardContent>
			<CardFooter className="flex justify-center">
				<DrawerComp meetingId={partialDetails.meetingId}></DrawerComp>
			</CardFooter>
		</Card>
	);
}
