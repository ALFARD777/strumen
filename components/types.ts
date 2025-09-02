export interface Product {
  id: number;
  name: string;
  short: string;
  description: string;
  characteristics?: string;
  features?: string;
  imagePaths: string[];
  documents: Array<{ name: string; path: string }>;
  softwareArchivePaths: string[];
  createdAt: string;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
  };
}
