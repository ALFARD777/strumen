export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Strumen - Гран-Система-С",
  description:
    "Ведущий разработчик и производитель приборов учета и потребления энергоресурсов.",
  benefits: [
    {
      label: "30 лет опыта работы",
      img: "/media/benefits1.png",
      ps: "Работаем с 1991 года",
    },
    {
      label: "Собственные разработки и производство",
      img: "/media/benefits2.png",
    },
    {
      label: "Гарантия высокого качества",
      img: "/media/benefits3.png",
    },
    {
      label: "Индивидуальный подход к клиенту",
      img: "/media/benefits4.png",
    },
    {
      label: "Высокая квалификация сервисной поддержки",
      img: "/media/benefits5.png",
    },
    {
      label: "ISO 9001 полное соответствие",
      img: "/media/benefits6.png",
    },
  ],
  navItems: [
    {
      label: "ПРОДУКЦИЯ",
      href: "/catalog",
      sub: [
        {
          label: "Учет электроэнергии",
          href: "/electroenergy",
          sub: [
            {
              label: "Счетчики однофазные",
              href: "/odnofaz",
            },
            {
              label: "Счетчики трехфазные",
              href: "/trehfaz",
            },
            {
              label: "Встроенные модули",
              href: "/vstroennie-moduli",
            },
          ],
        },
        {
          label: "Учет тепла и системы регулирования",
          href: "/teplo",
          sub: [
            {
              label: "Приборы учета тепла",
              href: "/teplo-pribory",
            },
            {
              label: "Шкафы управления",
              href: "/shkafy",
            },
          ],
        },
        {
          label: "Учет воды",
          href: "/voda",
          sub: [
            {
              label: "Для индивидуального и группового учета",
              href: "/no-impulse",
            },
            {
              label:
                "Для индивидуального и группового учета с импульсным выходом",
              href: "/ipmulse",
            },
          ],
        },
        {
          label: "M2M решения",
          href: "/m2m",
          sub: [
            {
              label: "Устройства LoRa",
              href: "/lora",
            },
            {
              label: "Устройства NB-IoT",
              href: "/nbiot",
            },
          ],
        },
        {
          label: "Оборудование АСКУЭ",
          href: "/askue",
          sub: [
            {
              label: "Дополнительное оборудование",
              href: "/dop",
            },
            {
              label: "Устройства низковольтные комплектные",
              href: "/nizkovolt",
            },
            {
              label: "Устройства сбора и передачи данных",
              href: "/sbor-i-peredacha",
            },
            {
              label: "Элементы АСКУЭ",
              href: "/elements-askue",
            },
          ],
        },
        {
          label: "Метрологическое оборудование",
          href: "/metrolog",
          sub: [
            {
              label: "Установки для поверки счетчиков электрической энергии",
              href: "/poverka",
            },
            {
              label: "Установки расходомерные",
              href: "/rashodomer",
            },
          ],
        },
        {
          label: "Арматура трубопроводная и вспомогательное оборудование",
          href: "/armatura",
        },
      ],
    },
    {
      label: "АСКУЭ",
      href: "/static",
      sub: [
        {
          label: "LoRaWAN",
          href: "/lorawan",
        },
        {
          label: "NB-IoT",
          href: "/nbiot",
        },
        {
          label: "M-BUS",
          href: "/mbus",
        },
        {
          label: "WM-BUS",
          href: "/wmbus",
        },
        {
          label: "Беспроводная RFs",
          href: "/rfs",
        },
        {
          label: "Промышленная АСКУЭ",
          href: "/prom-askue",
        },
      ],
    },
    {
      label: "ДЛЯ КЛИЕНТОВ",
      href: "/clients",
      sub: [
        {
          label: "Процедура получения готовой продукции",
          href: "/procedura",
        },
        {
          label: "Гарантийное и сервисное обслуживание",
          href: "/garant",
        },
        {
          label: "Новости и акции",
          href: "/news",
        },
        {
          label: "Часто задаваемые вопросы",
          href: "/faq",
        },
      ],
    },
  ],
};
