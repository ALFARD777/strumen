import CategoryCard from "../card";
import Container from "@/components/ui/container";
import { Title } from "@/components/ui/title";
import { prisma } from "@/lib/prisma";

interface Props {
  params: { section: string };
}

export default async function Section({ params }: Props) {
  const { section } = params;
  const categories = await prisma.categories.findMany({
    where: { section: { url: section } },
    orderBy: {
      id: "asc",
    },
    include: {
      section: {
        select: {
          name: true,
        },
      },
    },
  });

  var armatura;

  if (categories.length === 0) {
    armatura = await prisma.sections.findFirst({
      where: { url: section },
    });
  }

  return (
    <div className="flex justify-center sm:py-12 mt-5 sm:mt-10">
      <Container className="bg-background-200 flex-col mx-2 rounded-md p-2">
        <Title className="p-2">
          {categories[0]?.section.name || armatura?.name || "Категории"}
        </Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-2">
          {categories.map((section, index) => (
            <CategoryCard key={index} section={section} />
          ))}
        </div>
      </Container>
    </div>
  );
}
