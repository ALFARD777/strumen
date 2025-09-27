"use client";

import { IconShoppingCartFilled } from "@tabler/icons-react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/components/store/cart";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";

type Point = { x: number; y: number };
type Circle = { id: number; start: Point; end: Point };

export default function AddToCart({ product }: { product: Product }) {
  const [circles, setCircles] = useState<Circle[]>([]);
  const addToCart = useCart((state) => state.addToCart);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const start: Point = { x: e.clientX, y: e.clientY };
    const isMobile = window.innerWidth < 1024;
    const targetEl = document.getElementById(isMobile ? "menuButton" : "cartButton");
    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();
    const end: Point = {
      x: rect.left + rect.width / 4,
      y: rect.top + rect.height / 4,
    };
    const newCircle: Circle = {
      id: Date.now() + Math.random(),
      start,
      end,
    };
    setCircles((prev) => [...prev, newCircle]);

    addToCart(product.id, product.short, product.imagePaths[0]);
  };

  const handleCircleEnd = (id: number) => {
    setCircles((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      <Button variant="secondary" className="w-full my-2" onClick={handleAddToCart}>
        <IconShoppingCartFilled />
        Добавить в корзину
      </Button>
      <p className="opacity-50">Итоговая стоимость рассчитывается после связи с сотрудником</p>

      {circles.map((circle) => (
        <FlyingCircle key={circle.id} id={circle.id} start={circle.start} end={circle.end} onEnd={handleCircleEnd} />
      ))}
    </div>
  );
}

function FlyingCircle({
  id,
  start,
  end,
  onEnd,
}: {
  id: number;
  start: Point;
  end: Point;
  onEnd: (id: number) => void;
}) {
  const t = useMotionValue(0);
  const x = useTransform(t, [0, 0.5, 1], [start.x, (start.x + end.x) / 2 + 60, end.x]);
  const y = useTransform(t, [0, 0.5, 1], [start.y, start.y + 120, end.y]);
  const scale = useTransform(t, [0, 0.5, 1], [1, 1.1, 0.5]);
  const opacity = useTransform(t, [0, 0.9, 1], [1, 1, 0.2]);

  useEffect(() => {
    const controls = animate(t, 1, {
      duration: 0.7,
      ease: "easeInOut",
      onComplete: () => onEnd(id),
    });
    return () => controls.stop();
  }, [t, id, onEnd]);

  return createPortal(
    <motion.div
      className="size-5 rounded-full bg-primary absolute top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x,
        y,
        scale,
        opacity,
      }}
    />,
    document.body,
  );
}
