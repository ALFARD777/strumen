"use client";
import dynamic from "next/dynamic";

const SearchPage = dynamic(() => import("./search"), { ssr: false });

export default function Search() {
  return <SearchPage />;
}
