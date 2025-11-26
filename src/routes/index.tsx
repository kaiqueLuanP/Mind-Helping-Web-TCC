import { createFileRoute } from '@tanstack/react-router'
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About'; 
import WorkWithUs from '../components/WorkWithUs';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})
function RouteComponent() {
  return (
      <div className="min-h-screen text-white relative">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90 z-0"
          style={{
            backgroundImage: "url('/background.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            mixBlendMode: 'overlay'
          }}
        />
        
        <div className="relative z-10">
          <Navbar />
          <Hero />
          <div id="About">
            <About />
          </div>
          <div id="WorkWithUs">
            <WorkWithUs />
          </div>
          <div id="faq">
            <FAQ />
          </div>
          <div id="Contact">
            <Contact />
          </div>
        </div>
      </div>
    );
}