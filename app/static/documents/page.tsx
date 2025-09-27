"use client";
import { IconFileZip } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import PageContent from "@/components/shared/pageContent";
import { ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TitleSetter from "@/components/ui/pageTitle";
import { LoadingSpinner } from "@/components/ui/spinner";
import type { Document } from "@/lib/types";

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      const res = await axios.get("/api/products/documents");
      console.log(res.data);
      setDocuments(res.data);
      setLoading(false);
    };

    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <PageContent title="Документация">
        <div className="flex w-full justify-center p-4">
          <LoadingSpinner />
        </div>
      </PageContent>
    );
  }

  if (documents.length === 0) {
    return (
      <PageContent title="Документация">
        <p>Документы отсутствуют</p>
      </PageContent>
    );
  }

  const filteredDocuments = documents.filter((d) => d.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <PageContent title="Документация">
      <TitleSetter title="Документация" />
      <div className="flex flex-col gap-2">
        <Input
          placeholder="Имя документа"
          label="Поиск"
          value={filter}
          onChange={(e) => setFilter(e.currentTarget.value)}
        />
        <div className="flex flex-col gap-2">
          {filteredDocuments.map((document) => (
            <ButtonLink
              variant="ghost"
              href={document.path}
              key={document.id}
              className="p-2 bg-background-300 rounded flex gap-2 items-center cursor-pointer text-left"
            >
              <IconFileZip />
              <p className="text-lg">{document.name}</p>
            </ButtonLink>
          ))}
        </div>
      </div>
    </PageContent>
  );
}
