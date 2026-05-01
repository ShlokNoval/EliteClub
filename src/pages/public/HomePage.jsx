import PageTransition from '../../components/layout/PageTransition';
import BottleSequence from '../../components/home/BottleSequence';
import Hero from '../../components/home/Hero';
import AboutSection from '../../components/home/AboutSection';
import MembershipPlans from '../../components/home/MembershipPlans';
import Benefits from '../../components/home/Benefits';
import HowItWorks from '../../components/home/HowItWorks';
import Partners from '../../components/home/Partners';
import FAQ from '../../components/home/FAQ';
import ContactForm from '../../components/home/ContactForm';

export default function HomePage() {
  return (
    <PageTransition>
      <BottleSequence />
      <Hero />
      <div className="section-divider w-full max-w-6xl" />
      <AboutSection />
      <div className="section-divider w-full max-w-6xl" />
      <MembershipPlans />
      <div className="section-divider w-full max-w-6xl" />
      <Benefits />
      <HowItWorks />
      <div className="section-divider w-full max-w-6xl" />
      <Partners />
      <div className="section-divider w-full max-w-6xl" />
      <FAQ />
      <div className="section-divider w-full max-w-6xl" />
      <ContactForm />
    </PageTransition>
  );
}
