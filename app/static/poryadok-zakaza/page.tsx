import NextLink from "next/link";
import PageContent from "@/components/shared/pageContent";

export const metadata = {
  title: "Порядок заказа для частных лиц",
};

const steps = [
  {
    text: "Отправить заявку на интересующий Вас товар на электронную почту",
    link: "mailto:orders@strumen.com",
    extra:
      "В письме необходимо указать точное наименование, исполнение (при его наличии) и количество товаров. Помимо этого, необходимо указать ФИО и контактную информацию для обратной связи.",
  },
  {
    text: "Отправить заявку на факс по номеру:",
    link: "tel:+375 17 351 41 87",
    extra:
      "В заявке необходимо указать точное наименование, исполнение (при его наличии) и количество товаров. Помимо этого, необходимо указать ФИО и контактную информацию для обратной связи.",
  },
  {
    text: "Заказать товар через форму онлайн-заявки в карточке товара на сайте",
    extra:
      "После этого оформить заказ в корзине. Заказы автоматически приходят к нам, и наши менеджеры связываются с Вами.",
  },
];

export default function OrderForIndividuals() {
  return (
    <PageContent title="Порядок заказа для частных лиц">
      <div className="indent-8 mx-2">
        <p className="text-lg">
          <span className="font-semibold">Существует несколько способов заказа товара:</span>
        </p>
        <ul className="indent-8 text-justify">
          {steps.map((step, index) => (
            <li key={step.text} className="mb-4">
              <p className="">
                {step.text}{" "}
                {step.link && (
                  <NextLink href={step.link} className="underline">
                    {step.link.replace(/^mailto:/, "").replace("tel:", "")}
                  </NextLink>
                )}
              </p>
              <p className="opacity-60">{step.extra}</p>
              {steps.length - 1 !== index && <div className="h-0.5 w-full bg-background-300 mt-4" />}
            </li>
          ))}
        </ul>

        <p>
          При возникновении необходимости в консультации по техническим вопросам или подбору продукции, Вы можете
          обратиться к нам по тел.: <span className="font-semibold">+375 17 231-33-08</span>.
        </p>
        <p>
          Заказанную продукцию можно получить по адресу:{" "}
          <span className="font-semibold">г. Минск, ул. Ф.Скорины 54а, 3-й этаж, отдел сбыта.</span>
        </p>
        <p>
          При заказе продукции частным лицом, просим Вас ознакомиться со{" "}
          <NextLink href="/static/oplata" className="underline">
            способом оплаты продукции частными лицами
          </NextLink>
          .
        </p>
        <p>
          Документом, подтверждающим покупку частным лицом, является товарная накладная. Товарная накладная выдается в
          момент получения товара покупателем и служит вместо товарного чека.
        </p>
      </div>
    </PageContent>
  );
}
