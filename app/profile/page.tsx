"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconDeviceFloppy,
  IconEdit,
  IconLoader2,
  IconLogout,
} from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { OrderStatus } from "@/components/shared/admin/ordersTab";
import { useAuthStore } from "@/components/store/auth";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Title } from "@/components/ui/title";
import { clearSession, getSession, isAuthenticated } from "@/lib/auth";
import type { Order, User } from "@/lib/types";
import { cn } from "@/lib/utils";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Старый пароль слишком короткий"),
    newPassword: z.string().min(6, "Новый пароль слишком короткий"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

const statusMap: Record<OrderStatus, { text: string; className: string }> = {
  CREATED: {
    text: "Создан",
    className: "bg-blue-100 text-blue-800 border border-blue-800",
  },
  PROCESSING: {
    text: "В обработке",
    className: "bg-yellow-100 text-yellow-800 border border-yellow-800",
  },
  COMPLETED: {
    text: "Завершен",
    className: "bg-green-100 text-green-800 border border-green-800",
  },
  CANCELED: {
    text: "Отменен",
    className: "bg-red-100 text-red-800 border border-red-800",
  },
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [changing, setChanging] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [finishedOrders, setFinishedOrders] = useState<Order[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();

      if (!authenticated) {
        router.push("/");
        toast.error("Вы не авторизованы");

        return;
      }

      const session = await getSession();

      if (session) {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const getActiveOrders = async () => {
      if (!user?.id) return;

      const params = new URLSearchParams();
      params.append("statusFilter", "CREATED");
      params.append("statusFilter", "PROCESSING");

      const res = await axios.get(
        `/api/orders/${user.id}?${params.toString()}`,
      );
      setActiveOrders(res.data.orders);
    };
    const getFinishedOrders = async () => {
      if (!user?.id) return;

      const params = new URLSearchParams();
      params.append("statusFilter", "COMPLETED");
      params.append("statusFilter", "CANCELED");

      const res = await axios.get(
        `/api/orders/${user.id}?${params.toString()}`,
      );
      setFinishedOrders(res.data.orders);
    };
    setLoadingOrders(true);
    getActiveOrders();
    getFinishedOrders();
    setLoadingOrders(false);
  }, [user?.id]);

  const handleLogout = () => {
    clearSession();
    toast.success("Вы вышли из системы");
    router.push("/");
  };

  const handleChangePassword = async (data: ChangePasswordForm) => {
    setChanging(true);
    try {
      const { token } = useAuthStore.getState();
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      });
      const result = await res.json();

      if (res.ok) {
        toast.success("Пароль успешно изменён");
        setUpdatePassword(false);
        reset();
      } else {
        toast.error(result.message || "Ошибка при изменении пароля");
      }
    } catch {
      toast.error("Ошибка сети");
    } finally {
      setChanging(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-lg">Пользователь не найден</div>
      </div>
    );
  }

  return (
    <div className="mt-2 lg:py-12 lg:mt-10 flex justify-center">
      <Container className="justify-center flex flex-col gap-2">
        <div className="bg-background-200 shadow rounded-lg w-full">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-foreground text-center md:text-left mb-4 md:mb-0">
                Профиль пользователя
              </h1>
              <div className="flex flex-col w-full md:flex-row md:justify-end items-center gap-2">
                <Button
                  className="w-full md:w-auto"
                  onClick={() => setUpdatePassword(true)}
                >
                  <IconEdit />
                  Изменить пароль
                </Button>
                <Button
                  variant="secondary"
                  className="w-full md:w-auto"
                  onClick={handleLogout}
                >
                  <IconLogout />
                  Выйти
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Основная информация
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="block text-sm font-medium text-foreground/70">
                      Email
                    </div>
                    <p className="mt-1 text-sm text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <div className="block text-sm font-medium text-foreground/70">
                      Телефон
                    </div>
                    <p className="mt-1 text-sm text-foreground">{user.phone}</p>
                  </div>
                  <div>
                    <div className="block text-sm font-medium text-foreground/70">
                      Дата регистрации
                    </div>
                    <p className="mt-1 text-sm text-foreground">
                      {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background-200 p-2 rounded-md">
          {loadingOrders ? (
            <div className="flex justify-center p-5">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {activeOrders.length > 0 && (
                <>
                  <Title>Активные заказы</Title>
                  <div className="space-y-4 mx-4">
                    {activeOrders.map((order) => {
                      const date = new Date(order.createdAt).toLocaleString(
                        "ru-RU",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      );

                      return (
                        <div key={order.id}>
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">
                              Заказ #{order.id} от {date}
                            </p>
                            <div
                              className={cn(
                                "inline-block px-2 py-0.5 rounded-full text-sm font-medium",
                                statusMap[order.status].className,
                              )}
                            >
                              {statusMap[order.status].text}
                            </div>
                          </div>
                          <ul className="ml-4 mt-1">
                            {order.orderProducts.map((position) => (
                              <li key={position.id} className="pl-2 flex gap-2">
                                <p className="text-gray-500">-</p>
                                <div className="flex w-full justify-between items-center">
                                  <p>{position.product.name}</p>
                                  <p>{position.count}шт.</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {finishedOrders.length > 0 && activeOrders.length > 0 && (
                <div className="m-4 border-t border-gray-300" />
              )}

              {finishedOrders.length > 0 && (
                <>
                  <Title>Завершённые заказы</Title>
                  <div className="space-y-4 mx-4">
                    {finishedOrders.map((order) => {
                      const date = new Date(order.createdAt).toLocaleString(
                        "ru-RU",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      );

                      return (
                        <div key={order.id}>
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">
                              Заказ #{order.id} от {date}
                            </p>
                            <div
                              className={cn(
                                "inline-block px-2 py-0.5 rounded-full text-sm font-medium",
                                statusMap[order.status].className,
                              )}
                            >
                              {statusMap[order.status].text}
                            </div>
                          </div>
                          <ul className="ml-4 mt-1">
                            {order.orderProducts.map((position) => (
                              <li key={position.id} className="pl-2 flex gap-2">
                                <p className="text-gray-500">-</p>
                                <div className="flex w-full justify-between items-center">
                                  <p>{position.product.name}</p>
                                  <p>{position.count}шт.</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Container>
      <Dialog open={updatePassword} onOpenChange={setUpdatePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить пароль</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-2"
            onSubmit={handleSubmit(handleChangePassword)}
          >
            <Input
              required
              type="password"
              label="Старый пароль"
              placeholder="Старый пароль"
              disabled={changing}
              {...register("oldPassword")}
            />
            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.oldPassword.message}
              </p>
            )}
            <Input
              required
              type="password"
              label="Новый пароль"
              placeholder="Новый пароль"
              disabled={changing}
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
            <Input
              required
              type="password"
              label="Повторите новый пароль"
              placeholder="Повторите новый пароль"
              disabled={changing}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
            <Button type="submit" disabled={changing} className="w-full">
              {changing ? (
                <>
                  <IconLoader2 className="animate-spin" /> Сохранение...
                </>
              ) : (
                <>
                  <IconDeviceFloppy /> Сохранить
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
