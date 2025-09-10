import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";

export const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const fontLack = localFont({
	src: "../public/fonts/lack.woff2",
	variable: "--font-lack",
});
