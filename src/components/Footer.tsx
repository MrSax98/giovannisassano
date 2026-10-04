import { profile } from "@/content/profile";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-rule border-t">
      <div className="shell grid-editorial text-ink-3 gap-y-6 py-10 text-[0.82rem]">
        <p className="col-span-4 md:col-span-3 lg:col-span-3">
          © {year} {profile.name}
        </p>
        <p className="col-span-4 md:col-span-5 lg:col-span-6">
          Set in Instrument Serif, Hanken Grotesk and JetBrains Mono. Figures drawn live with Canvas and SVG; no stock
          photographs were harmed. Built with Next.js, deployed from GitHub.
        </p>
        <p className="col-span-4 md:col-span-8 lg:col-span-3 lg:text-right">
          <a href="#main" className="link-ink">
            Back to the top ↑
          </a>
        </p>
      </div>
    </footer>
  );
}
