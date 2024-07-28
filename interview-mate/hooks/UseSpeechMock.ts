import { useEffect, useState, useRef } from "react";

let recognition: any = null;
if ("webkitSpeechRecognition" in window) {
	recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
	recognition.lang = "en-US";
}

const useSpeechRecognition = (isMuted: boolean) => {
	const [text, setText] = useState("");
	const [isListening, setIsListening] = useState(false);
	const timeoutId = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!recognition) return;

		recognition.onresult = (event: SpeechRecognitionEvent) => {
			let finalTranscript = "";
			for (let i = event.resultIndex; i < event.results.length; i++) {
				if (event.results[i].isFinal) {
					finalTranscript += event.results[i][0].transcript + " ";
				}
			}
			setText((prevText) => prevText + finalTranscript);
		};

		recognition.onerror = (event: any) => {
			console.log("Recognition error:", event.error);
		};

		recognition.onend = () => {
			console.log("Recognition ended");
			if (isListening && !isMuted) {
				timeoutId.current = setTimeout(() => {
					if (!isMuted) {
						console.log("Restarting recognition");
						recognition.start(); // Restart recognition after a delay
					}
				}, 500); // Adjust delay as needed
			}
		};

		return () => {
			if (timeoutId.current) {
				clearTimeout(timeoutId.current);
			}
			recognition.stop();
		};
	}, [isListening, isMuted]);

	const startListening = () => {
		setText("");
		setIsListening(true);
		if (!isMuted) {
			try {
				console.log("Starting recognition");
				recognition.start();
			} catch (error) {
				console.log("Error starting recognition:", error);
			}
		}
	};

	const stopListening = () => {
		setIsListening(false);
		if (timeoutId.current) {
			clearTimeout(timeoutId.current);
		}
		recognition.stop();
	};

	return {
		text,
		setText,
		startListening,
		stopListening,
		isListening,
		hasRecognitionSupport: !!recognition,
	};
};

export default useSpeechRecognition;
