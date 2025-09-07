import ProductCard from "./card";
import Container from "@/components/ui/container";
import { Title } from "@/components/ui/title";
import { prisma } from "@/lib/prisma";

interface Props {
  params: { category: string };
}

export default async function Category({ params }: Props) {
  const { category } = params;
  const products = await prisma.products.findMany({
    where: { category: { url: category } },
    orderBy: {
      id: "asc",
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      documents: {
        select: {
          name: true,
          path: true,
        },
      },
      softwares: {
        select: {
          name: true,
          path: true,
        },
      },
      extraCharacteristics: {
        select: {
          key: true,
          value: true,
        },
      },
    },
  });

  return (
    <div className="flex justify-center sm:py-12 mt-5 sm:mt-10">
      <Container className="bg-background-200 flex-col mx-2 rounded-md p-2">
        <Title className="p-2">
          {products[0]?.category?.name || "Категория"}
        </Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-2">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </Container>
    </div>
  );
}
