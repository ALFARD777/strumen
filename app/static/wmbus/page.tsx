import Image from "next/image";
import Link from "next/link";
import PageContent from "@/components/shared/pageContent";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/lib/types";

type AdvantageCard = { image: string; title: string; description: string };
type DestBlock = { image: string; text: string };

const advantages: AdvantageCard[] = [
  {
    image: "/static/wmbus4.png",
    title: "Беспроводная передача данных",
    description: "дистанционный съем показаний с приборов учета (отсутствует монтаж кабеля к каждому прибору учета)",
  },
  {
    image: "/static/wmbus5.png",
    title: "Сверхнизкое энергопотребление",
    description: "до 18 лет работы от одной батареи (в зависимости от емкости)",
  },
  { image: "/static/wmbus6.png", title: "Топология сети", description: "«точка-точка» или «звезда»" },
];

const dests: DestBlock[] = [
  {
    image: "/static/wmbus1.png",
    text: "Wireless (беспроводной) M-Bus — это стандарт связи между счетчиками расхода воды, тепла, электроэнергии в нелицензируемом диапазоне ISM на частоте 868 МГц (EN13757-4).",
  },
  {
    image: "/static/wmbus2.png",
    text: "При использовании радиомодулей, установленных на индивидуальных приборах учета расхода воды, с чипом по технологии Wireless M-Bus возможны 2 способа дистанционного получения данных: Инкассаторский и Автоматизированный.",
  },
  {
    image: "/static/wmbus3.png",
    text: "Аналогично проводной версии, основная топология сети для WM-Bus – «точка-точка» или «звезда». Данные собираются в радиоконцентраторы RK-01sA и затем поступают в УСПД Гран по проводному интерфейсу M-Bus, далее на верхний уровень АСКУЭ.",
  },
];

export const metadata = { title: "WM-BUS" };

export default async function WMBus() {
  const productEngs = ["strumen-sv-15m-dn15-strumen-sv-20m-dn20", "radiokontsentratory-rk", "uspd-gran"];

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
    <PageContent title="WM-BUS">
      <div className="flex flex-col gap-6">
        <h4 className="text-lg text-justify indent-8">
          Беспроводной протокол WMBus — это расширенная версия широко распространённого в Европе протокола проводной
          связи M-Bus (EN13757-2).
        </h4>

        <div className="grid gap-8 md:grid-cols-3 mt-4">
          {dests.map((dest, idx) => (
            <div key={dest.text} className="flex flex-col gap-2 items-center">
              <Image
                src={dest.image}
                width={64}
                height={64}
                alt={`WM-BUS ${idx}`}
                className="object-cover rounded-md"
              />
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

        <h2 className="text-2xl font-semibold text-center mt-12">Преимущества</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 justify-items-center mt-4">
          {advantages.map((adv) => (
            <div key={adv.title} className="flex flex-col items-center p-4">
              <Image
                src={adv.image}
                width={32}
                height={32}
                alt={adv.title}
                className="object-contain filter invert brightness-0"
              />
              <h4 className="mt-2 font-semibold text-center">{adv.title}</h4>
              <p className="text-center opacity-70">{adv.description}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-center mt-12">Структурная схема построения</h2>
        <h4 className="text-center">АСКУЭ на основе беспроводной системы WM-Bus</h4>
        <Image
          src="/static/wmbus7.jpg"
          width={1170}
          height={480}
          alt="Структурная схема"
          className="mx-auto rounded-xl scale-[0.9]"
        />
      </div>
    </PageContent>
  );
}
