import About from './components/About';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import WorkWithUs from './components/WorkWithUs';

function App() {
  return (
    <div className="min-h-screen  text-white relative">
      {/* Overlay gradiente semi-transparente */}
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
        <About />
        <WorkWithUs />
        <FAQ />
        <Contact />
      </div>
    </div>
  );
}

export default App;