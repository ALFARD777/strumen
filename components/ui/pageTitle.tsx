"use client";
import { useEffect } from "react";

export default function TitleSetter({ title }: { title: string | string[] }) {
  useEffect(() => {
    if (Array.isArray(title)) {
      document.title = `${title.join("")} - Strumen - Гран-Система-С`;
    } else {
      document.title = `${title} - Strumen - Гран-Система-С`;
    }
  }, [title]);
  return null;
}
