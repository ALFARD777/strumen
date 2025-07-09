import Image from "next/image";
import NextLink from "next/link";

export const Logo: React.FC = () => (
  <div className="gap-3 max-w-fit">
    <NextLink
      className="flex justify-start items-center gap-1 transition-all duration-300 hover:scale-105"
      href="/"
    >
      <div className="relative w-[131px] h-[37px]">
        <Image
          fill
          priority
          alt="Гран-Система-С"
          src="/logo.png"
          sizes="131px 37px"
          className="object-contain brightness-150 select-none"
        />
      </div>
    </NextLink>
  </div>
);
