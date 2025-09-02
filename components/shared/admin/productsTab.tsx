import { useEffect, useState } from "react";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Table, TableAction, TableColumn } from "../table";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor-wrapper";
import axios from "axios";
import { uploadFile } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  short: string;
  description: string;
  characteristics?: string;
  features?: string;
  imagePaths: string[];
  documentPaths: Array<{ name: string; path: string }>;
  softwareArchivePaths: Array<{ name: string; path: string }>;
  extraCharacteristics: Array<{ key: string; value: string }>;
  createdAt: string;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  url: string;
}

const columns: TableColumn<Product>[] = [
  { key: "short", label: "Название" },
  {
    key: "category",
    label: "Категория",
    render: (row) => row.category?.name || "Без категории",
  },
  {
    key: "createdAt",
    label: "Дата создания",
    render: (row) => new Date(row.createdAt).toLocaleDateString("ru-RU"),
  },
];

const productSchema = z.object({
  name: z.string().min(3, "Минимум 3 символа"),
  short: z.string().min(3, "Минимум 3 символа"),
  description: z.string().min(10, "Минимум 10 символов"),
  characteristics: z.string().optional(),
  features: z.string().optional(),
  imagePaths: z.array(z.string()),
  documentPaths: z.array(
    z.object({
      name: z.string(),
      path: z.string(),
    })
  ),
  softwareArchivePaths: z.array(
    z.object({
      name: z.string(),
      path: z.string(),
    })
  ),
  extraCharacteristics: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    })
  ),
  categoryId: z.number().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      short: "",
      description: "",
      characteristics: "",
      features: "",
      imagePaths: [],
      documentPaths: [],
      softwareArchivePaths: [],
      extraCharacteristics: [],
      categoryId: undefined,
    },
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();

      if (res.ok) {
        setProducts(data.products);
      } else {
        setError(data.error || "Ошибка загрузки товаров");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();

      if (res.ok) {
        setCategories(data.categories);
      }
    } catch {
      console.error("Ошибка загрузки категорий");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editProduct) {
      reset({
        name: editProduct.name,
        short: editProduct.short,
        description: editProduct.description,
        characteristics: editProduct.characteristics || "",
        features: editProduct.features || "",
        imagePaths: editProduct.imagePaths || [],
        documentPaths: editProduct.documentPaths || [],
        softwareArchivePaths: editProduct.softwareArchivePaths || [],
        extraCharacteristics: editProduct.extraCharacteristics || [],
        categoryId: editProduct.categoryId,
      });
    }
  }, [editProduct, reset]);

  const handleEdit = (item: Product) => {
    setEditProduct(item);
  };

  const handleEditSubmit = async (data: ProductForm) => {
    if (!editProduct) return;

    setEditLoading(true);
    try {
      const res = await fetch(`/api/products/${editProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setEditProduct(null);
        reset();
        fetchProducts();
      } else {
        const errorData = await res.json();

        console.error(errorData.error || "Ошибка при обновлении товара");
      }
    } catch {
      console.error("Ошибка сети");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreateSubmit = async (data: ProductForm) => {
    setCreateLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setCreateOpen(false);
        reset();
        fetchProducts();
      } else {
        const errorData = await res.json();

        console.error(errorData.error || "Ошибка при создании товара");
      }
    } catch {
      console.error("Ошибка сети");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCreate = () => {
    setCreateOpen(true);
    reset();
  };

  const handleDelete = async (item: Product) => {
    if (!confirm(`Вы уверены, что хотите удалить товар "${item.name}"?`))
      return;

    try {
      const res = await fetch(`/api/products/${item.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchProducts();
      } else {
        const errorData = await res.json();

        console.error(errorData.error || "Ошибка при удалении товара");
      }
    } catch {
      console.error("Ошибка сети");
    }
  };

  const actions: TableAction<Product>[] = [
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
        <h2 className="text-xl font-bold">Товары</h2>
        <Button variant="outline" className="gap-2" onClick={handleCreate}>
          <IconPlus size={18} /> Добавить товар
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
          data={products}
          actions={actions}
          rowKey={(row) => row.id}
        />
      )}

      {/* Модалка создания */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="min-w-[55vw] max-w-[95vw] max-h-[95vh] w-full overflow-hidden">
          <DialogHeader>
            <DialogTitle>Создать товар</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(95vh-120px)] pr-2 pb-4">
            <form
              className="space-y-4"
              onSubmit={handleSubmit(handleCreateSubmit)}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Название
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Введите название"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="short"
                  className="block text-sm font-medium mb-1"
                >
                  Краткое название
                </label>
                <Input
                  id="short"
                  {...register("short")}
                  placeholder="Введите краткое название"
                />
                {errors.short && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.short.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-1"
                >
                  Описание
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      placeholder="Введите описание"
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="characteristics"
                  className="block text-sm font-medium mb-1"
                >
                  Характеристики
                </label>
                <Controller
                  name="characteristics"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value || ""}
                      placeholder="Введите характеристики"
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="features"
                  className="block text-sm font-medium mb-1"
                >
                  Особенности
                </label>
                <Controller
                  name="features"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value || ""}
                      placeholder="Введите особенности"
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="imagePaths"
                  className="block text-sm font-medium mb-1"
                >
                  Изображения
                </label>
                <div className="space-y-2">
                  {watch("imagePaths")?.map((imagePath, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="file"
                        onChange={async (e) => {
                          try {
                            const file = e.target.files?.[0];

                            if (!file) return;

                            const path = await uploadFile(
                              "public/products",
                              file
                            );

                            const newImages = [
                              ...(watch("imagePaths") || []),
                              path,
                            ];

                            setValue("imagePaths", newImages);
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newImages =
                            watch("imagePaths")?.filter(
                              (_, i) => i !== index
                            ) || [];

                          setValue("imagePaths", newImages);
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newImages = [...(watch("imagePaths") || []), ""];

                      setValue("imagePaths", newImages);
                    }}
                  >
                    <IconPlus size={18} /> Добавить изображение
                  </Button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="documentPaths"
                  className="block text-sm font-medium mb-1"
                >
                  Документы
                </label>
                <div className="space-y-2">
                  {watch("documentPaths")?.map((doc, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Название документа"
                        value={doc.name}
                        onChange={(e) => {
                          const newDocs = [...(watch("documentPaths") || [])];

                          newDocs[index] = {
                            ...newDocs[index],
                            name: e.target.value,
                          };
                          setValue("documentPaths", newDocs);
                        }}
                      />
                      <Input
                        type="file"
                        onChange={async (e) => {
                          try {
                            const file = e.target.files?.[0];

                            if (!file) return;

                            const path = await uploadFile(
                              "public/products",
                              file
                            );

                            const newDocs = [
                              ...(watch("documentPaths") || []),
                              path,
                            ];

                            setValue("documentPaths", newDocs);
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDocs =
                            watch("documentPaths")?.filter(
                              (_, i) => i !== index
                            ) || [];

                          setValue("documentPaths", newDocs);
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newDocs = [
                        ...(watch("documentPaths") || []),
                        { name: "", path: "" },
                      ];

                      setValue("documentPaths", newDocs);
                    }}
                  >
                    <IconPlus size={18} /> Добавить документ
                  </Button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="softwareArchivePaths"
                  className="block text-sm font-medium mb-1"
                >
                  Архивы ПО
                </label>
                <div className="space-y-2">
                  {watch("softwareArchivePaths")?.map((archive, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Название архива"
                        value={archive.name}
                        onChange={(e) => {
                          const newArchives = [
                            ...(watch("softwareArchivePaths") || []),
                          ];

                          newArchives[index] = {
                            ...newArchives[index],
                            name: e.target.value,
                          };
                          setValue("softwareArchivePaths", newArchives);
                        }}
                      />
                      <Input
                        type="file"
                        onChange={async (e) => {
                          try {
                            const file = e.target.files?.[0];

                            if (!file) return;

                            const path = await uploadFile(
                              "public/products",
                              file
                            );

                            const newSoftwares = [
                              ...(watch("softwareArchivePaths") || []),
                              path,
                            ];

                            setValue("softwareArchivePaths", newSoftwares);
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newArchives =
                            watch("softwareArchivePaths")?.filter(
                              (_, i) => i !== index
                            ) || [];

                          setValue("softwareArchivePaths", newArchives);
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newArchives = [
                        ...(watch("softwareArchivePaths") || []),
                        { name: "", path: "" },
                      ];

                      setValue("softwareArchivePaths", newArchives);
                    }}
                  >
                    <IconPlus size={18} /> Добавить архив
                  </Button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="extraCharacteristics"
                  className="block text-sm font-medium mb-1"
                >
                  Дополнительные характеристики
                </label>
                <div className="space-y-2">
                  {watch("extraCharacteristics")?.map((char, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Ключ"
                        value={char.key}
                        onChange={(e) => {
                          const newChars = [
                            ...(watch("extraCharacteristics") || []),
                          ];

                          newChars[index] = {
                            ...newChars[index],
                            key: e.target.value,
                          };
                          setValue("extraCharacteristics", newChars);
                        }}
                      />
                      <Input
                        placeholder="Значение"
                        value={char.value}
                        onChange={(e) => {
                          const newChars = [
                            ...(watch("extraCharacteristics") || []),
                          ];

                          newChars[index] = {
                            ...newChars[index],
                            value: e.target.value,
                          };
                          setValue("extraCharacteristics", newChars);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newChars =
                            watch("extraCharacteristics")?.filter(
                              (_, i) => i !== index
                            ) || [];

                          setValue("extraCharacteristics", newChars);
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newChars = [
                        ...(watch("extraCharacteristics") || []),
                        { key: "", value: "" },
                      ];

                      setValue("extraCharacteristics", newChars);
                    }}
                  >
                    <IconPlus size={18} /> Добавить характеристику
                  </Button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium mb-1"
                >
                  Категория
                </label>
                <select
                  id="categoryId"
                  {...register("categoryId", { valueAsNumber: true })}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? <LoadingSpinner /> : "Создать"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модалка редактирования */}
      <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full overflow-hidden">
          <DialogHeader>
            <DialogTitle>Редактировать товар</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(95vh-120px)] pr-2 pb-4">
            <form
              className="space-y-4"
              onSubmit={handleSubmit(handleEditSubmit)}
            >
              <div>
                <label
                  htmlFor="edit-name"
                  className="block text-sm font-medium mb-1"
                >
                  Название
                </label>
                <Input
                  id="edit-name"
                  {...register("name")}
                  placeholder="Введите название"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="edit-short"
                  className="block text-sm font-medium mb-1"
                >
                  Краткое название
                </label>
                <Input
                  id="edit-short"
                  {...register("short")}
                  placeholder="Введите краткое название"
                />
                {errors.short && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.short.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className="block text-sm font-medium mb-1"
                >
                  Описание
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value || ""}
                      placeholder="Введите описание"
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="edit-characteristics"
                  className="block text-sm font-medium mb-1"
                >
                  Характеристики
                </label>
                <Controller
                  name="characteristics"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value || ""}
                      placeholder="Введите характеристики"
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="edit-features"
                  className="block text-sm font-medium mb-1"
                >
                  Особенности
                </label>
                <Controller
                  name="features"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value || ""}
                      placeholder="Введите особенности"
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="edit-imagePaths"
                  className="block text-sm font-medium mb-1"
                >
                  Изображения
                </label>
                <div className="space-y-2">
                  {watch("imagePaths")?.map((imagePath, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="file"
                        onChange={async (e) => {
                          try {
                            const file = e.target.files?.[0];

                            if (!file) return;

                            const path = await uploadFile(
                              "public/products",
                              file
                            );

                            const newImages = [
                              ...(watch("imagePaths") || []),
                              path,
                            ];

                            setValue("imagePaths", newImages);
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newImages =
                            watch("imagePaths")?.filter(
                              (_, i) => i !== index
                            ) || [];

                          setValue("imagePaths", newImages);
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newImages = [...(watch("imagePaths") || []), ""];

                      setValue("imagePaths", newImages);
                    }}
                  >
                    <IconPlus size={18} /> Добавить изображение
                  </Button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-documentPaths"
                  className="block text-sm font-medium mb-1"
                >
                  Документы
                </label>
                <div className="space-y-2">
                  {watch("documentPaths")?.map((doc, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Название документа"
                        value={doc.name}
                        onChange={(e) => {
                          const newDocs = [...(watch("documentPaths") || [])];

                          newDocs[index] = {
                            ...newDocs[index],
                            name: e.target.value,
                          };
                          setValue("documentPaths", newDocs);
                        }}
                      />
                      <Input
                        type="file"
                        onChange={async (e) => {
                          try {
                            const file = e.target.files?.[0];

                            if (!file) return;

                            const path = await uploadFile(
                              "public/products",
                              file
                            );

                            const newSoftwares = [
                              ...(watch("documentPaths") || []),
                              path,
                            ];

                            setValue("documentPaths", newSoftwares);
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDocs =
                            watch("documentPaths")?.filter(
                              (_, i) => i !== index
                            ) || [];

                          setValue("documentPaths", newDocs);
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newDocs = [
                        ...(watch("documentPaths") || []),
                        { name: "", path: "" },
                      ];

                      setValue("documentPaths", newDocs);
                    }}
                  >
                    <IconPlus size={18} /> Добавить документ
                  </Button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-softwareArchivePaths"
                  className="block text-sm font-medium mb-1"
                >
                  Архивы ПО
                </label>
                <div className="space-y-2">
                  {watch("softwareArchivePaths")?.map((archive, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Название архива"
                        value={archive.name}
                        onChange={(e) => {
                          const newArchives = [
                            ...(watch("softwareArchivePaths") || []),
                          ];

                          newArchives[index] = {
                            ...newArchives[index],
                            name: e.target.value,
                          };
                          setValue("softwareArchivePaths", newArchives);
                        }}
                      />
                      <Input
                        type="file"
                        onChange={async (e) => {
                          try {
                            const file = e.target.files?.[0];

                            if (!file) return;

                            const path = await uploadFile(
                              "public/products",
                              file
                            );

                            const newImages = [
                              ...(watch("softwareArchivePaths") || []),
                              path,
                            ];

                            setValue("softwareArchivePaths", newImages);
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newArchives =
                            watch("softwareArchivePaths")?.filter(
                              (_, i) => i !== index
                            ) || [];

                          setValue("softwareArchivePaths", newArchives);
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newArchives = [
                        ...(watch("softwareArchivePaths") || []),
                        { name: "", path: "" },
                      ];

                      setValue("softwareArchivePaths", newArchives);
                    }}
                  >
                    <IconPlus size={18} /> Добавить архив
                  </Button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-extraCharacteristics"
                  className="block text-sm font-medium mb-1"
                >
                  Дополнительные характеристики
                </label>
                <div className="space-y-2">
                  {watch("extraCharacteristics")?.map((char, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Ключ"
                        value={char.key}
                        onChange={(e) => {
                          const newChars = [
                            ...(watch("extraCharacteristics") || []),
                          ];

                          newChars[index] = {
                            ...newChars[index],
                            key: e.target.value,
                          };
                          setValue("extraCharacteristics", newChars);
                        }}
                      />
                      <Input
                        placeholder="Значение"
                        value={char.value}
                        onChange={(e) => {
                          const newChars = [
                            ...(watch("extraCharacteristics") || []),
                          ];

                          newChars[index] = {
                            ...newChars[index],
                            value: e.target.value,
                          };
                          setValue("extraCharacteristics", newChars);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newChars =
                            watch("extraCharacteristics")?.filter(
                              (_, i) => i !== index
                            ) || [];

                          setValue("extraCharacteristics", newChars);
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newChars = [
                        ...(watch("extraCharacteristics") || []),
                        { key: "", value: "" },
                      ];

                      setValue("extraCharacteristics", newChars);
                    }}
                  >
                    <IconPlus size={18} /> Добавить характеристику
                  </Button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-categoryId"
                  className="block text-sm font-medium mb-1"
                >
                  Категория
                </label>
                <select
                  id="edit-categoryId"
                  {...register("categoryId", { valueAsNumber: true })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditProduct(null)}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={editLoading}>
                  {editLoading ? <LoadingSpinner /> : "Сохранить"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
