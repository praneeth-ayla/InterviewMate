"use client";

import Loader from "@/components/Loader";
import { useGetCalls } from "@/hooks/useGetCalls";
import { useSendSpeech } from "@/hooks/useSendSpeech";
import { Call, CallRecording } from "@stream-io/video-react-sdk";

export default function page() {
	const { endedCalls, isLoading } = useGetCalls();
	const calls = endedCalls;
	const { needAnalysis, joinRoom } = useSendSpeech();

	return (
		<div>
			test
			<div>
				{isLoading ? (
					<Loader />
				) : (
					<>
						{calls && calls.length > 0 ? (
							<div>
								{calls.map(
									(
										meeting: Call | CallRecording,
										index: number
									) => (
										<div key={index}>
											{(meeting as Call).id}
										</div>
									)
								)}
							</div>
						) : (
							<></>
						)}
					</>
				)}
			</div>
			<button
				onClick={() => {
					const data = needAnalysis(
						"/meeting/c878253c-8584-4557-82e7-3b4619773db7"
					).then((mess) => {
						console.log("''''''''''''''''''''''''");
						console.log(mess);
						console.log("''''''''''''''''''''''''");
					});
				}}>
				get data
			</button>
		</div>
	);
}
