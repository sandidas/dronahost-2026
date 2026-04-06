import FeatureSection from "@/components/home/FeatureSection/FeatureSection";
import HeroSection from "@/components/home/hero-section/HomeHeroSection";
import homeData from "@/data/home.json";
import Footer from "@/layouts/footer/footer";

function App() {
  return (
    <div>
      <HeroSection data={homeData} />
      <FeatureSection data={homeData.featuresSection} />
      <Footer />
    </div>
  );
}

export default App;