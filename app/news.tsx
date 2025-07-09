"use client";

import Container from "@/components/ui/container";
import { Title } from "@/components/ui/title";

export default function News() {
  return (
    <div className="flex flex-col items-center gap-4">
      <hr className="w-full opacity-10" />
      <Container className="p-5 mb-5 flex-col justify-center">
        <Title>Новости</Title>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Новость 1</h3>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
