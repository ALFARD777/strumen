import "./globals.css";
import clsx from "clsx";
import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { ThemeProvider } from "@/components/shared/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import { fontLack, fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  keywords: ["энергетика", "приборы учета", "энергосбережение", "Беларусь", "Strumen"],
  openGraph: {
    title: "ГРАН-СИСТЕМА-С (Strumen)",
    description:
      "Ведущий разработчик и производитель приборов учета и потребления энергоресурсов в Республике Беларусь",
    url: "https://strumen.com",
    siteName: "Strumen",
    type: "website",
    locale: "ru_BY",
  },
  metadataBase: new URL("https://strumen.com"),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="ru">
      <body
        className={clsx(
          "min-h-screen bg-background text-foreground antialiased",
          fontLack.className,
          fontSans.variable,
        )}
      >
        <ThemeProvider enableSystem attribute="class" defaultTheme="light">
          <div className="flex flex-col h-screen">
            <Header />
            <main className="flex-1 pt-19 lg:pt-0">{children}</main>
            <Toaster />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
