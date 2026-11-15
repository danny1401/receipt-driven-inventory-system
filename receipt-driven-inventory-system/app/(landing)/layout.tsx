import { Header } from "@/components/landing";
import { Footer } from "@/components/structure";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
