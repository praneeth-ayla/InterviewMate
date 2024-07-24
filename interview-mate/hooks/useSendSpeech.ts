export function useSendSpeech() {
	function sendWS({ text, role }: { text: string; role: string }) {
		if (text !== "") {
			// send to websocket
			console.log("data:", { text, role });
		}
	}

	return { sendWS };
}
