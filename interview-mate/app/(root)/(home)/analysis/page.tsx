"use client";

import AnalysisCard from "@/components/AnalysisCard";
import { DrawerComp } from "@/components/Drawer";
import Loader from "@/components/Loader";
import { useGetCalls } from "@/hooks/useGetCalls";
import { useSendSpeech } from "@/hooks/useSendSpeech";
import { useUser } from "@clerk/nextjs";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface PartialDetialEl {
	description: string;
	meetingId: string;
	id: number;
	users: string;
	dateAndTime: string; // ISO 8601 date-time string
}

export default function Page() {
	const { endedCalls, isLoading } = useGetCalls();
	const router = useRouter();
	const calls = endedCalls;
	const [partialDetails, setPartialDetails] = useState<PartialDetialEl[]>();

	// Get User Details
	const { user } = useUser();
	function getUserMail() {
		if (user?.emailAddresses[0].emailAddress) {
			return user?.emailAddresses[0].emailAddress;
		}
	}

	async function getPartialDetails() {
		const userMail = getUserMail();

		try {
			const response = await fetch(
				`https://interviewmate-atie.onrender.com/partialD`,
				{
					// const response = await fetch("http://localhost:8000/partialD", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email: userMail }),
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			setPartialDetails(data.partialDetails);
		} catch (error) {
			console.error("Fetch error:", error);
		}
	}

	useEffect(() => {
		getPartialDetails();
	}, []);

	return (
		<section className="flex size-full flex-col gap-10">
			<h1 className="text-3xl font-bold">Meeting Analytics</h1>
			{isLoading ? (
				<Loader />
			) : !isLoading && partialDetails?.length === 0 ? (
				<div className="text-2xl font-bold">
					No Interviews To Analyze
				</div>
			) : (
				<div
					className="grid grid-cols-1 gap-5 xl:grid-cols-2"
					// className="grid gap-16 md:grid-cols-2 lg:grid-cols-3 ">
				>
					{partialDetails?.map((meeting) => (
						<AnalysisCard
							key={meeting.id}
							partialDetails={meeting}></AnalysisCard>
					))}
				</div>
			)}
		</section>
	);
}
