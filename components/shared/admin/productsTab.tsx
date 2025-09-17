import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import axios, { type AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor-wrapper";
import { LoadingSpinner } from "@/components/ui/spinner";
import type { Category, Product } from "@/lib/types";
import { uploadFile } from "@/lib/utils";
import { Table, type TableAction, type TableColumn } from "../table";

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
  description: z.string().min(17, "Минимум 10 символов"),
  characteristics: z.string().optional(),
  features: z.string().optional(),
  imagePaths: z.array(z.string()),
  documents: z.array(z.object({ name: z.string(), path: z.string() })),
  softwares: z.array(z.object({ name: z.string(), path: z.string() })),
  extraCharacteristics: z.array(z.object({ key: z.string(), value: z.string().optional(), ...{} })),
  categoryId: z.number().min(1, "Выберите категорию"),
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
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
      documents: [],
      softwares: [],
      extraCharacteristics: [],
      categoryId: 0,
    },
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/products");
      const data = res.data;

      setProducts(data.products);
    } catch (error) {
      console.error(error);
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get("/api/categories");
      const data = res.data;

      setCategories(data.categories);
    } catch {
      console.error("Ошибка загрузки категорий");
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchCategories, fetchProducts]);

  useEffect(() => {
    if (editProduct) {
      reset({
        name: editProduct.name,
        short: editProduct.short,
        description: editProduct.description,
        characteristics: editProduct.characteristics || "",
        features: editProduct.features || "",
        imagePaths: editProduct.imagePaths || [],
        documents: editProduct.documents || [],
        softwares: editProduct.softwares || [],
        extraCharacteristics: (editProduct.extraCharacteristics || []).map((c) => ({
          key: c.key,
          value: c.value || "",
        })),
        categoryId: editProduct.category.id,
      });
      //setOldArrays({ img: editProduct.imagePaths, docs: editProduct.documents, softwares: editProduct.softwares });
    }
  }, [editProduct, reset]);

  const handleEdit = (item: Product) => {
    setActionError(null);
    setEditProduct(item);
  };

  const handleEditSubmit = async (data: ProductForm) => {
    if (!editProduct) return;

    setEditLoading(true);
    try {
      await axios.put(`/api/products`, { id: editProduct.id, data });

      setEditProduct(null);
      setActionError(null);
      reset({
        name: "",
        short: "",
        description: "",
        characteristics: "",
        features: "",
        imagePaths: [],
        documents: [],
        softwares: [],
        extraCharacteristics: [],
        categoryId: undefined,
      });
      fetchProducts();
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;

      if (error.response?.data?.error) {
        setActionError(error.response.data.error);
      } else if (error.message) {
        setActionError(error.message);
      } else {
        setActionError("Неизвестная ошибка");
      }
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreateSubmit = async (data: ProductForm) => {
    setCreateLoading(true);
    try {
      await axios.post("/api/products", data);

      setCreateOpen(false);
      setActionError(null);

      reset({
        name: "",
        short: "",
        description: "",
        characteristics: "",
        features: "",
        imagePaths: [],
        documents: [],
        softwares: [],
        extraCharacteristics: [],
        categoryId: undefined,
      });
      fetchProducts();
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;

      if (error.response?.data?.error) {
        setActionError(error.response.data.error);
      } else if (error.message) {
        setActionError(error.message);
      } else {
        setActionError("Неизвестная ошибка");
      }
      console.error(err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCreate = () => {
    setCreateOpen(true);
    setActionError(null);

    reset({
      name: "",
      short: "",
      description: "",
      characteristics: "",
      features: "",
      imagePaths: [],
      documents: [],
      softwares: [],
      extraCharacteristics: [],
      categoryId: undefined,
    });
  };

  const handleDelete = (item: Product) => {
    setDeleteProduct(item);
  };

  const confirmDelete = async () => {
    if (!deleteProduct) return;
    setDeleteLoading(true);
    try {
      await axios.delete("/api/products", { data: { id: deleteProduct.id } });

      setDeleteProduct(null);
      fetchProducts();
    } catch (error) {
      console.error(error || "Ошибка при удалении товара");
    } finally {
      setDeleteLoading(false);
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
        <Table columns={columns} data={products} actions={actions} rowKey={(row) => row.id} />
      )}

      {/* Модалка создания */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="min-w-[55vw] max-w-[95vw] max-h-[95vh] w-full overflow-hidden">
          <DialogHeader>
            <DialogTitle>Создать товар</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(95vh-120px)] pr-2 pb-4">
            <form className="space-y-4" onSubmit={handleSubmit(handleCreateSubmit)}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Название
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder='Например, Счетчик статический активной энергии однофазный "Гран-Электро СС-101B"'
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="short" className="block text-sm font-medium mb-1">
                  Краткое название
                </label>
                <Input id="short" {...register("short")} placeholder="Например, Гран-Электро СС-101B" />
                {errors.short && <p className="text-red-500 text-sm mt-1">{errors.short.message}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Описание
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor value={field.value} placeholder="Введите описание" onChange={field.onChange} />
                  )}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label htmlFor="characteristics" className="block text-sm font-medium mb-1">
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
                <label htmlFor="features" className="block text-sm font-medium mb-1">
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
                <label htmlFor="imagePaths" className="block text-sm font-medium mb-1">
                  Изображения
                </label>
                <div className="space-y-2">
                  {watch("imagePaths")?.map((imagePath, index) => (
                    <div key={imagePath} className="flex gap-2">
                      <Input
                        type="file"
                        onChange={async (e) => {
                          try {
                            const file = e.target.files?.[0];

                            if (!file) return;

                            const path = await uploadFile("public/products", file);

                            const newImages = [...(watch("imagePaths") || []), path];

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
                          const newImages = watch("imagePaths")?.filter((_, i) => i !== index) || [];

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
                <label htmlFor="documents" className="block text-sm font-medium mb-1">
                  Документы
                </label>
                <div className="space-y-2">
                  {watch("documents")?.map((doc, index) => (
                    <div key={doc.name} className="flex gap-2">
                      <Input
                        placeholder="Название документа"
                        value={doc.name}
                        onChange={(e) => {
                          const newDocs = [...(watch("documents") || [])];

                          newDocs[index] = {
                            ...newDocs[index],
                            name: e.target.value,
                          };
                          setValue("documents", newDocs);
                        }}
                      />
                      {/* CREATE DOCS */}
                      <Input
                        type="file"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];

                          if (!file) return;

                          try {
                            const path = await uploadFile("public/products", file);
                            const newDocs = [...(watch("documents") || [])];

                            newDocs[index] = {
                              ...newDocs[index],
                              path: path,
                            };
                            setValue("documents", newDocs);
                          } catch (err) {
                            console.error("Ошибка загрузки документа", err);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDocs = watch("documents")?.filter((_, i) => i !== index) || [];

                          setValue("documents", newDocs);
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
                      const newDocs = [...(watch("documents") || []), { name: "", path: "" }];

                      setValue("documents", newDocs);
                    }}
                  >
                    <IconPlus size={18} /> Добавить документ
                  </Button>
                </div>
              </div>

              <div>
                <label htmlFor="softwares" className="block text-sm font-medium mb-1">
                  Архивы ПО
                </label>
                <div className="space-y-2">
                  {watch("softwares")?.map((archive, index) => (
                    <div key={archive.name} className="flex gap-2">
                      <Input
                        placeholder="Название архива"
                        value={archive.name}
                        onChange={(e) => {
                          const newArchives = [...(watch("softwares") || [])];

                          newArchives[index] = {
                            ...newArchives[index],
                            name: e.target.value,
                          };
                          setValue("softwares", newArchives);
                        }}
                      />
                      {/* CREATE SOFT */}
                      <Input
                        type="file"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];

                          if (!file) return;
                          try {
                            const path = await uploadFile("public/products", file);
                            const newArchives = [...(watch("softwares") || [])];

                            newArchives[index] = {
                              ...newArchives[index],
                              path: path,
                            };
                            setValue("softwares", newArchives);
                          } catch (err) {
                            console.error("Ошибка загрузки документа", err);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newArchives = watch("softwares")?.filter((_, i) => i !== index) || [];

                          setValue("softwares", newArchives);
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
                      const newArchives = [...(watch("softwares") || []), { name: "", path: "" }];

                      setValue("softwares", newArchives);
                    }}
                  >
                    <IconPlus size={18} /> Добавить архив
                  </Button>
                </div>
              </div>

              <div>
                <label htmlFor="extraCharacteristics" className="block text-sm font-medium mb-1">
                  Дополнительные характеристики
                </label>
                <div className="space-y-2">
                  {watch("extraCharacteristics")?.map((char, index) => (
                    <div key={char.key} className="flex gap-2">
                      <Input
                        placeholder="Ключ"
                        value={char.key}
                        onChange={(e) => {
                          const newChars = [...(watch("extraCharacteristics") || [])];

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
                          const newChars = [...(watch("extraCharacteristics") || [])];

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
                          const newChars = watch("extraCharacteristics")?.filter((_, i) => i !== index) || [];

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
                      const newChars = [...(watch("extraCharacteristics") || []), { key: "", value: "" }];

                      setValue("extraCharacteristics", newChars);
                    }}
                  >
                    <IconPlus size={18} /> Добавить характеристику
                  </Button>
                </div>
              </div>

              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
                  Категория
                </label>
                <select
                  id="categoryId"
                  {...register("categoryId", { valueAsNumber: true })}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="0">Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
              </div>

              <div className="flex flex-col pt-2 border-t">
                {actionError && <p className="text-red-500 text-right p-2">{actionError}</p>}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit" disabled={createLoading}>
                    {createLoading ? <LoadingSpinner /> : "Создать"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модалка редактирования */}
      <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
        <DialogContent className="min-w-[55vw] max-w-[95vw] max-h-[95vh] w-full overflow-hidden">
          <DialogHeader>
            <DialogTitle>Редактировать товар</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(95vh-120px)] pr-2 pb-4">
            <form className="space-y-4" onSubmit={handleSubmit(handleEditSubmit)}>
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium mb-1">
                  Название
                </label>
                <Input id="edit-name" {...register("name")} placeholder="Введите название" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="edit-short" className="block text-sm font-medium mb-1">
                  Краткое название
                </label>
                <Input id="edit-short" {...register("short")} placeholder="Введите краткое название" />
                {errors.short && <p className="text-red-500 text-sm mt-1">{errors.short.message}</p>}
              </div>

              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium mb-1">
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
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label htmlFor="edit-characteristics" className="block text-sm font-medium mb-1">
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
                <label htmlFor="edit-features" className="block text-sm font-medium mb-1">
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
                <label htmlFor="edit-imagePaths" className="block text-sm font-medium mb-1">
                  Изображения
                </label>
                <div className="space-y-2">
                  {editProduct?.imagePaths.map((imagePath, index) => (
                    <div key={imagePath} className="flex gap-2 items-center justify-between">
                      <p className="bg-background-200 p-2 w-full rounded-md">{imagePath.split("/").pop()}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newImgs = (watch("imagePaths") || []).filter((_, i) => i !== index);

                          setValue("imagePaths", newImgs);
                          setEditProduct({
                            ...editProduct,
                            imagePaths: editProduct.imagePaths.filter((_, i) => i !== index),
                          });
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  ))}
                  {watch("imagePaths")?.map(
                    (imagePath, index) =>
                      !editProduct?.imagePaths.includes(imagePath) && (
                        <div key={imagePath} className="flex gap-2">
                          <Input
                            type="file"
                            onChange={async (e) => {
                              try {
                                const file = e.target.files?.[0];

                                if (!file) return;

                                const path = await uploadFile("public/products", file);

                                const newImages = [...(watch("imagePaths") || []), path];

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
                              const newImages = watch("imagePaths")?.filter((_, i) => i !== index) || [];

                              setValue("imagePaths", newImages);
                            }}
                          >
                            Удалить
                          </Button>
                        </div>
                      ),
                  )}
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
                <label htmlFor="edit-documents" className="block text-sm font-medium mb-1">
                  Документы
                </label>
                <div className="space-y-2">
                  {editProduct?.documents.map((doc, index) => (
                    <div key={doc.id} className="flex gap-2 items-center justify-between">
                      <div className="flex w-full gap-2 bg-background-200 p-2 rounded-md break-words items-center">
                        <p className="border-r border-background w-1/2">{doc.name}</p>
                        <p className="w-1/2">{doc.path.split("/").pop()}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDocs = (watch("documents") || []).filter((_, i) => i !== index);

                          setValue("documents", newDocs);
                          setEditProduct({
                            ...editProduct,
                            documents: editProduct.documents.filter((_, i) => i !== index),
                          });
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  ))}
                  {watch("documents")?.map(
                    (doc, index) =>
                      !editProduct?.documents.some((d) => d.name === doc.name && d.path === doc.path) && (
                        <div key={doc.name} className="flex gap-2">
                          <Input
                            placeholder="Название документа"
                            value={doc.name}
                            onChange={(e) => {
                              const newDocs = [...(watch("documents") || [])];

                              newDocs[index] = {
                                ...newDocs[index],
                                name: e.target.value,
                              };
                              setValue("documents", newDocs);
                            }}
                          />
                          {/* EDIT DOCS */}
                          <Input
                            type="file"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];

                              if (!file) return;

                              try {
                                const path = await uploadFile("public/products", file);
                                const newDocs = [...(watch("documents") || [])];

                                newDocs[index] = {
                                  ...newDocs[index],
                                  path: path,
                                };
                                setValue("documents", newDocs);
                              } catch (err) {
                                console.error("Ошибка загрузки документа", err);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newDocs = watch("documents")?.filter((_, i) => i !== index) || [];

                              setValue("documents", newDocs);
                            }}
                          >
                            Удалить
                          </Button>
                        </div>
                      ),
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newDocs = [...(watch("documents") || []), { name: "", path: "" }];

                      setValue("documents", newDocs);
                    }}
                  >
                    <IconPlus size={18} /> Добавить документ
                  </Button>
                </div>
              </div>

              <div>
                <label htmlFor="edit-softwares" className="block text-sm font-medium mb-1">
                  Архивы ПО
                </label>
                <div className="space-y-2">
                  {editProduct?.softwares.map((archive, index) => (
                    <div key={archive.id} className="flex gap-2 items-center justify-between">
                      <div className="flex w-full gap-2 bg-background-200 p-2 rounded-md break-words items-center">
                        <p className="border-r border-background w-1/2">{archive.name}</p>
                        <p className="w-1/2">{archive.path.split("/").pop()}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newArchives = (watch("softwares") || []).filter((_, i) => i !== index);

                          setValue("softwares", newArchives);
                          setEditProduct({
                            ...editProduct,
                            softwares: editProduct.softwares.filter((_, i) => i !== index),
                          });
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  ))}
                  {watch("softwares")?.map(
                    (archive, index) =>
                      !editProduct?.softwares.some((a) => a.name === archive.name && a.path === archive.path) && (
                        <div key={archive.name} className="flex gap-2">
                          <Input
                            placeholder="Название архива"
                            value={archive.name}
                            onChange={(e) => {
                              const newArchives = [...(watch("softwares") || [])];

                              newArchives[index] = {
                                ...newArchives[index],
                                name: e.target.value,
                              };
                              setValue("softwares", newArchives);
                            }}
                          />
                          {/* EDIT SOFT */}
                          <Input
                            type="file"
                            onChange={async (e) => {
                              try {
                                const file = e.target.files?.[0];

                                if (!file) return;
                                const path = await uploadFile("public/products", file);
                                const newArchives = [...(watch("softwares") || [])];

                                newArchives[index] = {
                                  ...newArchives[index],
                                  path,
                                };
                                setValue("softwares", newArchives);
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
                              const newArchives = watch("softwares")?.filter((_, i) => i !== index) || [];

                              setValue("softwares", newArchives);
                            }}
                          >
                            Удалить
                          </Button>
                        </div>
                      ),
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newArchives = [...(watch("softwares") || []), { name: "", path: "" }];

                      setValue("softwares", newArchives);
                    }}
                  >
                    <IconPlus size={18} /> Добавить архив
                  </Button>
                </div>
              </div>

              <div>
                <label htmlFor="edit-extraCharacteristics" className="block text-sm font-medium mb-1">
                  Дополнительные характеристики
                </label>
                <div className="space-y-2">
                  {watch("extraCharacteristics")?.map((char, index) => (
                    <div key={char.key} className="flex gap-2">
                      <Input
                        placeholder="Ключ"
                        value={char.key}
                        onChange={(e) => {
                          const newChars = [...(watch("extraCharacteristics") || [])];

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
                          const newChars = [...(watch("extraCharacteristics") || [])];

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
                          const newChars = watch("extraCharacteristics")?.filter((_, i) => i !== index) || [];

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
                      const newChars = [...(watch("extraCharacteristics") || []), { key: "", value: "" }];

                      setValue("extraCharacteristics", newChars);
                    }}
                  >
                    <IconPlus size={18} /> Добавить характеристику
                  </Button>
                </div>
              </div>

              <div>
                <label htmlFor="edit-categoryId" className="block text-sm font-medium mb-1">
                  Категория
                </label>
                <select
                  id="edit-categoryId"
                  {...register("categoryId", { valueAsNumber: true })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="0">Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setEditProduct(null)}>
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

      <Dialog open={!!deleteProduct} onOpenChange={(open) => !open && setDeleteProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить товар?</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <p className="opacity-50 text-lg">Заголовок</p>
            <p className="font-thin">{deleteProduct?.name}</p>
          </div>
          <DialogFooter className="flex justify-center">
            <Button type="button" variant="secondary" disabled={deleteLoading} onClick={confirmDelete}>
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
