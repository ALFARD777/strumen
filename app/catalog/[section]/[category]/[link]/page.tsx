import { IconFileTypePdf, IconFileTypeZip, IconInfoCircle } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import PageContent from "@/components/shared/pageContent";
import { Table } from "@/components/shared/table";
import { ButtonLink } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Title } from "@/components/ui/title";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/lib/types";
import AddToCart from "./addToCart";
import PhotoSystem from "./photoSystem";
import Views from "./views";

interface Props {
  params: { link: string; section: string };
}

export default async function Category({ params }: Props) {
  const { link, section } = await params;
  const product: Product | null = await prisma.products.findFirst({
    where: { eng: link },
    orderBy: {
      id: "asc",
    },
    include: {
      category: true,
      documents: true,
      softwares: true,
      extraCharacteristics: true,
      productViews: true,
    },
  });
  if (!product) return notFound();

  const recommendedProducts: Product[] = await prisma.products.findMany({
    where: {
      NOT: { id: product.id },
    },
    orderBy: {
      views: "desc",
    },
    include: {
      category: true,
      documents: true,
      softwares: true,
      extraCharacteristics: true,
      productViews: true,
    },
    take: 3,
  });

  const sectionItem = await prisma.sections.findFirst({
    where: { url: section },
    select: { name: true },
  });

  return (
    <React.Fragment>
      <Views id={product.id} />
      <PageContent
        path={[
          { href: "/", label: "Главная" },
          { href: "/catalog", label: "Каталог" },
          { href: `/catalog/${section}`, label: sectionItem?.name || "Секция" },
          {
            href: `/catalog/${section}/${product.category.url}`,
            label: product?.category.name || "Категория",
          },
          {
            href: `/catalog/${section}/${product.category.url}/${product.eng}`,
            label: product?.short || "Продукт",
          },
        ]}
      >
        <div className="m-2">
          <div className="flex flex-col-reverse md:flex-row">
            <PhotoSystem photos={product.imagePaths} />
            <div className="w-full md:w-7/12">
              <Title className="text-center md:text-left">{product.name}</Title>
              <AddToCart product={product} />
            </div>
          </div>
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Описание</TabsTrigger>
              {product.features && <TabsTrigger value="features">Особенности</TabsTrigger>}
              {(product.characteristics || product.extraCharacteristics) && <TabsTrigger value="characteristics">Характеристики</TabsTrigger>}
              {product.documents.length > 0 && <TabsTrigger value="documents">Документация</TabsTrigger>}
              {product.softwares.length > 0 && <TabsTrigger value="softwares">Программы</TabsTrigger>}
            </TabsList>
            <TabsContent value="description">
              <Title className="text-left">Описание {product.short}:</Title>
              <div
                /** biome-ignore lint/security/noDangerouslySetInnerHtml: <safe code from tiptap editor> */
                dangerouslySetInnerHTML={{ __html: product.description }}
                className="productDescription"
              />
            </TabsContent>
            <TabsContent value="features">
              <Title className="text-left">Особенности {product.short}:</Title>
              <div
                /** biome-ignore lint/security/noDangerouslySetInnerHtml: <safe code from tiptap editor> */
                dangerouslySetInnerHTML={{ __html: product.features || "" }}
                className="productDescription"
              />
            </TabsContent>
            <TabsContent value="characteristics">
              <Title className="text-left">Основные характеристики {product.short}:</Title>
              <div
                /** biome-ignore lint/security/noDangerouslySetInnerHtml: <safe code from tiptap editor> */
                dangerouslySetInnerHTML={{
                  __html: product.characteristics || "",
                }}
                className="productDescription"
              />
              <Title className="text-left mt-4">Доп. характеристики {product.short}:</Title>
              <Table
                columns={[
                  {
                    key: "key",
                    label: "Название",
                  },
                  {
                    key: "value",
                    label: "Значение",
                  },
                ]}
                data={product.extraCharacteristics}
                rowKey={(row) => row.id}
              ></Table>
            </TabsContent>
            <TabsContent value="documents">
              <Title className="text-left">Документация к {product.short}:</Title>
              <div className="flex flex-col gap-2">
                {product.documents.map((document) => (
                  <Link key={document.id} href={document.path} target="_blank" className="flex gap-2 hover:scale-105 transition-all duration-300 underline w-fit">
                    <IconFileTypePdf />
                    <p>{document.name}</p>
                  </Link>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="softwares">
              <Title className="text-left">Программное обеспечение к {product.short}:</Title>
              <div className="flex flex-col gap-2">
                {product.softwares.map((soft) => (
                  <Link key={soft.id} href={soft.path} className="flex gap-2 hover:scale-105 transition-all duration-300 underline w-fit">
                    <IconFileTypeZip />
                    <p>{soft.name}</p>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageContent>
      {recommendedProducts.length > 0 && (
        <PageContent noIndent>
          <div className="mx-2">
            <Title className="text-left">Также рекомендуем:</Title>
            <div className="flex mt-2">
              {recommendedProducts.map((product, index) => (
                <div key={product.id} className="flex w-1/3">
                  <div className="flex gap-2 w-full">
                    <div className="flex-1 flex flex-col">
                      <div className="flex-1 w-full rounded-md justify-center flex bg-gray-100">
                        <Image width={1920} height={1080} src={product.imagePaths[0]} alt={product.short} className="object-cover size-50" />
                      </div>
                      <div className="space-y-2 mt-2">
                        <p>{product.name}</p>
                        <ButtonLink className="w-full" href={product.eng}>
                          <IconInfoCircle />
                          Подробнее
                        </ButtonLink>
                      </div>
                    </div>
                  </div>

                  {index !== recommendedProducts.length - 1 && <div className="w-0.5 rounded-md bg-background-300 self-stretch mx-2" />}
                </div>
              ))}
            </div>
          </div>
        </PageContent>
      )}
    </React.Fragment>
  );
}
