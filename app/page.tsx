import { IconFileText, IconShoppingCartFilled } from "@tabler/icons-react";
import Image from "next/image";
import NextLink from "next/link";
import VideoBlock from "@/app/videoblock";
import { ButtonPhone } from "@/components/shared/buttonPhone";
import Email from "@/components/shared/email";
import { ButtonLink } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Title } from "@/components/ui/title";
import { siteConfig } from "@/config/site";
import NewsBlock from "./news";

type CardData = {
  title: string;
  link: string;
  image: string;
  description: { name: string; link: string }[];
};

export default function Home() {
  const cards: CardData[] = [];
  const catalog = siteConfig.navItems[0].sub || [];

  [
    { i: 0, img: "/media/cat1.png" },
    { i: 1, img: "/media/cat2.png" },
    { i: 2, img: "/media/cat3.png" },
    { i: 4, img: "/media/cat4.png" },
  ].forEach(({ i, img }) => {
    if (catalog[i])
      cards.push({
        title: catalog[i].label,
        link: catalog[i].href,
        image: img,
        description:
          catalog[i] && "sub" in catalog[i] && Array.isArray(catalog[i].sub)
            ? catalog[i].sub.map((el: { label: string; href: string }) => ({
                name: el.label,
                link: el.href,
              }))
            : [],
      });
  });

  return (
    <>
      <VideoBlock />
      <div className="flex justify-center py-10" id="prod">
        <Container className="flex-col items-center">
          <Title className="mb-4">Ассортимент компании</Title>
          <div className="flex flex-wrap gap-2 justify-center mx-2 w-full">
            {cards.map((card) => (
              <div
                key={card.link}
                className="shadow-lg p-4 rounded-md flex flex-col items-center w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-8px)]"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  width={100}
                  height={100}
                  className="h-[70px] w-auto select-none mb-3"
                />
                <NextLink
                  href={`/catalog${card.link}`}
                  className="text-center text-lg transition-colors hover:text-primary font-semibold mb-4 h-[3rem]"
                >
                  {card.title}
                </NextLink>
                <ul className="space-y-1 w-full">
                  {card.description.map((el) => (
                    <li key={el.link} className="relative text-sm pl-4">
                      <span className="w-1.5 h-0.5 bg-foreground/30 absolute left-0 top-1.5" />
                      <NextLink
                        href={`/catalog${card.link}${el.link}`}
                        className="transition-colors hover:text-primary"
                      >
                        {el.name}
                      </NextLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 w-full md:w-1/2 text-center">
            <h2>С полным перечнем продукции можно ознакомиться, нажав ниже</h2>
            <div className="w-full flex flex-col lg:flex-row items-center gap-2 mt-2">
              <ButtonLink href="/catalog" className="w-full lg:w-1/2">
                <IconShoppingCartFilled size={20} />
                Продукция
              </ButtonLink>
              <ButtonLink
                href="/documents"
                variant="secondary"
                className="w-full lg:w-1/2"
              >
                <IconFileText size={20} />
                Документация
              </ButtonLink>
            </div>
          </div>
        </Container>
      </div>
      <NewsBlock />
      <div className="benefits-background h-[888px] md:h-[555px] lg:h-[333px] flex justify-center">
        <Container className="flex-col m-4">
          <Title className="text-white">Почему выбирают нас?</Title>
          <div className="flex flex-wrap gap-2 h-full">
            {siteConfig.benefits.map((el) => (
              <div
                key={el.label}
                className="w-full md:flex-[calc(50%-8px)] lg:flex-[calc(16%-8px)] flex flex-col items-center text-white text-center my-auto"
              >
                <Image
                  src={el.img}
                  alt={el.label}
                  width={100}
                  height={100}
                  className="h-[70px] w-auto select-none mb-3"
                />
                <h2>{el.label}</h2>
                {el.ps && <p className="text-thin opacity-50">{el.ps}</p>}
              </div>
            ))}
          </div>
        </Container>
      </div>
      <div className="flex justify-center py-10 px-2" id="contacts">
        <Container className="flex-col items-center">
          <div className="flex flex-col lg:flex-row gap-8 w-full">
            <div className="w-full lg:w-1/2">
              <h3 className="text-xl font-semibold mb-4">Контакты</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 opacity-50">
                  220084, г.Минск, ул. Ф. Скорины, 54А
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ButtonPhone phone="+375173738582" />
                  <ButtonPhone phone="+375173587568" />
                  <ButtonPhone phone="+375173579521" />
                  <ButtonPhone phone="+375291958203" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium opacity-70">Для заявок:</span>
                  <Email email="orders@strumen.com" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium opacity-70">
                    По прочим вопросам:
                  </span>
                  <Email email="info@strumen.com" />
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Отдел маркетинга</h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <ButtonPhone phone="+375172313308" />
                      <ButtonPhone phone="+375173746519" />
                      <ButtonPhone phone="+375291958208" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Отдел сбыта</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <ButtonPhone phone="+375173514187" />
                      <ButtonPhone phone="+375173748189" />
                      <ButtonPhone phone="+375173548518" />
                      <ButtonPhone phone="+375291589337" />
                      <ButtonPhone viber phone="+375296839195" />
                      <ButtonPhone viber phone="+375296839194" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Отдел сервиса</h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <ButtonPhone phone="+375173555809" />
                      <ButtonPhone phone="+375173587879" />
                      <ButtonPhone phone="+375293658209" />
                    </div>
                  </div>

                  <div className="bg-background-200 p-4 rounded-lg shadow-md">
                    <h4 className="font-semibold mb-2">Головной офис</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="opacity-70">Рабочие дни:</span>
                        <span>Понедельник - пятница</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">Время работы:</span>
                        <span>08:30 - 17:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">Обед:</span>
                        <span>12:00 - 12:30</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background-200 p-4 rounded-lg shadow-md">
                    <h4 className="font-semibold mb-2">Отдел Сервиса</h4>
                    <div className="space-y-1 text-sm">
                      <div className="opacity-70 mb-2">
                        Приемка/выдача продукции
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">Рабочие дни:</span>
                        <span>Понедельник - пятница</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">Время работы:</span>
                        <span>08:00 - 16:30</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">Обед:</span>
                        <span>12:00 - 12:30</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-3/4">
              <iframe
                title="Карта расположения НПООО Гран-Система-С"
                src="https://yandex.ru/map-widget/v1/?um=constructor%3Ad513a1981cc6eefe1df2228ac5ceb68210d594ff85369a470df8a59fe728c61b&amp;source=constructor"
                width="100%"
                className="rounded-md shadow-lg h-[400px] lg:h-full"
              />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
