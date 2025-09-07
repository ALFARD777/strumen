export type News = {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
};

export type Product = {
  id: number;
  name: string;
  short: string;
  eng: string;
  description: string;
  characteristics: string | null;
  features: string | null;

  imagePaths: string[];
  documents: { name: string; path: string }[];
  softwares: { name: string; path: string }[];
  extraCharacteristics: { key: string; value: string }[];

  categoryId: number | null;
  category: {
    id: number;
    name: string;
  } | null;

  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  id: number;
  name: string;
  url: string;
};
