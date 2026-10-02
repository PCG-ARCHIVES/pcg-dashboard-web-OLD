import { Metadata } from "next";
import Link from "next/link";
import NavyGridBackground from "@/components/backgrounds/NavyGridBackground";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Vibertas pricing has not been set. Vibertas is in development and not yet released.",
};

export default function Pricing() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <NavyGridBackground className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient-gold">Pricing</span> Not Set
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Vibertas is in development and has not been released. There is nothing to buy yet,
            and no plans or prices have been decided.
          </p>
        </div>
      </NavyGridBackground>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Follow <span className="text-gradient-gold">Progress</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-8">
            Get updates from Alpha Protocol, or read about the planned features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.alphaprotocol.network/join"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Get updates
            </a>
            <Link href="/features" className="btn-secondary">
              Explore Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
