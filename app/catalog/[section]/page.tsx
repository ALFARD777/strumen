import { notFound } from "next/navigation";
import CategoryCard from "../card";
import { prisma } from "@/lib/prisma";
import PageContent from "@/components/shared/pageContent";

interface Props {
  params: { section: string };
}

export default async function Section({ params }: Props) {
  const { section } = params;
  const categories = await prisma.categories.findMany({
    where: { section: { url: section } },
    orderBy: { id: "asc" },
    include: {
      section: { select: { name: true } },
    },
  });

  if (categories.length === 0) return notFound();

  return (
    <PageContent
      path={[
        { href: "/", label: "Главная" },
        { href: "/catalog", label: "Каталог" },
        { href: `/catalog/${section}`, label: categories[0].section.name || "Секция" },
      ]}
      title={categories[0].section.name}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-2">
        {categories.map((section, index) => (
          <CategoryCard key={index} section={section} />
        ))}
      </div>
    </PageContent>
  );
}
