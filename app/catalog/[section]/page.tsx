import { notFound } from "next/navigation";
import PageContent from "@/components/shared/pageContent";
import { prisma } from "@/lib/prisma";
import CategoryCard from "../card";
import Category from "./[category]/page";

interface Props {
  params: Promise<{ section: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { section } = await params;

  const sectionItem = await prisma.sections.findFirst({
    where: { url: section },
    select: { name: true },
  });
  if (!sectionItem) return notFound();

  return { title: `${sectionItem.name}` };
}

export default async function Section({ params }: Props) {
  const { section } = await params;
  const categories = await prisma.categories.findMany({
    where: { section: { url: section } },
    orderBy: { id: "asc" },
    include: {
      section: { select: { name: true } },
    },
  });

  if (categories.length === 1) {
    console.log({ category: categories[0].name, section });
    return <Category params={Promise.resolve({ category: categories[0].url, section })} />;
  }

  if (categories.length === 0) return notFound();

  return (
    <PageContent
      path={[
        { href: "/", label: "Главная" },
        { href: "/catalog", label: "Каталог" },
        {
          href: `/catalog/${section}`,
          label: categories[0].section.name || "Секция",
        },
      ]}
      title={categories[0].section.name}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-2">
        {categories.map((section) => (
          <CategoryCard key={section.id} section={section} />
        ))}
      </div>
    </PageContent>
  );
}
