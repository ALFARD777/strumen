import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageContent from "@/components/shared/pageContent";

interface Props {
  params: { link: string; section: string };
}

export default async function Category({ params }: Props) {
  const { link, section } = params;
  const product = await prisma.products.findFirst({
    where: { eng: link },
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

  if (!product) return notFound();

  return (
    <PageContent
      path={[
        { href: "/", label: "Главная" },
        { href: "/catalog", label: "Каталог" },
        { href: "/catalog/" + section, label: sectionItem?.name || "Секция" },
        { href: `/catalog/${section}/${product.category.url}`, label: product?.category.name || "Категория" },
        { href: `/catalog/${section}/${product.category.url}/${product.eng}`, label: product?.short || "Продукт" },
      ]}
      title={product.name}
    >
      <div dangerouslySetInnerHTML={{ __html: product.description }} />
    </PageContent>
  );
}
