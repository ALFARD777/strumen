import NextLink from "next/link";
import PageContent from "@/components/shared/pageContent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata = { title: "FAQ" };

export default function FAQ() {
  const contentStyle = "flex flex-col gap-4 text-balance";

  return (
    <PageContent title="Часто задаваемые вопросы">
      <Accordion collapsible type="single" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Как узнать стоимость прибора?</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <p>
              Стоимость можно узнать в отделе сбыта по номеру телефона{" "}
              <a href="tel:+375173514187" className="underline hover:text-muted-foreground transition-colors">
                +375 (17) 351-41-87
              </a>
              .
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Как сделать заявку?</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <p>
              С порядком заказа продукции можно ознакомиться по{" "}
              <NextLink
                href="/static/poryadok-zakaza"
                className="underline hover:text-muted-foreground transition-colors"
              >
                ссылке
              </NextLink>
              .
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Утерян паспорт. Как восстановить?</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <p>
              По вопросу восстановления паспорта необходимо обратиться в отдел сервиса по номеру телефона{" "}
              <a href="tel:+375173555809" className="underline hover:text-muted-foreground transition-colors">
                +375 (17) 355-58-09
              </a>
              .
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Какие основные параметры для подбора счетчика воды?</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <p>Расход воды в системе, диаметр трубопровода и тип счетчика воды (крыльчатый, турбинный, сопряженный).</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>Как узнать постоянный расход воды счетчика?</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <p>
              Данная информация указана в паспорте для каждого конкретного счетчика, а также на соответствующей странице
              сайта.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>
            Как организовать дистанционный съем показаний с сопряженного счетчика воды напрямую в АРМ водоканала?
          </AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <p>
              Вам потребуется сопряженный счетчик воды с импульсными выходами. В названии счетчика должно быть «-NK»,
              например MWN/JS 50/4-S-NK и вычислитель к нему ВВ-07-К7 (NB-IoT). Счетчик воды подключается к вычислителю
              импульсными выходами. В вычислитель вставляется сим-карта А1 с тарифом «Телеметрия NB-IoT» с услугой
              доступа к IoT платформе. Оператор А1 при подключении данного тарифного плана предоставляет логин и пароль
              для входа на платформу и просмотра показаний счетчика воды.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger>Как работает вычислитель ВВ-07-К7 с функцией NB-IoT?</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <p>
              NB-IoT (Narrow Band Internet of Things) — стандарт сотовой связи Интернета вещей для передачи небольших
              объемов данных с заданным периодом. В вычислитель (ВВ-07-К7) с функцией NB-IoT вставляется SIM-карта
              (оператор А1). ВВ-07-К7 имеет режим энергосбережения и осуществляет передачу данных на облачный сервер в
              заданное время и уходит в спящий режим. Пользователю предоставляется личный кабинет с логином и паролем
              для входа, в котором отображаются переданные данные. Для работы ВВ-07-К7 с функцией NB-IoT не требуется
              дополнительного ПО.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-8">
          <AccordionTrigger>Какие приборы учета воды совместимы с вычислителем ВВ-07-К7 (NB-IoT)?</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <p>Только счетчики воды с импульсным выходом.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-9">
          <AccordionTrigger>
            Сколько счетчиков воды можно подключить одновременно к вычислителю ВВ-07-К7 (NB-IoT)?
          </AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <p>Одновременно можно подключить 4 счетчика воды с импульсным выходом.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-10">
          <AccordionTrigger>Какой источник питания у вычислителя ВВ-07-К7?</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <p>Питание от электросети 220 В (24 В) и (или) литиевая батарея</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-11">
          <AccordionTrigger>Можно ли удлинять кабель от расходомера до электронного вычислителя?</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <p>Да, можно</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-12">
          <AccordionTrigger>Каким кабелем удлинять кабель от расходомера до электронного вычислителя?</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <p>ШВВП 2х0,75</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-13">
          <AccordionTrigger>Максимальная длина кабеля от расходомера до электронного вычислителя?</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <p>От ультразвукового - не более 12м; от механического - не более 25м.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-14">
          <AccordionTrigger>Как считывать данные с АРТ-OMS-NA?</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <p>
              Для того, чтобы считать данные с радиомодулей типа APT-OMS-NA при отсутствии стационарной системы
              считывания, вам необходим Преобразователь IC-46A и программа для считывания данных WMBusReader. (это
              инкассаторский способ сбора данных с радиомодудей данного типа).
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-15">
          <AccordionTrigger>Какой источник питания у радиомодуля APATOR?</AccordionTrigger>
          <AccordionContent className={contentStyle}>
            <p>Литиевая батарея. Срок службы батареи до 13 лет (зависит от частоты опроса радиомодуля).</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </PageContent>
  );
}
