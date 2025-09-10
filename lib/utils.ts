import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Функция загрузки файла на сервер (Front-end)
 * @param folder - месторасположение загружаемого файла, включая public папку
 * @param file - файл для загрузки
 */
export async function uploadFile(folder: string, file: File) {
	const fd = new FormData();

	fd.append("file", file);
	fd.append("path", folder);
	const res = await axios.post("/api/upload", fd, {
		headers: { "Content-Type": "multipart/form-data" },
	});

	return res.data.path;
}

/**
 * Обрезает текст до предпросмотра, не разрывая слова и предложения.
 * Если текст длиннее maxLength, обрезает по ближайшему завершённому предложению или слову и добавляет троеточие.
 * @param text - исходный текст
 * @param maxLength - максимальная длина предпросмотра (по умолчанию 480 символов)
 * @returns обрезанный текст с троеточием, если был обрезан
 */
export function previewText(text: string, maxLength: number = 480): string {
	if (!text || text.length <= maxLength) return text;

	const sentenceEnd = text.lastIndexOf(".", maxLength);

	if (sentenceEnd !== -1 && sentenceEnd > maxLength * 0.5) {
		return `${text.slice(0, sentenceEnd)}...`;
	}

	const lastSpace = text.lastIndexOf(" ", maxLength);

	if (lastSpace !== -1 && lastSpace > maxLength * 0.5) {
		return `${text.slice(0, lastSpace)}...`;
	}

	return `${text.slice(0, maxLength)}...`;
}

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

/**
 * Переводит текст в латинский траслит для создания ссылок.
 * @param text - исходный текст
 * @returns строку с латиницей текста
 */
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
