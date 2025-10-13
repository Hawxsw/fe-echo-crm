import { Header, Hero, Stats, Features, Benefits, CTA, Footer } from '@/components/landing';

export default function Landing() {

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <Benefits />
      <CTA />
      <Footer />
    </div>
  );
}

