import { SiteFooter } from "@/components/layout/site-footer";

type SiteLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="site-frame">
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
