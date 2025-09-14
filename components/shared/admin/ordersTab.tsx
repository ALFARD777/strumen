import { IconEye, IconPhone } from "@tabler/icons-react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/spinner";
import type { Order } from "@/lib/types";
import { Table, type TableAction, type TableColumn } from "../table";

const columns: TableColumn<Order>[] = [
	{ key: "number", label: "Номер" },
	{ key: "phone", label: "Телефон" },
	{ key: "statusText", label: "Статус" },
	{
		key: "createdAt",
		label: "Дата создания",
		render: (row) => new Date(row.createdAt).toLocaleDateString("ru-RU"),
	},
];

export enum OrderStatus {
	CREATED = "CREATED",
	PROCESSING = "PROCESSING",
	COMPLETED = "COMPLETED",
	CANCELED = "CANCELED",
}

export default function OrdersTab() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [watchOrder, setWatchOrder] = useState<Order | null>(null);
	const [statusChanging, setStatusChanging] = useState<boolean>(false);

	const fetchOrders = useCallback(async () => {
		setLoading(true);
		setError(null);

		const statusMap: Record<OrderStatus, string> = {
			CREATED: "Создан",
			PROCESSING: "В обработке",
			COMPLETED: "Завершен",
			CANCELED: "Отменен",
		};

		try {
			const res = await axios.get("/api/orders");
			const formattedOrders = res.data.orders.map((o: Order) => ({
				...o,
				number: `#${o.id}`,
				phone: o.guestPhone || o.user?.phone || null,
				statusText: statusMap[o.status],
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

	const handleCall = (order: Order | null) => {
		if (!order) return;
		const phone = order.guestPhone || order.user?.phone || null;
		const cleanPhone = phone?.replace(/\D/g, "");

		if (cleanPhone) {
			window.location.href = `tel:${phone}`;
		}
	};

	const handleWatch = (order: Order) => {
		setWatchOrder(order);
	};

	const handleChangeStatus = async (status: OrderStatus) => {
		if (!watchOrder) return;
		setStatusChanging(true);
		try {
			await axios.put("/api/orders", { id: watchOrder.id, status: status });
			toast.success("Статус обновлен");
			setWatchOrder(null);
			fetchOrders();
		} catch (err) {
			console.error(err);
			toast.error("Ошибка обновления статуса");
		} finally {
			setStatusChanging(false);
		}
	};

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
			onClick: handleWatch,
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

			<Dialog
				open={!!watchOrder}
				onOpenChange={(open) => !open && setWatchOrder(null)}
			>
				<DialogContent className="min-w-[55vw] max-w-[95vw] max-h-[95vh] w-full overflow-hidden">
					<DialogHeader>
						<DialogTitle>Содержимое заказа</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-2 overflow-y-auto">
						{watchOrder?.orderProducts.map((position) => (
							<div
								key={position.product.id}
								className="bg-background-200 p-2 rounded-md flex justify-between"
							>
								<p>{position.product.name}</p>
								<p>{position.count}шт.</p>
							</div>
						))}
					</div>
					<DialogFooter>
						<Button variant="ghost" onClick={() => setWatchOrder(null)}>
							Отмена
						</Button>
						<Button
							className="bg-green-500 hover:text-green-500"
							onClick={() => handleCall(watchOrder || null)}
						>
							Позвонить
						</Button>
						{!statusChanging ? (
							watchOrder?.status !== "CANCELED" &&
							watchOrder?.status !== "COMPLETED" && (
								<Button
									variant="secondary"
									onClick={() => handleChangeStatus(OrderStatus.CANCELED)}
								>
									Закрыть
								</Button>
							)
						) : (
							<Button disabled variant="secondary">
								Изменение статуса...
							</Button>
						)}
						{!statusChanging ? (
							watchOrder?.status === "CREATED" ? (
								<Button
									onClick={() => handleChangeStatus(OrderStatus.PROCESSING)}
								>
									Принять
								</Button>
							) : watchOrder?.status === "PROCESSING" ? (
								<Button
									onClick={() => handleChangeStatus(OrderStatus.COMPLETED)}
								>
									Завершить
								</Button>
							) : (
								<Button
									onClick={() => handleChangeStatus(OrderStatus.PROCESSING)}
								>
									В обработку
								</Button>
							)
						) : (
							<Button disabled>Изменение статуса...</Button>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
