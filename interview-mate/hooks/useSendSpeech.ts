import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
export function useSendSpeech() {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [questions, setQuestions] = useState<any[]>([]);

	useEffect(() => {
		const socket_url = process.env.WS_URL;
		// const newSocket = io("https://interviewmate-atie.onrender.com/");
		// const newSocket = io("http://localhost:8000");
		const newSocket = io(socket_url || "http://localhost:8000");
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

	return { sendWS, joinRoom, needQuestions };
}
