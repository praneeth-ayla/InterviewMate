"use client";
import useTranslator from "@/components/Translator";
import React from "react";

export default function page() {
	const { text } = useTranslator();
	return <div>speech text:{text}</div>;
}
