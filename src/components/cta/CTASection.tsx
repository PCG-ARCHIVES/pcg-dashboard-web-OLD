export default function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Build on the <span className="text-gradient-gold">Mesh</span>?
        </h2>
        <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-2xl mx-auto">
          Vibertas is in development and not yet released.
          Follow Alpha Protocol for updates.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://www.alphaprotocol.network/join"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-lg px-8 py-4"
          >
            Get updates
          </a>
          <a
            href="https://discord.gg/vibertas"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-lg px-8 py-4"
          >
            Join the Community
          </a>
        </div>
      </div>
    </section>
  );
}
