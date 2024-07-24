import { useState, useEffect, useRef } from "react";

const useSpeechRecognition = () => {
	const [text, setText] = useState("");
	const [isListening, setIsListening] = useState(false);
	const recognitionRef = useRef<SpeechRecognition | null>(null);
	const hasRecognitionSupport =
		typeof window !== "undefined" && "webkitSpeechRecognition" in window;

	useEffect(() => {
		if (hasRecognitionSupport) {
			const SpeechRecognition = (window as any).webkitSpeechRecognition;
			const recognition = new SpeechRecognition();
			recognition.continuous = true;
			recognition.lang = "en-US";

			recognition.onresult = (event: SpeechRecognitionEvent) => {
				const lastResultIndex = event.results.length - 1;
				const result = event.results[lastResultIndex][0].transcript;
				setText(result);
			};

			recognitionRef.current = recognition;
		}
	}, [hasRecognitionSupport]);

	const startListening = () => {
		if (recognitionRef.current) {
			setText("");
			recognitionRef.current.start();
			setIsListening(true);
		} else {
			console.error("SpeechRecognition instance is not initialized");
		}
	};

	const stopListening = () => {
		if (recognitionRef.current) {
			recognitionRef.current.stop();
			setIsListening(false);
		} else {
			console.error("SpeechRecognition instance is not initialized");
		}
	};

	return {
		text,
		startListening,
		stopListening,
		hasRecognitionSupport,
		isListening,
	};
};

export default useSpeechRecognition;
