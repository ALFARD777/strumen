import { IconBasketFilled, IconTrashFilled, IconX } from "@tabler/icons-react";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../store/cart";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Input, InputMask } from "../ui/input";

export default function CartButton({
  mobile,
  userId,
}: {
  mobile?: boolean;
  userId: number | undefined;
}) {
  const [opened, setOpened] = useState<boolean>(false);
  const { items, updateCount, removeFromCart, clearCart } = useCart();
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [requestPhoneDialogueOpened, setRequestPhoneDialogueOpened] =
    useState<boolean>(false);

  const handleOrder = async () => {
    if (items.length === 0) return;
    const phone = guestPhone;

    if (!userId && !guestPhone) {
      setRequestPhoneDialogueOpened(true);
      return;
    }

    try {
      await axios.post("/api/orders", { userId, phone, items });
      clearCart();
      setOpened(false);
      toast.success("Заказ оформлен!");
    } catch (err) {
      console.error(err);
      toast.error("Ошибка при оформлении заказа, обратитесь к администрации");
    }
  };

  const handleDialogueConfirm = () => {
    if (!guestPhone) return;
    setRequestPhoneDialogueOpened(false);
    handleOrder();
  };

  return (
    <>
      {!mobile ? (
        <Button
          aria-label="Корзина"
          onClick={() => setOpened(!opened)}
          variant="icon"
          size="icon"
          id="cartButton"
          className="relative"
        >
          <IconBasketFilled />
          {items.length > 0 && (
            <div className="absolute bottom-2 right-2 bg-secondary rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">
              {items.length}
            </div>
          )}
        </Button>
      ) : (
        <Button
          variant="outline"
          className="relative"
          aria-label="Корзина"
          onClick={() => setOpened(!opened)}
        >
          <IconBasketFilled />
          Корзина
          {items.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-secondary rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">
              {items.length}
            </div>
          )}
        </Button>
      )}

      <Drawer
        open={opened}
        direction="right"
        onOpenChange={(v) => !v && setOpened(false)}
      >
        <DrawerContent className="px-2">
          <DrawerHeader>
            <div className="flex justify-between">
              <DrawerTitle>Корзина</DrawerTitle>
              <DrawerClose
                onClick={() => setOpened(false)}
                className="cursor-pointer"
              >
                <IconX />
              </DrawerClose>
            </div>
          </DrawerHeader>
          <DrawerDescription className="text-center">
            {items.length > 0
              ? "Ниже располагается содержимое вашей корзины. Вы можете отредактировать количество товаров или полностью удалить из списка. После, есть возможность оформления заказа"
              : "Ваша корзина пуста. Перейдите на страницу любого товара для добавления"}
          </DrawerDescription>
          <div className="flex flex-col h-full justify-between m-2">
            <div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-2 items-center justify-between bg-background-200 p-2 rounded-md"
                >
                  <div className="flex gap-2 items-center">
                    <div className="size-20 flex items-center">
                      <Image
                        src={item.image}
                        width={200}
                        height={200}
                        alt={item.shortName}
                        className="rounded-md"
                      />
                    </div>
                    <p className="font-bold text-lg break-words max-w-20 lg:max-w-60">
                      {item.shortName}
                    </p>
                  </div>
                  <div className="flex gap-2 items-enter">
                    <Input
                      row
                      type="number"
                      label="Кол-во"
                      value={item.count}
                      min={1}
                      step={1}
                      max={1000}
                      onChange={(e) =>
                        updateCount(item.id, Number(e.currentTarget.value))
                      }
                      className="max-w-20"
                    />
                    <Button
                      variant="secondary"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <IconTrashFilled />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => clearCart()}
                variant="ghost"
                className="w-full"
                disabled={items.length === 0}
              >
                Очистить корзину
              </Button>
              <Button
                onClick={handleOrder}
                variant="default"
                className="w-full"
                disabled={items.length === 0}
              >
                Заказать
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <Dialog
        open={requestPhoneDialogueOpened}
        onOpenChange={setRequestPhoneDialogueOpened}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Введите номер телефона</DialogTitle>
          </DialogHeader>
          <InputMask
            required
            label="Номер телефона для связи"
            mask="+375 (00) 000-00-00"
            placeholder="+375 (__) __-__-__"
            type="tel"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.currentTarget.value)}
          />
          <DialogFooter>
            <Button onClick={handleDialogueConfirm}>Подтвердить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
