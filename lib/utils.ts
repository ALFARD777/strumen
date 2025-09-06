import axios from "axios";
import { clsx, type ClassValue } from "clsx";
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
};

export function translit(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? "")
    .join("")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
