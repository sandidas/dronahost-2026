import CTA from "@/components/Experience&Growth/CTA/cta";
import Expertise from "@/components/Experience&Growth/Expertise/Expertise";
import HeappyClients from "@/components/Experience&Growth/HappyClients/HappyClients";
import HeroSection from "@/components/Experience&Growth/HeroSection/HeroSection";
import Integration from "@/components/Experience&Growth/Integrations/Integrations";
import OurPartners from "@/components/Experience&Growth/OurPartners/OurPartners";
import OurProcess from "@/components/Experience&Growth/OurProcess/Ourprocess";
import OurWork from "@/components/Experience&Growth/OurWork/OurWork";
import Services from "@/components/Experience&Growth/services/services";
import ServicesDetails from "@/components/Experience&Growth/servicesDetails/servicesDetails";
import WebDesign from "@/components/Experience&Growth/WebDesign/WebDesign";
import data from "@/data/Experience&Growth.json";


export default function ExperienceGrowthPage() {
  const hero = data.experienceGrowthPage.hero;
  const expertise = data.experienceGrowthPage.expertise;
  const services = data.experienceGrowthPage.services;

  const servicesDetails =
    data.servicesDetailSection.servicesOverview;

  const ourPartners = data.experienceGrowthPage.partners;
  const ourProcess = data.experienceGrowthPage.process;
  const integrations = data.experienceGrowthPage.integrations;

  const clients = data.clientWorkSection.clients;
  const ctaBanner = data.clientWorkSection.ctaBanner;
  const ourWork = data.clientWorkSection.ourWork;

  return (
    <>
    

      <HeroSection data={hero} />
      <Expertise data={expertise} />

      <Services data={services} />
      

      <OurPartners data={ourPartners} />
      <OurProcess data={ourProcess} />
      <Integration data={integrations}

      />

      <HeappyClients data={clients} />
      <CTA data={ctaBanner} />
      <OurWork data={ourWork} />
    <ServicesDetails data={servicesDetails} />
    <WebDesign data={data.servicesDetailSection.serviceDetail} />
     
    </>
  );
}