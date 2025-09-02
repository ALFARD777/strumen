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
