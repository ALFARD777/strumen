"use client";
import { IconEye } from "@tabler/icons-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, XAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LoadingSpinner } from "@/components/ui/spinner";
import type { News, Order, Product, User } from "@/lib/types";
import { Table, type TableAction, type TableColumn } from "../table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function StatisticTab() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [ordersRes, productsRes, usersRes, newsRes] = await Promise.all([axios.get("/api/orders"), axios.get("/api/products"), axios.get("/api/users"), axios.get("/api/news")]);

        setOrders(ordersRes.data.orders);
        setProducts(productsRes.data.products);
        setUsers(usersRes.data.users);
        setNews(newsRes.data.news);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data.error || err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Неизвестная ошибка");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full text-center py-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="w-full text-center py-8 text-red-500">{error}</div>;
  }

  const cards = [
    {main: users.length, secondary: "Пользователей зарегистрировано"},
    {main: products.length, secondary: "Товаров создано"},
    {main: news.length, secondary: "Новостей создано"}
  ]

  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-bold mb-4">Статистика</h2>
      <div className="flex gap-2 flex-col lg:flex-row items-center">
        <OrdersChart orders={orders} />
        <ProductsList products={products} />
      </div>
      <div className="flex">
        {cards.map((card, index) => (
  <React.Fragment key={card.secondary}>
    <div className="w-1/3 p-2 flex flex-col justify-center items-center gap-1">
      <p className="text-center whitespace-pre-line">
        {card.secondary.replace(" ", "\n")}
      </p>
      <p className="text-3xl font-extrabold">{card.main}</p>
    </div>
    {index !== cards.length - 1 && <div className="w-0.5 bg-background rounded-full" />}
  </React.Fragment>
))}

      </div>
    </div>
  );
}

function OrdersChart({ orders }: { orders: Order[] }) {
  const chartData = [
    { status: "created", orders: orders.filter((o) => o.status === "CREATED").length, fill: "var(--color-blue-500)" },
    { status: "processing", orders: orders.filter((o) => o.status === "PROCESSING").length, fill: "var(--color-yellow-500)" },
    { status: "completed", orders: orders.filter((o) => o.status === "COMPLETED").length, fill: "var(--color-green-500)" },
    { status: "canceled", orders: orders.filter((o) => o.status === "CANCELED").length, fill: "var(--color-red-500)" },
  ];

  const chartConfig = {
    orders: {
      label: "Заказы",
    },
    created: {
      label: "Создан",
      color: "var(--chart-1)",
    },
    processing: {
      label: "В обработке",
      color: "var(--chart-2)",
    },
    completed: {
      label: "Завершен",
      color: "var(--chart-3)",
    },
    canceled: {
      label: "Отменен",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] w-full lg:w-1/3">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie data={chartData} dataKey="orders" nameKey="status" innerRadius={60} strokeWidth={6} isAnimationActive={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                      {orders.length.toLocaleString()}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                      Заказы
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

function ProductsList({ products }: { products: Product[] }) {
  const [watchProduct, setWatchProduct] = useState<Product | null>(null);
  const handleWatch = (product: Product) => {
    setWatchProduct(product);
  };

  const columns: TableColumn<Product>[] = [
    { key: "short", label: "Название" },
    {
      key: "views",
      label: "Просмотры",
    },
    {
      key: "createdAt",
      label: "Дата создания",
      render: (row) => new Date(row.createdAt).toLocaleDateString("ru-RU"),
    },
  ];

  const actions: TableAction<Product>[] = [
    {
      label: "",
      icon: <IconEye size={18} />,
      onClick: handleWatch,
      className: "text-primary hover:text-foreground",
    },
  ];

  return (
    <React.Fragment>
      <div className="max-h-[1000px] lg:max-h-[250px] overflow-auto w-full"><Table columns={columns} data={products} actions={actions} rowKey={(row) => row.id} /></div>
      {watchProduct &&
      <Dialog open={!!watchProduct} onOpenChange={() => setWatchProduct(null)}>
        <DialogContent className="max-w-[95vw] w-full min-w-[50vw]">
          <DialogHeader><DialogTitle>Подробности просмотров</DialogTitle></DialogHeader>
          {watchProduct.views > 0 ? <ViewsChart product={watchProduct} /> : <p>У товара отсутствуют просмотры</p>}
        </DialogContent>
      </Dialog>}
    </React.Fragment>
  );
}

function ViewsChart({product}: {product: Product}) {
const chartData = product.productViews.map(day => ({
  date: new Date(day.date).toLocaleDateString("ru-RU"),
  views: Number(day.count),
}));

  const chartConfig = {
    views: {
      label: "Просмотры",
      color: "var(--color-primary)",
    }
  } satisfies ChartConfig

  return <ChartContainer config={chartConfig}>
    <BarChart accessibilityLayer data={chartData}>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
      <Bar dataKey="views" fill="var(--color-primary)" radius={8} />
    </BarChart>
  </ChartContainer>
}
