import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80svh] flex-col justify-center pt-24">
      <p className="label">Error 404 · p &lt; 0.001</p>
      <h1 className="display mt-6 text-[clamp(3rem,10vw,9rem)]">
        We reject the hypothesis that this page <em>exists</em>.
      </h1>
      <p className="text-ink-2 mt-8 max-w-[34rem]">
        The evidence is overwhelming and the test was two-sided. The rest of the site, however, is very likely real.
      </p>
      <Link href="/" className="link-ink mt-10 self-start">
        Return to the home page
      </Link>
    </section>
  );
}
