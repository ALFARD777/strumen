"use client";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { notFound, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import PageContent from "@/components/shared/pageContent";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Title } from "@/components/ui/title";
import type { Product } from "@/lib/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const limit = 20;

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
        setResults(res.data.results);
        setTotal(res.data.total);
      } catch (err) {
        console.error(err);
        if (err instanceof AxiosError) setError(err.response?.data || "Ошибка сети");
        else setError("Ошибка сети");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, page]); // добавляем зависимости

  if (!query) return notFound();

  const totalPages = Math.ceil(total / limit);

  const changePage = (newPage: number) => setPage(newPage);

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i === page}
              onClick={(e) => {
                e.preventDefault();
                changePage(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      } else if ((i === page - 2 && i > 1) || (i === page + 2 && i < totalPages)) {
        pages.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }
    return pages;
  };

  const handleWarpToProduct = (product: Product) => {
    window.location.href = `/catalog/${product.category.section.url}/${product.category.url}/${product.eng}`;
  };

  return (
    <PageContent title={`Результаты поиска по запросу "${query}"`}>
      {loading && (
        <div className="flex justify-center p-2">
          <LoadingSpinner />
        </div>
      )}

      {!loading && error && <div className="text-red-500 text-center">{error}</div>}

      {!loading && !error && results.length === 0 && (
        <p className="p-2 text-center opacity-70">Нам ничего не удалось найти. Попробуйте изменить ваш запрос</p>
      )}

      <div className="mt-4 space-y-2">
        {results.map((product, index) => (
          <React.Fragment key={product.id}>
            <button
              type="button"
              tabIndex={0}
              className="p-2 flex gap-2 items-center hover:scale-[101.5%] transition-all cursor-pointer w-full"
              onClick={() => handleWarpToProduct(product)}
            >
              <div className="flex-1 w-full rounded-md justify-center flex bg-gray-100">
                <Image
                  width={1920}
                  height={1080}
                  src={product.imagePaths[0]}
                  alt={product.short}
                  className="object-cover size-50"
                />
              </div>
              <Title className="font-bold w-2/3">{product.name}</Title>
            </button>
            {index !== results.length - 1 && <div className="h-[1px] bg-background-300 mx-2" />}
          </React.Fragment>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="flex justify-center mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) changePage(page - 1);
                }}
              />
            </PaginationItem>

            {renderPages()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) changePage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </PageContent>
  );
}
