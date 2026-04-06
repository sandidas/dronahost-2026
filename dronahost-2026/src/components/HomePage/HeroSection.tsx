import React from "react";

type MenuItem = {
  label: string;
  hasDropdown: boolean;
};

type ButtonItem = {
  label: string;
  variant: "primary" | "secondary";
  link: string;
};

type FloatingCard = {
  title: string;
  description: string;
  position: "top-left" | "middle-left" | "bottom-left";
};

const homeData = {
  navbar: {
    logo: {
      main: "drona",
      highlight: "host",
    },
    menu: [
      { label: "Web Hosting", hasDropdown: true },
      { label: "Wordpress", hasDropdown: true },
      { label: "Website Building", hasDropdown: true },
      { label: "E commerce", hasDropdown: false },
      { label: "Email Marketing", hasDropdown: false },
    ] as MenuItem[],
    cta: {
      label: "Login",
      link: "/login",
    },
  },
  heroSection: {
    title: "Reliable & Powerful Cloud Web Hosting",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
    buttons: [
      {
        label: "Get Started",
        variant: "primary",
        link: "/get-started",
      },
      {
        label: "View Plans",
        variant: "secondary",
        link: "/plans",
      },
    ] as ButtonItem[],
    members: {
      countText: "50K+ Members",
      avatars: ["/avatar1.svg", "/avatar2.svg", "/avatar3.svg"],
    },
    heroImage: {
      src: "/Images/Home/ManWithLaptop.svg",
      alt: "User working on laptop",
    },
    floatingCards: [
      {
        title: "Lorem ipsum dolor",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
        position: "top-left",
      },
      {
        title: "Lorem ipsum dolor",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
        position: "middle-left",
      },
      {
        title: "Lorem ipsum dolor",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
        position: "bottom-left",
      },
    ] as FloatingCard[],
  },
};

const cardClassByPosition: Record<FloatingCard["position"], string> = {
  "top-left": "card-top-left",
  "middle-left": "card-mid-left",
  "bottom-left": "card-bottom-left",
};

const HeroSection: React.FC = () => {
  const { navbar, heroSection } = homeData;
  const titleParts = heroSection.title.split(" Cloud ");

  return (
    <section className="hero">
      <div className="hero-overlay" aria-hidden="true" />

      <nav className="hero-nav hero-container">
        <div className="brand" aria-label="DronaHost logo">
          {navbar.logo.main}
          <span>{navbar.logo.highlight}</span>
        </div>

        <ul className="nav-links">
          {navbar.menu.map((item) => (
            <li key={item.label}>
              {item.label}
              {item.hasDropdown ? " v" : ""}
            </li>
          ))}
        </ul>

        <button className="login-btn" type="button" aria-label={navbar.cta.link}>
          {navbar.cta.label}
        </button>
      </nav>

      <div className="hero-body hero-container">
        <div className="hero-left">
          <h1>
            {titleParts[0]}
            <br />
            Cloud {titleParts[1] ?? "Web Hosting"}
          </h1>

          <p>{heroSection.description}</p>

          <div className="action-row">
            {heroSection.buttons.map((button) => (
              <button
                key={button.label}
                className={button.variant === "primary" ? "primary-btn" : "secondary-btn"}
                type="button"
                aria-label={button.link}
              >
                {button.label}
              </button>
            ))}
          </div>

          <div className="member-row" aria-label="Members summary">
            <div className="members">
              {heroSection.members.avatars.map((avatar, index) => (
                <img key={avatar} src={avatar} alt={`Member avatar ${index + 1}`} />
              ))}
            </div>
            <span>{heroSection.members.countText}</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="connector" aria-hidden="true" />
          <img
            src={heroSection.heroImage.src}
            alt={heroSection.heroImage.alt}
            className="hero-person"
          />

          {heroSection.floatingCards.map((card, index) => (
            <article
              key={`${card.title}-${index}`}
              className={`floating-card ${cardClassByPosition[card.position]}`}
            >
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </article>
          ))}

          <div className="orb" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;