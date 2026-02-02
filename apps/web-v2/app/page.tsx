import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import AboutSection from "@/components/sections/AboutSection";
import TechStackSection from "@/components/sections/TechStackSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
// import SaaSSection from "@/components/sections/SaaSSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CaseStudiesSection from "@/components/sections/CaseStudiesSection";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
	return (
		<>
		<Navbar/>
		<div id="home">
			<Hero/>
		</div>
		<AboutSection/>
		<TechStackSection/>
		<ProjectsSection/>
		{/* <SaaSSection/> */}
		<ExperienceSection/>
		<TestimonialsSection/>
		<CaseStudiesSection/>
		<CTASection/>
		<Footer/>
		</>
	
	);
}
