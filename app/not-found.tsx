import { IconHome2Filled } from "@tabler/icons-react";
import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Страница не найдена" };

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-full relative mx-2">
      <div className="absolute -top-0 left-0 w-full h-full -z-10">
        <div className="flex flex-col items-center justify-center h-full relative">
          <h1 className="text-10xl sm:text-12xl md:text-13xl lg:text-14xl font-bold opacity-10 flex flex-col relative">
            404
            <p className="font-bold text-lg text-center absolute bottom-10 sm:bottom-15 md:bottom-20 left-0 w-full">
              Страница не найдена
            </p>
          </h1>
        </div>
      </div>
      <ButtonLink href="/" className="mt-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
        <IconHome2Filled />
        На главную
      </ButtonLink>
    </div>
  );
}
