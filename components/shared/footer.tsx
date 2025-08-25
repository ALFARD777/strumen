import React from "react";
import Container from "../ui/container";

const Footer = () => {
  return (
    <footer className="border-t border-border px-2 py-6 mt-6 text-foreground/50">
      <Container className="mx-auto flex flex-col text-center">
        <p>
          Интернет-магазин{" "}
          <a
            className="text-foreground/70 transition-colors hover:text-foreground"
            href="https://strumen.com"
          >
            strumen.com
          </a>
        </p>
        <p>
          Дата регистрации в торговом реестре Республики Беларусь — 29.08.2016,
          зарегистрирован администрацией Первомайского района г. Минска.
        </p>
        <p>
          Регистрационный номер в Торговом реестре Республики Беларусь — 349616
        </p>
        <p className="mt-2 text-foreground/70">
          &copy; 1998-{new Date().getFullYear()}, НПООО
          &laquo;Гран-Система-С&raquo; – все права защищены
        </p>
      </Container>
    </footer>
  );
};

export { Footer };
