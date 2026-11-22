import { content } from "@/content";
import { WhatsAppButton } from "./Ctas";
import { HeroPhoto } from "./HeroPhoto";
import { EmojiText, buttonStyles } from "./ui";

const { hero } = content;

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="bg-gradient-to-b from-sage-50 to-paper"
    >
      <div className="mx-auto grid max-w-6xl gap-x-14 gap-y-8 px-5 pb-16 pt-10 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,360px)] md:pb-24 md:pt-16">
        <div className="md:col-start-1 md:row-start-1">
          <h1 id="hero-title" className="text-4xl font-bold text-sage-900 sm:text-5xl">
            {hero.h1}
          </h1>
          <p className="mt-4 text-xl font-medium text-ink-soft sm:text-2xl">{hero.subheading}</p>
        </div>

        <div className="mx-auto w-full max-w-[300px] md:col-start-2 md:row-span-2 md:row-start-1 md:max-w-none md:self-start">
          <HeroPhoto />
        </div>

        <div className="md:col-start-1 md:row-start-2">
          <div className="space-y-4">
            {hero.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label={hero.chipsLabel}>
            {hero.chips.map((chip) => (
              <li
                key={chip}
                className="rounded-full bg-sage-100 px-4 py-1.5 text-base font-medium text-sage-900"
              >
                <EmojiText text={chip} />
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton label={hero.whatsappButton} placement="hero" />
            <a href="#contact" className={buttonStyles.secondary}>
              {hero.contactButton}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
