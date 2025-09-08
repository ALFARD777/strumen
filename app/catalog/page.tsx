import CategoryCard from "./card";
import PageContent from "@/components/shared/pageContent";
import { prisma } from "@/lib/prisma";

export default async function Catalog() {
  const catalogSections = await prisma.sections.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return (
    <PageContent
      path={[
        {
          href: "/",
          label: "Главная",
        },
        {
          href: "/catalog",
          label: "Каталог",
        },
      ]}
      title="Каталог"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-2">
        {catalogSections.map((section, index) => (
          <CategoryCard key={index} section={section} />
        ))}
      </div>
    </PageContent>
  );
}
