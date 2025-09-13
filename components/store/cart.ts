import { create } from "zustand";

type CartItem = { id: number; shortName: string; image: string; count: number };

type CartStore = {
	items: CartItem[];
	addToCart: (
		id: number,
		shortName: string,
		image: string,
		count?: number,
	) => void;
	removeFromCart: (id: number) => void;
	updateCount: (id: number, count: number) => void;
	clearCart: () => void;
};

export const useCart = create<CartStore>((set) => ({
	items: JSON.parse(localStorage.getItem("cart") || "[]"),
	addToCart: (id, shortName, image, count = 1) =>
		set((state) => {
			const existing = state.items.find((i) => i.id === id);
			const newItems = existing
				? state.items.map((i) =>
						i.id === id ? { ...i, count: i.count + count } : i,
					)
				: [...state.items, { id, shortName, image, count }];
			localStorage.setItem("cart", JSON.stringify(newItems));
			return { items: newItems };
		}),
	removeFromCart: (id) =>
		set((state) => {
			const newItems = state.items.filter((i) => i.id !== id);
			localStorage.setItem("cart", JSON.stringify(newItems));
			return { items: newItems };
		}),
	updateCount: (id, count) =>
		set((state) => {
			const newItems = state.items.map((i) =>
				i.id === id ? { ...i, count: count > 0 ? count : 1 } : i,
			);
			localStorage.setItem("cart", JSON.stringify(newItems));
			return { items: newItems };
		}),
	clearCart: () =>
		set(() => {
			localStorage.removeItem("cart");
			return { items: [] };
		}),
}));
