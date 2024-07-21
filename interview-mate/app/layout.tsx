import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Interview Mate",
	description: "With you before, during and after interview",
};
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<ClerkProvider
				appearance={{
					layout: {
						logoImageUrl: "/icons/logo.svg",
						socialButtonsVariant: "iconButton",
					},
					variables: {
						colorPrimary: "#00a658",
					},
				}}>
				<body className={`${inter.className} `}>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						enableSystem
						disableTransitionOnChange>
						<Toaster />
						{children}
					</ThemeProvider>
				</body>
			</ClerkProvider>
		</html>
	);
}
