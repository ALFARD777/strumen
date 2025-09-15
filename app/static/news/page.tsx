"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageContent from "@/components/shared/pageContent";
import { Path } from "@/components/shared/path";
import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { Title } from "@/components/ui/title";
import type { News } from "@/lib/types";
import { previewText } from "@/lib/utils";

export default function NewsList() {
  const [news, setNews] = useState<News[]>([]);
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
          setNews(data.news.filter((item: News) => item.published));
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
      <PageContent
        path={[
          {
            href: "/",
            label: "Главная",
          },
          {
            href: "/static/news",
            label: "Новости",
          },
        ]}
        title="Новости"
      >
        <div className="flex gap-2 w-full items-center">
          <Skeleton className="h-36 w-24" />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </PageContent>
    );
  }

  if (error) {
    return (
      <PageContent
        path={[
          {
            href: "/",
            label: "Главная",
          },
          {
            href: "/static/news",
            label: "Новости",
          },
        ]}
        title="Новости"
      >
        <div className="text-center text-red-500">{error}</div>
      </PageContent>
    );
  }

  if (!news.length) {
    return (
      <div className="flex justify-center mt-5 sm:mt-22">
        <Container className="flex-col mx-2">
          <Path>
            {[
              {
                href: "/",
                label: "Главная",
              },
              {
                href: "/static/news",
                label: "Новости",
              },
            ]}
          </Path>
          <Title>Новости</Title>
          <div className="text-center text-gray-500">Нет новостей</div>
        </Container>
      </div>
    );
  }

  return (
    <PageContent
      path={[
        {
          href: "/",
          label: "Главная",
        },
        {
          href: "/static/news",
          label: "Новости",
        },
      ]}
      title="Новости"
    >
      <div className="flex flex-col gap-6 bg-background-300 rounded-md mt-2 transition hover:scale-[101%] duration-300">
        {news.map((item) => (
          <Link
            key={item.id}
            href={`/static/news/${item.id}`}
            className="block shadow-lg p-4 rounded-md"
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
    </PageContent>
  );
}
