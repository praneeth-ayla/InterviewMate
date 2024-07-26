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
	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle className="flex justify-between items-center">
					<div>Meeting</div>
					<div className="text-sm font-light">
						{DateTimeDisplay(partialDetails.dateAndTime).slice(
							0,
							17
						)}
					</div>
				</CardTitle>
				<CardDescription>
					{partialDetails.meetingId.slice(9)}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{partialDetails.description.length > 150 ? (
					<>{partialDetails.description.slice(0, 150)}...</>
				) : (
					<>{partialDetails.description}</>
				)}
			</CardContent>
			<div className="flex justify-center pb-4">
				<DrawerComp meetingId={partialDetails.meetingId}></DrawerComp>
			</div>
		</Card>
	);
}
