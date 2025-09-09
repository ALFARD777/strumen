"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconDeviceFloppy,
	IconEdit,
	IconLoader2,
	IconLogout,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { clearSession, getSession, isAuthenticated } from "@/lib/auth";

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

export default function ProfilePage() {
	const router = useRouter();
	const [user, setUser] = useState<any>(null);
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
			<Container className="justify-center">
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
