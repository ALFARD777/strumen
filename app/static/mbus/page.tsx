import Image from "next/image";
import Link from "next/link";
import PageContent from "@/components/shared/pageContent";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/lib/types";

type AdvantageCard = { image: string; title: string; description: string };
type DestBlock = { image: string; text: string };

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
    image: "/static/mbus1.png",
    text: "M-Bus преимущественно применяется для приборов учета электрической энергии (электросчетчики), тепловой энергии (теплосчетчики), расходомеров воды и т.п. Протокол M-Bus не включает процедур преобразования форматов данных, организации «сессий» передач, транспортировки пакетов и маршрутизации.",
  },
  {
    image: "/static/mbus2.png",
    text: 'Сбор данных с точек учета осуществляется по проводным интерфейсам связи стандарта M-Bus, с передачей данных в УСПД "Гран", и далее, на верхний уровень АСКУЭ в автоматическом или ручном режиме.',
  },
];

export const metadata = {
  title: "M-BUS",
};

export default async function MBus() {
  const productEngs = ["gran-elektro-ss-101b", "kr-01", "uspd-gran"];

  const threeMonthAgo = new Date();
  threeMonthAgo.setMonth(threeMonthAgo.getMonth() - 3);

  const products: Product[] = await prisma.products.findMany({
    where: {
      eng: {
        in: productEngs,
      },
    },
    take: productEngs.length,
    include: {
      documents: true,
      softwares: true,
      category: {
        include: { section: true },
      },
      extraCharacteristics: true,
      productViews: {
        where: { date: { gt: threeMonthAgo } },
      },
    },
  });

  return (
    <PageContent title="M-BUS">
      <div className="flex flex-col gap-6">
        <h4 className="text-lg text-justify indent-8">
          M-Bus — коммуникационный протокол (европейский стандарт EN 1434/IEC870-5, EN 13757-2 - физический и канальный
          уровни, EN 13757-3 – уровень приложений), основан на стандартной архитектуре «клиент-сервер».
        </h4>

        <div className="grid gap-8 md:grid-cols-2 justify-items-center mt-4">
          {dests.map((dest, idx) => (
            <div key={dest.text} className="flex flex-col gap-2 items-center">
              <Image src={dest.image} width={64} height={64} alt={`M-BUS ${idx}`} className="object-cover rounded-md" />
              <p className="indent-8 text-justify">{dest.text}</p>
            </div>
          ))}
        </div>

        <Image src="/static/mbus3.jpg" width={422} height={145} alt="M-BUS" className="mx-auto rounded-xl mt-6" />

        <h2 className="text-2xl font-semibold text-center mt-8">Преимущества</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 justify-items-center mt-4">
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

        <h2 className="text-2xl font-semibold text-center mt-12">Структурная схема построения</h2>
        <h4 className="text-center">АСКУЭ на основе проводной системы M-BUS</h4>
        <Image
          src="/static/mbus8.png"
          width={1170}
          height={480}
          alt="Структурная схема"
          className="mx-auto rounded-xl"
        />
      </div>
    </PageContent>
  );
}
