import { zodResolver } from "@hookform/resolvers/zod";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Table,
  type TableAction,
  type TableColumn,
} from "@/components/shared/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, InputMask } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";

interface User {
  id: number;
  email: string;
  phone: string;
  createdAt: string;
  isAdmin: boolean;
}

const columns: TableColumn<User>[] = [
  { key: "email", label: "Email" },
  { key: "phone", label: "Телефон" },
  {
    key: "createdAt",
    label: "Дата регистрации",
    render: (row) => new Date(row.createdAt).toLocaleDateString("ru-RU"),
  },
  {
    key: "isAdmin",
    label: "Роль",
    render: (row) => (row.isAdmin ? "Админ" : "Пользователь"),
  },
];

const editUserSchema = z.object({
  email: z.string().email("Введите корректный email"),
  phone: z
    .string()
    .regex(
      /^\+375 \(\d{2}\) \d{3}-\d{2}-\d{2}$/,
      "Введите телефон в формате +375 (00) 000-00-00",
    ),
  isAdmin: z.boolean(),
});

type EditUserForm = z.infer<typeof editUserSchema>;

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditUserForm>({
    resolver: zodResolver(editUserSchema),
    defaultValues: { email: "", phone: "", isAdmin: false },
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
      setError("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (editUser) {
      reset({
        email: editUser.email,
        phone: editUser.phone,
        isAdmin: editUser.isAdmin,
      });
    }
  }, [editUser, reset]);

  const handleEdit = (user: User) => {
    setEditUser(user);
  };

  const handleEditSubmit = async (data: EditUserForm) => {
    if (!editUser) return;
    setEditLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editUser.id,
          ...data,
        }),
      });

      if (res.ok) {
        setEditUser(null);
        fetchUsers();
      } else {
        alert("Ошибка при обновлении пользователя");
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = (user: User) => {
    setDeleteUser(user);
  };

  const confirmDelete = async () => {
    if (!deleteUser) return;
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteUser.id }),
      });

      if (res.ok) {
        setDeleteUser(null);
        fetchUsers();
      } else {
        alert("Ошибка при удалении пользователя");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const actions: TableAction<User>[] = [
    {
      label: "",
      icon: <IconEdit size={18} />,
      onClick: handleEdit,
      className: "text-primary hover:text-foreground",
    },
    {
      label: "",
      icon: <IconTrash size={18} />,
      onClick: handleDelete,
      className: "text-secondary hover:text-foreground",
    },
  ];

  return (
    <div className="w-full ">
      <h2 className="text-xl font-bold mb-4">Пользователи</h2>
      {loading ? (
        <div className="text-center py-8 text-foreground/50 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <Table
          columns={columns}
          data={users}
          actions={actions}
          rowKey={(row) => row.id}
        />
      )}

      {/* Модалка редактирования */}
      <Dialog
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
      >
        <DialogContent>
          <form className="space-y-2" onSubmit={handleSubmit(handleEditSubmit)}>
            <DialogHeader>
              <DialogTitle>Редактировать пользователя</DialogTitle>
            </DialogHeader>
            <Input
              required
              type="email"
              label="Email"
              placeholder="example@gmail.com"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <InputMask
                  required
                  label="Номер телефона"
                  mask={"+375 (00) 000-00-00"}
                  placeholder="+375 (__) ___-__-__"
                  type="tel"
                  {...field}
                  aria-invalid={!!errors.phone}
                />
              )}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!control._formValues?.isAdmin}
                onChange={(e) => setValue("isAdmin", e.target.checked)}
              />
              Назначить менеджером
            </label>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Отмена
                </Button>
              </DialogClose>
              <Button type="submit" disabled={editLoading}>
                {editLoading ? "Сохранение..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Модалка подтверждения удаления */}
      <Dialog
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить пользователя?</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <p className="opacity-50 text-lg">Пользователь</p>
            <p className="font-thin">{deleteUser?.email}</p>
            <p className="opacity-50 text-lg">Телефон</p>
            <p className="font-thin">{deleteUser?.phone}</p>
          </div>
          <DialogFooter className="flex justify-center">
            <Button
              type="button"
              variant="secondary"
              disabled={deleteLoading}
              onClick={confirmDelete}
            >
              {deleteLoading ? "Удаление..." : "Удалить"}
            </Button>
            <DialogClose asChild>
              <Button type="button">Отмена</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
