import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import React from "react";

type MenuItem = {
  label: string;
  hasDropdown: boolean;
};

type ButtonItem = {
  label: string;
  variant: string;
  link: string;
};

type FloatingCard = {
  title: string;
  description: string;
  position: string;
};

type HeroSectionProps = {
  data: {
    navbar: {
      logo: {
        main: string;
        highlight: string;
      };
      menu: MenuItem[];
      cta: {
        label: string;
        link: string;
      };
    };
    heroSection: {
      title: string;
      description: string;
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
    };
  };
};

const cardClassByPosition: Record<string, string> = {
  "top-left": "card-top-left",
  "middle-left": "card-mid-left",
  "bottom-left": "card-bottom-left",
};

const getButtonClassName = (variant: string) =>
  variant === "primary" ? "primary-btn" : "secondary-btn";

const getCardClassName = (position: string) =>
  cardClassByPosition[position] ?? "card-bottom-left";

const defaultAvatars = [
  "/images/home/client1.svg",
  "/images/home/client3.svg",
  "/images/home/client2.svg",
];

const getSafeAvatar = (avatar: string, index: number) => {
  const hasValidPath =
    avatar.startsWith("/images/home/") && avatar.toLowerCase().endsWith(".svg");
  return hasValidPath ? avatar : defaultAvatars[index] ?? defaultAvatars[0];
};

const getSafeHeroImage = (imageSrc: string) => {
  if (imageSrc.startsWith("/images/")) return imageSrc;
  return "/images/home/ManWithLaptop.svg";
};

const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  const { navbar, heroSection } = data;

  const titleParts = heroSection.title.split(" Cloud ");

  return (
    <Section height="screen" padding="hero" hAlign="left" className="hero">
      <div className="hero-overlay" aria-hidden="true" />

      {/* Navbar */}
      <nav className="hero-nav hero-container">
        <div className="brand">
          {navbar.logo.main}
          <span>{navbar.logo.highlight}</span>
        </div>

        <ul className="nav-links">
          {navbar.menu.map((item: MenuItem) => (
            <li key={item.label}>
              {item.label}
              {item.hasDropdown ? " v" : ""}
            </li>
          ))}
        </ul>

        <button className="login-btn">{navbar.cta.label}</button>
      </nav>

      {/* Hero Body */}
      <div className="hero-body hero-container">
        {/* Left */}
        <div className="hero-left">

          {/*  HeadLineText USED HERE */}
          <HeadLineText
            as="h1"
            fontSize="sixXl"
            align="left"
            fontWeight="bold"
          >
            {titleParts[0]}
            <br />
            <span className="text-primary">
              Cloud {titleParts[1] ?? "Web Hosting"}
            </span>
          </HeadLineText>

          <p>{heroSection.description}</p>

          {/* Buttons */}
          <div className="action-row">
            {heroSection.buttons.map((button: ButtonItem) => (
              <button
                key={button.label}
                className={getButtonClassName(button.variant)}
              >
                {button.label}
              </button>
            ))}
          </div>

          {/* Members */}
          <div className="member-row">
            <div className="members">
              {heroSection.members.avatars.map((avatar: string, index: number) => (
                <img
                  key={`${avatar}-${index}`}
                  src={getSafeAvatar(avatar, index)}
                  alt={`Member avatar ${index + 1}`}
                />
              ))}
            </div>
            <span>{heroSection.members.countText}</span>
          </div>
        </div>

        {/* Right */}
        <div className="hero-right">
          <div className="connector" aria-hidden="true" />

          <img
            src={getSafeHeroImage(heroSection.heroImage.src)}
            alt={heroSection.heroImage.alt}
            className="hero-person"
          />

          {/* Floating Cards */}
          {heroSection.floatingCards.map((card: FloatingCard, index: number) => (
            <article
              key={index}
              className={`floating-card ${getCardClassName(card.position)}`}
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