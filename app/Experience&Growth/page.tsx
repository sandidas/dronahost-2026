import Expertise from "@/components/Experience&Growth/Expertise/Expertise";
import HeappyClients from "@/components/Experience&Growth/HappyClients/HappyClients";
import HeroSection from "@/components/Experience&Growth/HeroSection/HeroSection";
import Integration from "@/components/Experience&Growth/Integrations/Integrations";
import OurPartners from "@/components/Experience&Growth/OurPartners/OurPartners";
import OurProcess from "@/components/Experience&Growth/OurProcess/Ourprocess";
import Services from "@/components/Experience&Growth/services/services";

import data from "@/data/Experience&Growth.json";

import Footer from "@/layouts/footer/footer";
import Header from "@/layouts/header/header";

export default function ExperienceGrowthPage() {
  const hero = data.experienceGrowthPage.hero;
  const expertise = data.experienceGrowthPage.expertise;
  const services = data.experienceGrowthPage.services;
  const ourPartners = data.experienceGrowthPage.partners;
  const ourProcess = data.experienceGrowthPage.process;
  const integrations = data.experienceGrowthPage.integrations;
  const clients =
    data.clientWorkSection.clients;

  return (
    <>
      <Header />

      <HeroSection data={hero} />
      <Expertise data={expertise} />
      <Services data={services} />

      <OurPartners data={ourPartners} />
      <OurProcess data={ourProcess} />
      <Integration data={integrations} />
 
      <HeappyClients data={clients} />

      <Footer />
    </>
  );
}