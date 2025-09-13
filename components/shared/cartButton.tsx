import { IconBasketFilled, IconTrashFilled, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "../store/cart";
import { Button } from "../ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "../ui/drawer";
import { Input } from "../ui/input";

export default function CartButton() {
	const [opened, setOpened] = useState<boolean>(false);
	const { items, updateCount, removeFromCart, clearCart } = useCart();

	return (
		<>
			<Button
				aria-label="Корзина"
				onClick={() => setOpened(!opened)}
				variant="icon"
				size="icon"
				id="cartButton"
				className="relative"
			>
				<IconBasketFilled />
				{items.length > 0 && (
					<div className="absolute bottom-2 right-2 bg-secondary rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">
						{items.length}
					</div>
				)}
			</Button>
			<Drawer
				open={opened}
				direction="right"
				onOpenChange={(v) => !v && setOpened(false)}
			>
				<DrawerContent className="px-2">
					<DrawerHeader>
						<div className="flex justify-between">
							<DrawerTitle>Корзина</DrawerTitle>
							<DrawerClose
								onClick={() => setOpened(false)}
								className="cursor-pointer"
							>
								<IconX />
							</DrawerClose>
						</div>
					</DrawerHeader>
					<DrawerDescription className="text-center">
						{items.length > 0
							? "Ниже располагается содержимое вашей корзины. Вы можете отредактировать количество товаров или полностью удалить из списка. После, есть возможность оформления заказа"
							: "Ваша корзина пуста. Перейдите на страницу любого товара для добавления"}
					</DrawerDescription>
					<div className="flex flex-col h-full justify-between m-2">
						<div>
							{items.map((item) => (
								<div
									key={item.id}
									className="flex gap-2 items-center justify-between bg-background-200 p-2 rounded-md"
								>
									<div className="flex gap-2 items-center">
										<div className="size-30">
											<Image
												src={item.image}
												width={200}
												height={200}
												alt={item.shortName}
												className="rounded-md"
											/>
										</div>
										<p className="font-bold text-lg break-words max-w-60">
											{item.shortName}
										</p>
									</div>
									<div className="flex gap-2">
										<Input
											row
											type="number"
											label="Кол-во"
											value={item.count}
											min={1}
											step={1}
											max={1000}
											onChange={(e) =>
												updateCount(item.id, Number(e.currentTarget.value))
											}
											className="max-w-20"
										/>
										<Button
											variant="secondary"
											onClick={() => removeFromCart(item.id)}
										>
											<IconTrashFilled />
										</Button>
									</div>
								</div>
							))}
						</div>
						<div className="flex flex-col gap-2">
							<Button
								onClick={() => clearCart()}
								variant="ghost"
								className="w-full"
								disabled={items.length === 0}
							>
								Очистить корзину
							</Button>
							<Button
								onClick={() => clearCart()}
								variant="default"
								className="w-full"
								disabled={items.length === 0}
							>
								Заказать
							</Button>
						</div>
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
}
