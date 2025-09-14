"use client";
import axios from "axios";
import { useEffect } from "react";

export default function Views({ id }: { id: number }) {
	useEffect(() => {
		if (!id) return;

		const scoreView = async () => {
			const key = `product_viewed_${id}`;
			if (!localStorage.getItem(key)) {
				await axios.post("/api/products/views", { id });
				localStorage.setItem(key, "1");
			}
		};
		scoreView();
	}, [id]);

	return null;
}
