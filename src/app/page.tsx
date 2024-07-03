import CallToAction from "./_LandingPage/CallToAction";
import HeroSection from "./_LandingPage/HeroSection";
import ValueProposition from "./_LandingPage/ValueProposition";

export default function Home() {
  return (
    <div className="bg-slate-50">
      <HeroSection />
      <ValueProposition />
      <CallToAction />
    </div>
  );
}
