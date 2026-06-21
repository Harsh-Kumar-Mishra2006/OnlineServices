import Footer from "../../components/common/Footer";
import Navbar from "../../components/common/Navbar";
import HeroPage from "../../components/Hero/Hero";
import AboutUs from "../../sections/Home/AboutUs";
import DescriptionPage from "../../sections/Home/DescriptionPage";
import Features from "../../sections/Home/Features";
import Testimonials from "../../sections/Home/Testimonials";
import WhyChooseUs from "../../sections/Home/WhyChooseUs";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <HeroPage />
      <AboutUs />
      <DescriptionPage />
      <Features />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default HomePage;
