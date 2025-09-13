import { IconEye, IconPhone } from "@tabler/icons-react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/spinner";
import type { Order } from "@/lib/types";
import { Table, type TableAction, type TableColumn } from "../table";

const columns: TableColumn<Order>[] = [
	{ key: "number", label: "Номер" },
	{ key: "phone", label: "Телефон" },
	{
		key: "createdAt",
		label: "Дата создания",
		render: (row) => new Date(row.createdAt).toLocaleDateString("ru-RU"),
	},
];

export default function OrdersTab() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchOrders = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await axios.get("/api/orders");
			const formattedOrders = res.data.orders.map((o: Order) => ({
				...o,
				number: `#${o.id}`,
				phone: o.guestPhone || o.user?.phone || null,
			}));
			setOrders(formattedOrders);
		} catch (err) {
			console.error(err);

			setError("Ошибка загрузки заказов");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	const handleCall = (order: Order) => {
		const phone = order.guestPhone || order.user?.phone || null;
		const cleanPhone = phone?.replace(/\D/g, "");

		if (cleanPhone) {
			window.location.href = `tel:${phone}`;
		}
	};
	const handleEdit = () => {};

	const actions: TableAction<Order>[] = [
		{
			label: "",
			icon: <IconPhone size={18} />,
			onClick: handleCall,
			className: "text-green-500 hover:text-foreground",
		},
		{
			label: "",
			icon: <IconEye size={18} />,
			onClick: handleEdit,
			className: "text-primary hover:text-foreground",
		},
	];

	return (
		<div className="w-full">
			<h2 className="text-xl font-bold mb-4">Заказы</h2>
			{loading ? (
				<div className="text-center py-8 text-foreground/50 flex justify-center">
					<LoadingSpinner />
				</div>
			) : error ? (
				<div className="text-center py-8 text-red-500">{error}</div>
			) : (
				<Table
					columns={columns}
					data={orders}
					actions={actions}
					rowKey={(row) => row.id}
				/>
			)}
		</div>
	);
	// ) : error ? (
	// 	<div className="text-center py-8 text-red-500">{error}</div>
	// ) : (
	// 	<Table
	// 		columns={columns}
	// 		data={users}
	// 		actions={actions}
	// 		rowKey={(row) => row.id}
	// 	/>
	// );
}
