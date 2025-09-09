import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function uploadFile(folder: string, file: File) {
	const fd = new FormData();

	fd.append("file", file);
	fd.append("path", folder);
	const res = await axios.post("/api/upload", fd, {
		headers: { "Content-Type": "multipart/form-data" },
	});

	return res.data.path;
}

/* prettier-ignore */
const map: Record<string, string> = {
	а: "a",
	б: "b",
	в: "v",
	г: "g",
	д: "d",
	е: "e",
	ё: "yo",
	ж: "zh",
	з: "z",
	и: "i",
	й: "y",
	к: "k",
	л: "l",
	м: "m",
	н: "n",
	о: "o",
	п: "p",
	р: "r",
	с: "s",
	т: "t",
	у: "u",
	ф: "f",
	х: "kh",
	ц: "ts",
	ч: "ch",
	ш: "sh",
	щ: "sch",
	ъ: "",
	ы: "y",
	ь: "",
	э: "e",
	ю: "yu",
	я: "ya",
	" ": "-",
	"-": "-",
};

export function translit(text: string): string {
	return text
		.trim()
		.toLowerCase()
		.split("")
		.map((ch) => {
			if (map[ch] !== undefined) return map[ch];
			if (/[a-z0-9]/i.test(ch)) return ch;

			return "";
		})
		.join("")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "");
}
