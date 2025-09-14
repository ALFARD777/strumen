import { zodResolver } from "@hookform/resolvers/zod";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { Input, Textarea } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import type { News } from "@/lib/types";

const columns: TableColumn<News>[] = [
  { key: "title", label: "Заголовок" },
  {
    key: "createdAt",
    label: "Дата",
    render: (row) => new Date(row.createdAt).toLocaleDateString("ru-RU"),
  },
  {
    key: "published",
    label: "Статус",
    render: (row) => (row.published ? "Опубликовано" : "Черновик"),
  },
];

const newsSchema = z.object({
  title: z.string().min(3, "Минимум 3 символа"),
  content: z.string().min(10, "Минимум 10 символов"),
  published: z.boolean(),
});

type NewsForm = z.infer<typeof newsSchema>;

export default function NewsTab() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editNews, setEditNews] = useState<News | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteNews, setDeleteNews] = useState<News | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createImage, setCreateImage] = useState<File | null>(null);
  const [createImagePreview, setCreateImagePreview] = useState<string | null>(
    null,
  );
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsForm>({
    resolver: zodResolver(newsSchema),
    defaultValues: { title: "", content: "", published: false },
  });

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();

      if (res.ok) {
        setNews(data.news);
      } else {
        setError(data.error || "Ошибка загрузки новостей");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    if (editNews) {
      reset({
        title: editNews.title,
        content: editNews.content,
        published: editNews.published,
      });
    }
  }, [editNews, reset]);

  const handleEdit = (item: News) => {
    setEditNews(item);
    setEditImage(null);
    setEditImagePreview(null);
  };

  const handleEditSubmit = async (data: NewsForm) => {
    if (!editNews) return;
    setEditLoading(true);
    try {
      const formData = new FormData();

      formData.append("id", String(editNews.id));
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("published", String(data.published));
      if (editImage) formData.append("image", editImage);
      const res = await fetch("/api/news", {
        method: "PATCH",
        body: formData,
      });

      if (res.ok) {
        setEditNews(null);
        setEditImage(null);
        setEditImagePreview(null);
        fetchNews();
      } else {
        alert("Ошибка при обновлении новости");
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = (item: News) => {
    setDeleteNews(item);
  };

  const confirmDelete = async () => {
    if (!deleteNews) return;
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteNews.id }),
      });

      if (res.ok) {
        setDeleteNews(null);
        fetchNews();
      } else {
        alert("Ошибка при удалении новости");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreate = () => {
    reset({ title: "", content: "", published: false });
    setCreateImage(null);
    setCreateImagePreview(null);
    setCreateOpen(true);
  };

  const handleCreateSubmit = async (data: NewsForm) => {
    setCreateLoading(true);
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("published", String(data.published));
      if (createImage) formData.append("image", createImage);
      const res = await fetch("/api/news", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setCreateOpen(false);
        setCreateImage(null);
        setCreateImagePreview(null);
        fetchNews();
      } else {
        alert("Ошибка при создании новости");
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCreateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setCreateImage(file);
    setCreateImagePreview(file ? URL.createObjectURL(file) : null);
  };
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setEditImage(file);
    setEditImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const actions: TableAction<News>[] = [
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
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Новости</h2>
        <Button variant="outline" className="gap-2" onClick={handleCreate}>
          <IconPlus size={18} /> Добавить новость
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-8 text-foreground/50 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <Table
          columns={columns}
          data={news}
          actions={actions}
          rowKey={(row) => row.id}
        />
      )}

      {/* Модалка создания */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <form
            className="space-y-2"
            encType="multipart/form-data"
            onSubmit={handleSubmit(handleCreateSubmit)}
          >
            <DialogHeader>
              <DialogTitle>Создать новость</DialogTitle>
            </DialogHeader>
            <Input
              required
              label="Заголовок"
              placeholder="Заголовок новости"
              {...register("title")}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
            <Textarea
              required
              label="Текст новости"
              placeholder="Текст новости"
              {...register("content")}
              aria-invalid={!!errors.content}
              className="min-h-[100px]"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("published")} />
              Опубликовать
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleCreateImageChange}
            />
            {createImagePreview && (
              <Image
                src={createImagePreview}
                alt="Превью"
                width={128}
                height={128}
                className="max-h-32 rounded"
              />
            )}
            <DialogFooter>
              <Button type="submit" disabled={createLoading}>
                {createLoading ? "Создание..." : "Создать"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Отмена
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Модалка редактирования */}
      <Dialog
        open={!!editNews}
        onOpenChange={(open) => !open && setEditNews(null)}
      >
        <DialogContent>
          <form
            className="space-y-2"
            encType="multipart/form-data"
            onSubmit={handleSubmit(handleEditSubmit)}
          >
            <DialogHeader>
              <DialogTitle>Редактировать новость</DialogTitle>
            </DialogHeader>
            <Input
              required
              label="Заголовок"
              placeholder="Заголовок новости"
              {...register("title")}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
            <Textarea
              required
              label="Текст новости"
              placeholder="Текст новости"
              {...register("content")}
              aria-invalid={!!errors.content}
              className="min-h-[100px]"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("published")} />
              Опубликовано
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleEditImageChange}
            />
            {editImagePreview && (
              <Image
                src={editImagePreview}
                alt="Предпросмотр изображения"
                width={128}
                height={128}
                className="max-h-32 w-auto rounded"
              />
            )}
            <DialogFooter>
              <Button type="submit" disabled={editLoading}>
                {editLoading ? "Сохранение..." : "Сохранить"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Отмена
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Модалка подтверждения удаления */}
      <Dialog
        open={!!deleteNews}
        onOpenChange={(open) => !open && setDeleteNews(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить новость?</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <p className="opacity-50 text-lg">Заголовок</p>
            <p className="font-thin">{deleteNews?.title}</p>
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
