"use client";

import { IconShoppingCartFilled } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddToCart() {
	const [count, setCount] = useState<number>(1);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.currentTarget.value;

		if (/^\d*$/.test(value)) {
			setCount(Number(value));
		}
	};

	return (
		<>
			<div className="bg-background-300 p-2 my-2 rounded-md flex flex-col gap-2">
				<Input
					label="Количество"
					type="number"
					value={count}
					min={1}
					step={1}
					max={1000}
					onChange={handleChange}
					onKeyDown={(e) => {
						if (e.key === "." || e.key === ",") e.preventDefault();
					}}
				/>
				<Button variant="secondary" className="w-full">
					<IconShoppingCartFilled />
					Добавить в корзину
				</Button>
			</div>
			<p className="opacity-50">
				Итоговая стоимость рассчитывается после связи с сотрудником
			</p>
		</>
	);
}
