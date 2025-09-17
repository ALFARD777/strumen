"use client";

import { IconClearAll } from "@tabler/icons-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ButtonLink } from "@/components/ui/button";
import Container from "@/components/ui/container";
import TitleSetter from "@/components/ui/pageTitle";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Title } from "@/components/ui/title";
import type { News } from "@/lib/types";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const axios = (await import("axios")).default;
        const res = await axios.get(`/api/news?id=${id}`);
        const data = res.data;

        if (!data.news) {
          setNews(null);
          setError("Новость не найдена");
        } else {
          setNews(data.news);
          setError(null);
        }
      } catch {
        setError("Ошибка загрузки новости");
        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }
  if (!news) {
    if (typeof window !== "undefined") {
      const { notFound } = require("next/navigation");

      notFound();
    }

    return null;
  }
  if (error) {
    return <div className="text-center text-red-500 p-8 mt-12">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-14">
      <hr className="w-full opacity-10" />
      <Container className="p-5 mb-5 flex-col justify-center gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Главная</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/static/news">Новости</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/static/news/${news.id}`}>
                {new Date(news.createdAt).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <TitleSetter title={news.title} />
        <Title>{news.title}</Title>
        <div className="flex flex-col gap-4 items-center">
          <p className="text-sm text-gray-500">
            {new Date(news.createdAt).toLocaleDateString("ru-RU", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <Image
            src={news.imagePath || "https://placehold.co/128x200?text=Нет\\nФото"}
            alt="Картинка новости"
            width={320}
            height={200}
            className="max-h-96 object-cover rounded-md shadow-md"
          />
          <div className="text-base text-justify whitespace-pre-line">
            {news.content
              .split("\n")
              .filter((paragraph) => paragraph.trim() !== "")
              .map((paragraph) => (
                <p key={paragraph} className="indent-5 mb-2">
                  {paragraph}
                </p>
              ))}
          </div>
          <ButtonLink href="/static/news" className="w-full" variant="outline">
            <IconClearAll size={20} />
            Ко всем новостям
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
