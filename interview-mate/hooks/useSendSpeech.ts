import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
export function useSendSpeech() {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [questions, setQuestions] = useState<any[]>([]);
	const [analysis, setAnalysis] = useState<any[]>([]);

	useEffect(() => {
		// const newSocket = io("https://interviewmate-atie.onrender.com/");
		const newSocket = io("http://localhost:8000");
		setSocket(newSocket);
	}, []);

	function joinRoom(id: string, userMail: string) {
		// send to websocket
		if (socket) {
			socket.emit("join-room", { id, userMail });
		}
	}

	function sendWS({
		text,
		role,
		meetingRoomId,
	}: {
		text: string;
		role: string;
		meetingRoomId: string;
	}) {
		if (text !== "") {
			// send to websocket
			console.log("data:", { text, role });
			if (socket) {
				socket.emit("message", { text, role, meetingRoomId });
			}
		}
	}

	function needQuestions(meetingRoomId: string, type: "not" | "empty") {
		if (type === "not") {
			return new Promise<any[]>((resolve) => {
				socket?.emit("need-questions", meetingRoomId);

				socket?.on("questions", (questions) => {
					setQuestions(questions);
					resolve(questions);
				});
			});
		} else {
			return new Promise<any[]>((resolve) => {
				socket?.emit("need-questions-empty", meetingRoomId);

				socket?.on("questions", (questions) => {
					setQuestions(questions);
					resolve(questions);
				});
			});
		}
	}

	function needAnalysis(meetingRoomId: string) {
		return new Promise<any[]>((resolve) => {
			socket?.emit("need-analysis", meetingRoomId);

			socket?.on("analysis", (analysis) => {
				setAnalysis(analysis);
				resolve(analysis);
			});
		});
	}

	return { sendWS, joinRoom, needQuestions, needAnalysis };
}
