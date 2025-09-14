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

const getInitialCart = (): CartItem[] => {
	if (typeof window === "undefined") return [];
	try {
		return JSON.parse(localStorage.getItem("cart") || "[]");
	} catch {
		return [];
	}
};

export const useCart = create<CartStore>((set) => ({
	items: getInitialCart(),
	addToCart: (id, shortName, image, count = 1) =>
		set((state) => {
			const existing = state.items.find((i) => i.id === id);
			const newItems = existing
				? state.items.map((i) =>
						i.id === id ? { ...i, count: i.count + count } : i,
					)
				: [...state.items, { id, shortName, image, count }];
			if (typeof window !== "undefined")
				localStorage.setItem("cart", JSON.stringify(newItems));
			return { items: newItems };
		}),
	removeFromCart: (id) =>
		set((state) => {
			const newItems = state.items.filter((i) => i.id !== id);
			if (typeof window !== "undefined")
				localStorage.setItem("cart", JSON.stringify(newItems));
			return { items: newItems };
		}),
	updateCount: (id, count) =>
		set((state) => {
			const newItems = state.items.map((i) =>
				i.id === id ? { ...i, count: count > 0 ? count : 1 } : i,
			);
			if (typeof window !== "undefined")
				localStorage.setItem("cart", JSON.stringify(newItems));
			return { items: newItems };
		}),
	clearCart: () =>
		set(() => {
			if (typeof window !== "undefined") localStorage.removeItem("cart");
			return { items: [] };
		}),
}));
