import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/admin/LoginForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Painel administrativo",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 py-16 px-8 bg-bg-sunken">
      <div className="flex items-center gap-3">
        <Image src="/images/logo-icon.png" alt="" width={44} height={46} className="h-11 w-auto" />
        <div>
          <div className="text-text-1 font-semibold" style={{ font: "var(--text-label)" }}>
            {SITE.name}
          </div>
          <div className="text-text-2" style={{ font: "var(--text-caption)" }}>
            Painel administrativo
          </div>
        </div>
      </div>
      <LoginForm />
    </div>
  );
}
