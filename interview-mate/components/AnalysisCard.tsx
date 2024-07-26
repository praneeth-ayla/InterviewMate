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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import DateTimeDisplay from "./TimeConverter";
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
		<Card className="w-[350px] hover:scale-110 cursor-pointer">
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
		</Card>
	);
}
