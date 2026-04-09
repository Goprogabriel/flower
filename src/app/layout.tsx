import type { Metadata } from "next";
import { LanguageProvider } from "@/components/i18n/language-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blomsterbuketter med omtanke",
  description:
    "Design en personlig blomsterbuket til en, du holder af, med et elegant og mobilvenligt blomsterunivers."
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="da">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
