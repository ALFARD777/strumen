"use client";
import Image from "next/image";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
	const handleNavigate = () => {
		window.location.href += `/${product.eng}`;
	};

	return (
		<button
			type="button"
			tabIndex={0}
			className="bg-background-300 rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
			onClick={handleNavigate}
		>
			<div className="relative w-full h-48 sm:h-56">
				<Image
					fill
					src={
						product.imagePaths[0] ||
						"https://placehold.co/600x400?text=Без+Фото"
					}
					alt={product.name}
					className="object-contain drop-shadow-2xl hover:drop-shadow-black/70 transition-all duration-500 mt-2"
				/>
			</div>
			<div className="p-4 text-center bg-background-300">
				<p className="text-lg sm:text-xl font-semibold">{product.name}</p>
			</div>
		</button>
	);
}
