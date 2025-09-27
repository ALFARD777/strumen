"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconUserFilled } from "@tabler/icons-react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Turnstile from "react-turnstile";
import { toast } from "sonner";
import { z } from "zod";
import { useAuthStore } from "@/components/store/auth";
import { isAuthenticated, saveSession } from "@/lib/auth";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input, InputMask } from "../ui/input";

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

const registerSchema = z
  .object({
    phone: z.string().regex(/^\+375 \((29|44|25|17)\) \d{3}-\d{2}-\d{2}$/, "Введите корректный номер телефона"),
    email: z.string().email("Введите корректный email"),
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthButton({ primary }: { primary?: boolean }) {
  const router = useRouter();
  const [openAuth, setOpenAuth] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [captchaState, setCaptchaState] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [registerError, setRegisterError] = useState<string>("");

  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      await isAuthenticated();
    };

    checkAuth();
  }, []);

  const handleProfile = () => {
    router.push("/profile");
  };

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setAuthError("");
      const response = await axios.post("/api/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        toast.success("Успешная авторизация");
        setOpenAuth(false);
        resetForms();

        saveSession(response.data.token, response.data.user);

        return;
      }

      setAuthError(response.data?.error || "Ошибка авторизации");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data?.error) {
        setAuthError(error.response.data.error);
      } else {
        setAuthError("Ошибка соединения с сервером");
      }
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      setRegisterError("");
      const response = await axios.post("/api/auth/register", {
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Успешная регистрация");
        setOpenRegister(false);
        resetForms();

        saveSession(response.data.token, response.data.user);

        return;
      }

      setRegisterError(response.data?.error || "Ошибка регистрации");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data?.error) {
        setAuthError(error.response.data.error);
      } else {
        setAuthError("Ошибка соединения с сервером");
      }
    }
  };

  const resetForms = () => {
    loginForm.reset();
    registerForm.reset();
    setCaptchaState(false);
    setAuthError("");
    setRegisterError("");
  };

  return (
    <>
      {isLoggedIn ? (
        <Button variant="outline" onClick={handleProfile}>
          <IconUserFilled />
          Профиль
        </Button>
      ) : (
        <Button
          variant={!primary ? "outline" : "default"}
          onClick={() => {
            setOpenAuth(true);
          }}
        >
          <IconUserFilled />
          Вход
        </Button>
      )}

      {/* Авторизация */}
      <Dialog
        open={openAuth}
        onOpenChange={(open) => {
          setOpenAuth(open);
          if (!open) resetForms();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Авторизация</DialogTitle>
            <DialogDescription>
              После авторизации вы получите доступ к личному кабинету и сможете управлять вашими заказами.
            </DialogDescription>
            <form className="space-y-2" onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{authError}</p>
                </div>
              )}

              <Input
                required
                type="email"
                label="Email"
                placeholder="example@gmail.com"
                {...loginForm.register("email")}
                className={loginForm.formState.errors.email ? "border-red-500" : ""}
              />
              {loginForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
              )}

              <Input
                required
                type="password"
                label="Пароль"
                placeholder="Пароль"
                {...loginForm.register("password")}
                className={loginForm.formState.errors.password ? "border-red-500" : ""}
              />
              {loginForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
              )}

              <div className="flex justify-center">
                <Turnstile
                  sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string}
                  onSuccess={() => {
                    setCaptchaState(true);
                  }}
                  onExpire={() => {
                    setCaptchaState(false);
                  }}
                />
              </div>

              <Button type="submit" disabled={!captchaState || loginForm.formState.isSubmitting} className="w-full">
                {loginForm.formState.isSubmitting ? "Вход..." : "Войти"}
              </Button>
            </form>

            <DialogFooter>
              <div className="flex gap-1 w-full">
                <p>Нет аккаунта?</p>
                <button
                  type="button"
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => {
                    setOpenAuth(false);
                    setOpenRegister(true);
                    resetForms();
                  }}
                >
                  Регистрация
                </button>
              </div>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Регистрация */}
      <Dialog
        open={openRegister}
        onOpenChange={(open) => {
          setOpenRegister(open);
          if (!open) resetForms();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Регистрация</DialogTitle>
            <DialogDescription>
              После регистрации вы получите доступ к личному кабинету и сможете управлять вашими заказами.
            </DialogDescription>
            <form className="space-y-2" onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
              {registerError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{registerError}</p>
                </div>
              )}

              <Controller
                name="phone"
                control={registerForm.control}
                render={({ field }) => (
                  <InputMask
                    required
                    label="Номер телефона"
                    mask="+375 (00) 000-00-00"
                    placeholder="+375 (__) __-__-__"
                    type="tel"
                    className={registerForm.formState.errors.phone ? "border-red-500" : ""}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {registerForm.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.phone.message}</p>
              )}

              <div>
                <Input
                  required
                  type="email"
                  label="Email"
                  placeholder="example@gmail.com"
                  {...registerForm.register("email")}
                  className={registerForm.formState.errors.email ? "border-red-500" : ""}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Input
                  required
                  type="password"
                  label="Пароль"
                  placeholder="Пароль"
                  {...registerForm.register("password")}
                  className={registerForm.formState.errors.password ? "border-red-500" : ""}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <Input
                  required
                  type="password"
                  label="Повторите пароль"
                  placeholder="Повторите пароль"
                  {...registerForm.register("confirmPassword")}
                  className={registerForm.formState.errors.confirmPassword ? "border-red-500" : ""}
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex justify-center">
                <Turnstile
                  sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string}
                  onSuccess={() => {
                    setCaptchaState(true);
                  }}
                  onExpire={() => {
                    setCaptchaState(false);
                  }}
                />
              </div>

              <Button type="submit" disabled={!captchaState || registerForm.formState.isSubmitting} className="w-full">
                {registerForm.formState.isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>

            <DialogFooter>
              <div className="flex gap-1 w-full">
                <p>Уже есть аккаунт?</p>
                <button
                  type="button"
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => {
                    setOpenRegister(false);
                    setOpenAuth(true);
                    resetForms();
                  }}
                >
                  Войти
                </button>
              </div>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
