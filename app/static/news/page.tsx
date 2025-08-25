"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/container";
import { Title } from "@/components/ui/title";
import { Skeleton } from "@/components/ui/skeleton";
import { previewText } from "@/components/functions";
import { NewsItem } from "@/components/types";
import {
  Breadcrumb,
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const axios = (await import("axios")).default;
        const res = await axios.get("/api/news");
        const data = res.data;

        if (data.news) {
          setNews(data.news.filter((item: NewsItem) => item.published));
        } else {
          setNews([]);
        }
        setError(null);
      } catch {
        setError("Ошибка загрузки новостей");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-22">
        <Container className="flex-col justify-center gap-4">
          <Title>Новости</Title>
          <div className="flex gap-2 w-full items-center">
            <Skeleton className="h-36 w-24" />
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center mt-22">
        <Container className="flex-col justify-center gap-4">
          <Title>Новости</Title>
          <div className="text-center text-red-500">{error}</div>
        </Container>
      </div>
    );
  }

  if (!news.length) {
    return (
      <div className="flex flex-col items-center mt-22">
        <Container className="flex-col justify-center gap-4">
          <Title>Новости</Title>
          <div className="text-center text-gray-500">Нет новостей</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-22">
      <Container className="flex-col justify-center gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Главная</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/static/news">Новости</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Title>Новости</Title>
        <div className="flex flex-col gap-6">
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/static/news/${item.id}`}
              className="block shadow-lg p-4 rounded-md transition hover:scale-105"
            >
              <div className="flex gap-6 items-center">
                <Image
                  src={
                    item.imagePath ||
                    "https://placehold.co/128x200?text=Нет\\nФото"
                  }
                  alt="Картинка новости"
                  width={96}
                  height={64}
                  className="max-h-32 object-cover rounded-md shadow"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-sm opacity-50">
                    {new Date(item.createdAt).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="text-base">{previewText(item.content)}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
