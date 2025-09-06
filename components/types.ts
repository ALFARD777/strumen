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
  description: string;
  characteristics?: string;
  features?: string;

  imagePaths: string[];
  documents: { name: string; path: string }[];
  softwares: { name: string; path: string }[];
  extraCharacteristics: { key: string; value: string }[];

  categoryId: number;
  category: {
    id: number;
    name: string;
  };

  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: number;
  name: string;
  url: string;
};
