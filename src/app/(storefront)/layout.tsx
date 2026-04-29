import { Header } from "@/components/store/header";
import { Navigation } from "@/components/store/navigation";
import { CartDrawer } from "@/components/store/cart-drawer";
import { Footer } from "@/components/store/footer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <div className="pt-16">
        <Navigation />
        <CartDrawer />
        <main className="flex-1">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
