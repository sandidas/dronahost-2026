import HeadLineText from "@/components/ui/HeadLineText";
import Image from "@/components/ui/Image";
import Section from "@/components/ui/Section";
import NextImage from "next/image";
import Link from "next/link";
import React from "react";

/* ───────────────── TYPES ───────────────── */

type ButtonVariant = "primary" | "secondary" | string;

type ButtonItem = {
  label: string;
  variant: ButtonVariant;
  link: string;
};

type CardPosition = "top-left" | "middle-left" | "bottom-left";

type FloatingCard = {
  title: string;
  description: string;
  position: string;
};

type HeroSectionProps = {
  data: {
    heroSection: {
      title1: string;
      title2: string;
      description: string;

      background?: {
        src: string;
        alt: string;
      };

      buttons: ButtonItem[];

      members: {
        countText: string;
        avatars: string[];
      };

      heroImage: {
        src: string;
        alt: string;
      };

      floatingCards: FloatingCard[];

      decorations?: {
        backgroundBlur?: boolean;
        gradientOverlay?: boolean;
        curvedLines?: boolean;
      };
    };
  };
};

/* ───────────────── HELPERS ───────────────── */

const cardClassByPosition: Record<CardPosition, string> = {
  "top-left": "card-top-left",
  "middle-left": "card-mid-left",
  "bottom-left": "card-bottom-left",
};

const getCardClassByPosition = (position: string) => {
  if (position in cardClassByPosition) {
    return cardClassByPosition[position as CardPosition];
  }

  return cardClassByPosition["middle-left"];
};

const getButtonClassName = (variant: ButtonVariant) =>
  variant === "primary" ? "primary-btn" : "secondary-btn";

/* ───────────────── COMPONENT ───────────────── */

const HomeHero: React.FC<HeroSectionProps> = ({ data }) => {
  const { heroSection } = data;

  return (
    <Section
      size="lg"
      className="hero"
      aria-label="DronaHost web hosting"
    >
      {/* 2-column grid: text left, visual right */}
      <div className="relative z-[1] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center pb-9">

        {/* LEFT — text content */}
        <div className="hero-left">

          <HeadLineText
            as="h1"
            fontSize="sixXl"
            align="left"
            fontWeight="bold"
          >
            {heroSection.title1}
            <span className="text-primary"> {heroSection.title2}</span>
          </HeadLineText>

          <p className="max-w-xl text-gray-600 dark:text-slate-300">
            {heroSection.description}
          </p>

          {/* CTA buttons */}
          <div className="action-row">
            {heroSection.buttons.map((button) => (
              <Link
                key={button.label}
                href={button.link}
                className={getButtonClassName(button.variant)}
              >
                {button.label}
              </Link>
            ))}
          </div>

          {/* Social proof avatars */}
          <div className="member-row" role="group" aria-label="Trusted by our customers">
            <div className="members">
              {heroSection.members.avatars.map((avatar, index) => (
                <NextImage
                  key={index}
                  src={avatar}
                  alt={`Customer ${index + 1}`}
                  width={32}
                  height={32}
                  loading="lazy"
                  className="member-avatar rounded-full"
                />
              ))}
            </div>
            <span className="text-slate-700 dark:text-slate-200">
              {heroSection.members.countText}
            </span>
          </div>
        </div>

        {/* RIGHT — hero image + floating cards */}
        <div className="hero-right relative">

          {heroSection.decorations?.curvedLines && (
            <div
              aria-hidden="true"
              className="absolute h-125 w-125 border border-orange-300 rounded-full blur-2xl opacity-40"
            />
          )}

          <div className="connector" aria-hidden="true" />

          {/* LCP image — priority=true disables lazy loading */}
          <Image
            src={heroSection.heroImage.src}
            alt={heroSection.heroImage.alt}
            width={600}
            height={600}
            priority={true}
            className="hero-person"
            skeleton={false}
          />

          {heroSection.floatingCards.map((card, index) => (
            <article
              key={index}
              className={`floating-card ${getCardClassByPosition(card.position)}`}
            >
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </article>
          ))}

          <div className="orb" aria-hidden="true" />
        </div>
      </div>
    </Section>
  );
};

export default HomeHero;
