import Image from "next/image";
import Link from "next/link";
import PageContent from "@/components/shared/pageContent";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/lib/types";

type AdvantageCard = { image: string; title: string; description: string };
type DestBlock = { image: string; text: string };

const advantages: AdvantageCard[] = [
  {
    image: "/static/lorawan4.png",
    title: "Сверхнизкое энергопотребление",
    description: "до 18 лет работы от одной батареи (в зависимости от емкости)",
  },
  {
    image: "/static/lorawan6.png",
    title: "Масштабируемость сети",
    description: "до 5 тыс. оконечных устройств на каждый квадратный километр для одной базовой станции",
  },
  {
    image: "/static/lorawan5.png",
    title: "Высокая проникающая способность радиосигнала",
    description: "обеспечение устойчивой связи в городской застройке, а также в труднодоступных местах",
  },
  {
    image: "/static/lorawan7.png",
    title: "Высокая степень безопасности",
    description: "выделенная сеть, лицензируемый спектр, стандарт 3GPP",
  },
];

const dests: DestBlock[] = [
  {
    image: "/static/nbiot1.png",
    text: "Важной особенностью оборудования работающего на стандарте NB-IoT является наличие sim-карты или sim-чипа. Технология NB-IoT обеспечивается операторами сотовой связи, например, в Республике Беларусь – это МТС и А1. В прибор с функцией NB-IoT вставляется SIM-карта. Прибор имеет режим энергосбережения и осуществляет передачу данных на облачный сервер в заданное время, после чего переходит в спящий режим. После регистрации SIM-карты пользователю предоставляется личный кабинет с логином и паролем для входа, в котором отображаются переданные данные. Для работы приборов с функцией NB-IoT не требуется дополнительного ПО.",
  },
  {
    image: "/static/nbiot2.png",
    text: "Ключевым преимуществом технологии LoRaWAN является использование нелицензируемых частот и, как следствие, отсутствие тарификации за передачу данных – работа в диапазонах частот 433 МГц и 868 МГц. Технология LoRaWAN позволяет собирать данные приборов учета электроэнергии, воды и тепла, осуществлять мониторинг параметров приборов учета энергоресурсов, контролировать их расход и получать информацию о различных событиях в режиме реального времени.",
  },
];

export default async function NBIot() {
  const productEngs = ["gran-elektro-ss-101b", "gran-elektro-ss-102b", "gran-elektro-ss-103b"];

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
    <PageContent title="NB-IoT">
      <div className="flex flex-col gap-6">
        <h4 className="text-lg text-justify indent-8">
          NB-IoT (NarrowBand Internet of Things) — стандарт связи Интернета вещей для передачи небольших объемов данных
          с заданным периодом. Стандарт разработан консорциумом 3GPP и основан на технологии малой мощности (LPWAN).
        </h4>

        <div className="grid gap-8 md:grid-cols-2 mt-4">
          {dests.map((dest, idx) => (
            <div key={dest.text} className="flex flex-col gap-2 items-center">
              <Image src={dest.image} width={64} height={64} alt={`NB-IoT ${idx}`} className="object-cover size-16" />
              <p className="indent-8 text-justify">{dest.text}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-center mt-8">Принцип работы</h2>
        <Image src="/static/s_1.png" width={1140} height={540} alt="Принцип работы" className="mx-auto rounded-xl" />

        <h2 className="text-2xl font-semibold text-center mt-8">Устройства с поддержкой NB-IoT</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 mt-4">
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
        <div className="grid gap-2 sm:grid-cols-2 mt-4">
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
              <p className="text-center opacity-70 whitespace-pre-line">{adv.description}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-center mt-12">Структурная схема построения</h2>
        <h4 className="text-center">АСКУЭ на основе беспроводной системы NB-IoT</h4>
        <Image
          src="/static/nbiot3.jpg"
          width={1024}
          height={576}
          alt="Структурная схема"
          className="mx-auto rounded-xl"
        />
      </div>
    </PageContent>
  );
}
