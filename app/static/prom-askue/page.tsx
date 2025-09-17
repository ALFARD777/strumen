import Image from "next/image";
import Link from "next/link";
import PageContent from "@/components/shared/pageContent";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/lib/types";

type DestBlock = { image: string; text: string };

const dests: DestBlock[] = [
  {
    image: "/static/askue1.png",
    text: "Автоматизированная система контроля и учета электрической энергии (мощности) на промышленных предприятиях (далее - АСКУЭ) - система технических и программных средств для автоматизированного сбора, передачи, обработки, отображения и документирования процессов производства, передачи, распределения и (или) потребления электрической энергии (мощности) по заданному множеству пространственно распределенных точек их измерения, принадлежащих объектам энергоснабжающей организации и (или) абоненту (абонентам), субабоненту (субабонентам).",
  },
  {
    image: "/static/askue2.png",
    text: "По назначению АСКУЭ промышленных предприятий принято подразделять на системы коммерческого и технического АСКУЭ. Коммерческий (расчетный) учет (АСКУЭ) - это учет электроэнергии между Энергоснабжающей организацией и абонентом. Точки учета (как правило) расположены на границе балансового разграничения полномочий абонента и Энергоснабжающей организации. Средства измерений (счетчики) должны быть внесены в Госреестр СИ РБ; Технический учет (АСКУЭ) - это учет внутри абонента (цех, участок, АБК, котельная и т.д.) - служит для оценки энергопотребления подразделений предприятия. На практике, как правило, используется смешанный (коммерческий и технический учеты (АСКУЭ) предприятия.",
  },
];

export const metadata = { title: "Промышленная система АСКУЭ" };

export default async function IndustrialAskue() {
  const productEngs = ["gran-elektro-ss-101b", "gran-elektro-ss-102b", "gran-elektro-ss-103b"];

  const threeMonthAgo = new Date();
  threeMonthAgo.setMonth(threeMonthAgo.getMonth() - 3);

  const products: Product[] = await prisma.products.findMany({
    where: { eng: { in: productEngs } },
    take: productEngs.length,
    include: {
      documents: true,
      softwares: true,
      category: { include: { section: true } },
      extraCharacteristics: true,
      productViews: { where: { date: { gt: threeMonthAgo } } },
    },
  });

  return (
    <PageContent title="Промышленная система АСКУЭ">
      <div className="flex flex-col gap-6">
        <div className="grid gap-8 md:grid-cols-2 justify-items-center mt-4">
          {dests.map((dest, idx) => (
            <div key={dest.text} className="flex flex-col gap-2 items-center">
              <Image src={dest.image} width={64} height={64} alt={`АСКУЭ ${idx}`} className="object-cover rounded-md" />
              <p className="indent-8 text-justify">{dest.text}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-center mt-8">Состав решения</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 justify-items-center mt-4">
          {products.map((product) => (
            <Link
              key={product.id}
              className="flex flex-col items-center p-2 rounded hover:shadow-lg hover:scale-105 cursor-pointer transition"
              href={`/catalog/${product.category.section.url}/${product.category.url}/${product.eng}`}
            >
              <Image
                src={product.imagePaths[0]}
                width={150}
                height={150}
                alt={product.short}
                className="object-cover rounded-md"
              />
              <h3 className="text-sm font-medium text-center mt-2">{product.name}</h3>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-center mt-12">Структурная схема учета электроэнергии</h2>
        <Image src="/static/askue3.jpg" width={859} height={436} alt="Структурная схема" className="mx-auto mt-10" />
      </div>
    </PageContent>
  );
}
