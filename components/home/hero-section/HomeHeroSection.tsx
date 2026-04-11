import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
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

const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  const { heroSection } = data;

  return (
    <Section
      size="lg"
      
      hAlign="left"
      bgImage={heroSection.background?.src}
      bgImagePosition="center"
      bgImageSize="cover"
      className="hero relative overflow-hidden"
    >
    

      {/* ───────── MAIN CONTENT ───────── */}
      <div className="hero-body hero-container relative z-2">
        
        {/* LEFT */}
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

          {/* BUTTONS */}
          <div className="action-row">
            {heroSection.buttons.map((button) => (
              <button
                key={button.label}
                className={getButtonClassName(button.variant)}
              >
                {button.label}
              </button>
            ))}
          </div>

          {/* MEMBERS */}
          <div className="member-row">
            <div className="members">
              {heroSection.members.avatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Member ${index + 1}`}
                  className="member-avatar"
                />
              ))}
            </div>
            <span className="text-slate-700 dark:text-slate-200">{heroSection.members.countText}</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hero-right relative">

          {/* OPTIONAL CURVED BG */}
          {heroSection.decorations?.curvedLines && (
            <div className="absolute h-125 w-125 border border-orange-300 rounded-full blur-2xl opacity-40" />
          )}

          {/* CONNECTOR */}
          <div className="connector" aria-hidden="true" />

          {/* HERO IMAGE */}
          <img
            src={heroSection.heroImage.src}
            alt={heroSection.heroImage.alt}
            className="hero-person"
          />

          {/* FLOATING CARDS */}
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

export default HeroSection;