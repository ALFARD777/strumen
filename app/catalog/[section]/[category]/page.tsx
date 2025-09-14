import { notFound } from "next/navigation";
import PageContent from "@/components/shared/pageContent";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/lib/types";
import ProductCard from "./card";

interface Props {
  params: { category: string; section: string };
}

export default async function Category({ params }: Props) {
  const { category, section } = await params;
  const products: Product[] = await prisma.products.findMany({
    where: { category: { url: category } },
    orderBy: {
      id: "asc",
    },
    include: {
      category: true,
      documents: true,
      softwares: true,
      extraCharacteristics: true,
    },
  });
  const sectionItem = await prisma.sections.findFirst({
    where: { url: section },
    select: { name: true },
  });

  if (products.length === 0) return notFound();

  return (
    <PageContent
      path={[
        { href: "/", label: "Главная" },
        { href: "/catalog", label: "Каталог" },
        { href: `/catalog/${section}`, label: sectionItem?.name || "Секция" },
        {
          href: `/catalog/${section}/${category}`,
          label: products[0]?.category.name || "Категория",
        },
      ]}
      title={products[0]?.category.name}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </PageContent>
  );
}
