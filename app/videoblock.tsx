"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import dynamic from "next/dynamic";

const VideoPlayground = dynamic(() => import("@/app/videoplayground"), {
  ssr: false,
});

export default function VideoBlock() {
  return (
    <div className="relative w-full h-[300px] lg:h-[500px] overflow-hidden shadow-xl">
      <div className="absolute inset-0 -z-10">
        <VideoPlayground />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 drop-shadow-lg tracking-widest">ГРАН-СИСТЕМА-С</h1>
        <p className="text-xl max-w-xl drop-shadow-md">
          Ведущий разработчик и производитель приборов учета и потребления энергоресурсов в Республике Беларусь
        </p>
        <div className="w-full absolute bottom-0 left-0 flex justify-center mb-2">
          <a href="#prod">
            <DotLottieReact
              loop
              autoplay
              className="h-20"
              src="https://lottie.host/9aa12607-c4bf-4a0f-9fc9-216b0c2ca5a3/a8W25oDE1Y.json"
              speed={1}
              style={{ width: "100px", height: "100px" }}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
