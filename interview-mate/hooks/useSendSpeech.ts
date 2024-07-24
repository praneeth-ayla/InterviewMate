import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
export function useSendSpeech() {
	const [socket, setSocket] = useState<Socket | null>(null);
	useEffect(() => {
		const newSocket = io(process.env.WS_URL || "http://localhost:8000");
		setSocket(newSocket);
	}, []);

	function sendWS({ text, role }: { text: string; role: string }) {
		if (text !== "") {
			// send to websocket
			console.log("data:", { text, role });
			if (socket) {
				socket.emit("message", { text, role });
			}
		}
	}

	return { sendWS };
}
