"use client";

import clsx from "clsx";
import { useState } from "react";
import { ButtonLink } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from "../ui/navigationMenu";
import { ButtonPhone } from "./buttonPhone";

export default function ContactsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NavigationMenuItem>
        <button
          type="button"
          className={clsx(navigationMenuTriggerStyle(), "cursor-pointer")}
          onClick={() => setOpen(true)}
        >
          КОНТАКТЫ
        </button>
      </NavigationMenuItem>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Контакты</DialogTitle>
          </DialogHeader>
          <p className="text-sm opacity-50">
            220084, г.Минск, ул. Ф. Скорины, 54А
          </p>
          <div>
            <ButtonPhone phone="+375173738582" />
            <ButtonPhone phone="+375173587568" />
          </div>
          <div>
            <a href="mailto:info@strumen.com" className="hover:underline">
              info@strumen.com
            </a>
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
              <div className="opacity-70 mb-2">Приемка/выдача продукции</div>
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
          <ButtonLink href="/#contacts" onClick={() => setOpen(false)}>
            Подробнее
          </ButtonLink>
        </DialogContent>
      </Dialog>
    </>
  );
}
