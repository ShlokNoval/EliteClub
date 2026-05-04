import PageTransition from '../../components/layout/PageTransition';
import BackgroundBubbles from '../../components/common/BackgroundBubbles';
import Hero from '../../components/home/Hero';
import MembershipReveal from '../../components/home/MembershipReveal';
import AboutSection from '../../components/home/AboutSection';
import Benefits from '../../components/home/Benefits';
import HowItWorks from '../../components/home/HowItWorks';
import Partners from '../../components/home/Partners';
import FAQ from '../../components/home/FAQ';
import ContactForm from '../../components/home/ContactForm';

export default function HomePage() {
  return (
    <PageTransition>
      <div className="bg-black-primary text-champagne relative min-h-screen">
        <BackgroundBubbles />

        <div className="relative z-10">
          <Hero />
          {/* MembershipReveal: 400vh sticky section — bottle descends into cards */}
          <MembershipReveal />
          <div className="section-divider w-full max-w-6xl" />
          <AboutSection />
          <div className="section-divider w-full max-w-6xl" />
          <Benefits />
          <HowItWorks />
          <div className="section-divider w-full max-w-6xl" />
          <Partners />
          <div className="section-divider w-full max-w-6xl" />
          <FAQ />
          <div className="section-divider w-full max-w-6xl" />
          <ContactForm />
        </div>
      </div>
    </PageTransition>
  );
}
