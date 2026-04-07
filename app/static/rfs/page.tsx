import Image from "next/image";
import Link from "next/link";
import PageContent from "@/components/shared/pageContent";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/lib/types";

type AdvantageCard = { image: string; title: string; description: string };
type DestBlock = { image: string; text: string };

export const dynamic = "force-dynamic";

const advantages: AdvantageCard[] = [
  { image: "/static/mbus4.png", title: "Расстояние при подключении", description: "не более 4000 м" },
  {
    image: "/static/mbus5.png",
    title: "Топология сети",
    description: "смешанное соединение (древовидная, звезда, линейная или другая)",
  },
  {
    image: "/static/mbus6.png",
    title: "Полярность при подключении",
    description: "не важна, не требует дополнительных затрат на монтаж",
  },
  {
    image: "/static/mbus7.png",
    title: "Требования к кабелю",
    description: "нет специальных требований, любой кабель типа МКШ 2*0,75 (ШВВП 2*0,75)",
  },
];

const dests: DestBlock[] = [
  {
    image: "/static/rfs1.png",
    text: "Особенность системы заключается в гибкости построения и простоте использования. Система может быть использована для учета электрической энергии как для многоэтажной застройки, так и для малоэтажного жилого сектора (выносные учеты).",
  },
  {
    image: "/static/rfs2.png",
    text: "Беспроводная сеть RFs работает по технологии MESH сети (ячеистая топология), в которой устройства соединяются по принципу «каждый с каждым» и способны принимать на себя роль коммутатора, что обеспечивает устойчивость сети.",
  },
  {
    image: "/static/rfs3.png",
    text: "Беспроводная сеть RFs представляет собой одну или несколько подсетей, состоящих из маршрутизатора и узлов (максимум 1022), принадлежащих данному маршрутизатору.",
  },
];

export const metadata = { title: "Беспроводная сеть RFs" };

export default async function RFs() {
  const productEngs = ["gran-elektro-ss-101b", "radioretranslyatory-rr", "uspd-gran"];

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
    <PageContent title="Беспроводная сеть RFs">
      <div className="flex flex-col gap-6">
        <h4 className="text-lg text-justify indent-8">
          Автоматизированная самоорганизующаяся беспроводная система АСКУЭ на основе беспроводной сети RFs предназначена
          для организации дистанционного беспроводного сбора данных с приборов учета по радиоканалу на частоте 433 МГц.
        </h4>

        <div className="grid gap-8 md:grid-cols-3 justify-items-center mt-4">
          {dests.map((dest, idx) => (
            <div key={dest.text} className="flex flex-col gap-2 items-center">
              <Image src={dest.image} width={64} height={64} alt={`RFs ${idx}`} className="object-cover rounded-md" />
              <p className="indent-8 text-justify">{dest.text}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-center mt-12">Преимущества</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 justify-items-center mt-4">
          {advantages.map((adv) => (
            <div key={adv.title} className="flex flex-col items-center p-4">
              <Image
                src={adv.image}
                width={32}
                height={32}
                alt={adv.title}
                className="object-contain filter invert brightness-0 size-12"
              />
              <h4 className="mt-2 font-semibold text-center">{adv.title}</h4>
              <p className="text-center opacity-70">{adv.description}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-center mt-12">Структурная схема построения</h2>
        <h4 className="text-center">АСКУЭ на основе беспроводной системы RFs</h4>
        <Image src="/static/rfs.jpg" width={699} height={421} alt="Структурная схема" className="mx-auto rounded-xl" />

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
      </div>
    </PageContent>
  );
}
