import type { Prisma } from "@prisma/client";

export type News = {
  id: number;
  title: string;
  content: string;
  published: boolean;
  imagePath: string;
  createdAt: string;
};

export type Product = Prisma.ProductsGetPayload<{
  include: {
    category: true;
    documents: true;
    softwares: true;
    extraCharacteristics: true;
    productViews: true;
  };
}>;

export type Category = {
  id: number;
  name: string;
  url: string;
};

export type User = {
  id: number;
  token: string;
  email: string;
  phone: string;
  createdAt: string;
  isValid: boolean;
};

export type Order = Prisma.OrdersGetPayload<{
  include: {
    orderProducts: {
      include: { product: true };
    };
    user: true;
  };
}>;
