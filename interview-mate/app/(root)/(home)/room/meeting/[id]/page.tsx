"use client";
import { useSendSpeech } from "@/hooks/useSendSpeech";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Meeting {
	id: number;
	description: string;
	meetingId: string;
	users: string;
	analysis: AnalysisResult;
}

interface AnalysisResult {
	communication_skills: SkillRating;
	cultural_fit: SkillRating;
	overall_rating: SkillRating;
	technical_skills: SkillRating;
}

interface SkillRating {
	comment: string;
	rating: string;
}

export default function Page() {
	const meetingRoomId = usePathname().slice(5);
	const { needAnalysis } = useSendSpeech();
	const [meetingDetails, setMeetingDetails] = useState<Meeting>();
	const [analysis, setAnalysis] = useState<AnalysisResult>();

	const getAnalysis = async (roomId: string) => {
		try {
			const res = await needAnalysis(roomId);
			//@ts-ignore
			setMeetingDetails(res);
			console.log(meetingDetails, "new");

			// @ts-ignore
			const parsedAnalysis = JSON.parse(meetingDetails?.analysis);
			setAnalysis(parsedAnalysis);
		} catch (error) {
			console.error("Failed to fetch analysis:", error);
		}
	};

	// getAnalysis(meetingRoomId);
	useEffect(() => {
		if (meetingRoomId) {
			setTimeout(() => {
				getAnalysis(meetingRoomId);
				console.log(meetingRoomId, "ana", analysis);
			}, 2000);
		}
	}, []);

	return (
		<div>
			{meetingRoomId}
			<div onClick={() => getAnalysis(meetingRoomId)}>test</div>
			<div>{JSON.stringify(analysis)}</div>
			<div>{analysis?.communication_skills?.rating}</div>
		</div>
	);
}
