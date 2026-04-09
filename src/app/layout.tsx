import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
