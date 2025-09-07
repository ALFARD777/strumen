import CategoryCard from "./card";
import Container from "@/components/ui/container";
import { Title } from "@/components/ui/title";
import { prisma } from "@/lib/prisma";

export default async function Catalog() {
  const catalogSections = await prisma.sections.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return (
    <div className="flex justify-center sm:py-12 mt-5 sm:mt-10">
      <Container className="bg-background-200 flex-col mx-2 rounded-md p-2">
        <Title className="p-2">Каталог</Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-2">
          {catalogSections.map((section, index) => (
            <CategoryCard key={index} section={section} />
          ))}
        </div>
      </Container>
    </div>
  );
}
