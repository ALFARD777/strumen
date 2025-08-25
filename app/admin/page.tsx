"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import UsersTab from "@/components/shared/admin/usersTab";
import OrdersTab from "@/components/shared/admin/ordersTab";
import PositionsTab from "@/components/shared/admin/positionsTab";
import StatisticTab from "@/components/shared/admin/statisticTab";
import Container from "@/components/ui/container";
import { getSession, isAuthenticated } from "@/lib/auth";
import NewsTab from "@/components/shared/admin/newsTab";
import { LoadingSpinner } from "@/components/ui/spinner";

const tabs = [
  { name: "Статистика", key: "statistic" },
  { name: "Пользователи", key: "users" },
  { name: "Заказы", key: "orders" },
  { name: "Товары", key: "positions" },
  { name: "Новости", key: "news" },
];

const tabContent: Record<string, JSX.Element> = {
  statistic: <StatisticTab />,
  users: <UsersTab />,
  orders: <OrdersTab />,
  positions: <PositionsTab />,
  news: <NewsTab />,
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("statistic");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTab =
      typeof window !== "undefined"
        ? localStorage.getItem("activeAdminTab")
        : null;

    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeAdminTab", activeTab);
    }
  }, [activeTab]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();

      if (!authenticated) {
        router.push("/");
        toast.error("Вы не авторизованы");

        return;
      }

      const session = await getSession();

      if (!session) {
        router.push("/");
        toast.error("Вы не авторизованы");

        return;
      }

      if (!session.user.isAdmin) {
        router.push("/");
        toast.error("У вас нет доступа к админ-панели");

        return;
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center sm:py-12 mt-5 sm:mt-10">
      <nav className="w-full">
        <Container className="mx-auto px-2 flex flex-col sm:flex-row gap-2 sm:gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`flex-1 text-center px-4 py-2 transition-colors rounded-md md:rounded-t-md sm:rounded-none sm:rounded-t-md font-medium text-base cursor-pointer
                ${activeTab === tab.key ? "text-blue-600 bg-background-200" : "text-foreground/70 hover:bg-background-200"}
                `}
              type="button"
              onClick={() => handleTabClick(tab.key)}
              onMouseEnter={() => setHoveredTab(tab.key)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              {tab.name}
            </button>
          ))}
        </Container>
      </nav>
      <Container className="px-2">
        <div
          className={clsx(
            "rounded-md mt-2 md:mt-0 md:rounded-md p-6 w-full min-h-[200px] bg-background-200 flex items-center justify-center text-lg text-foreground/70",
            (hoveredTab === tabs[0].key || activeTab === tabs[0].key) &&
              "md:rounded-tl-none",
            (hoveredTab === tabs[tabs.length - 1].key ||
              activeTab === tabs[tabs.length - 1].key) &&
              "md:rounded-tr-none"
          )}
        >
          {tabContent[activeTab]}
        </div>
      </Container>
    </div>
  );
}
