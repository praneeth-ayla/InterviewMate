import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
export function useSendSpeech() {
	const [socket, setSocket] = useState<Socket | null>(null);
	useEffect(() => {
		const url = process.env.WS_URL;
		const newSocket = io("https://interviewmate-atie.onrender.com/");
		setSocket(newSocket);
	}, []);

	function joinRoom(id: string) {
		// send to websocket
		console.log(id, "id");
		if (socket) {
			socket.emit("join-room", id);
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

	function needQuestions(meetingRoomId: string) {
		socket?.on("questions", (questions) => {
			console.log("=====================");
			console.log("questions", questions);
			console.log("=====================");
		});

		socket?.emit("need-questions", meetingRoomId);
	}
	return { sendWS, joinRoom, needQuestions };
}
