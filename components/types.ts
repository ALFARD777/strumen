import { Prisma } from "@prisma/client";

export type News = {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
};

export type Product = Prisma.ProductsGetPayload<{
  include: {
    category: { select: { id: true; name: true } };
    documents: true;
    softwares: true;
    extraCharacteristics: true;
  };
}>;

export type Category = {
  id: number;
  name: string;
  url: string;
};
