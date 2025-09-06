import Container from "@/components/ui/container";
import { Title } from "@/components/ui/title";
import { prisma } from "@/lib/prisma";

export default async function Catalog() {
  const sections = await prisma.sections.findMany();

  return (
    <div className="flex justify-center sm:py-12 mt-5 sm:mt-10">
      <Container className="bg-background-200 flex-col mx-2">
        <Title>Каталог</Title>
        <div>
          {sections.map((s, index) => (
            <div key={index}>{s.name}</div>
          ))}
        </div>
      </Container>
    </div>
  );
}
