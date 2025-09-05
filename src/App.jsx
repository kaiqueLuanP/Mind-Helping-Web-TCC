import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import WorkWithUs from './components/WorkWithUs';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Login from './routes/login';

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
      {/* <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm className="max-w-md w-full" />
    </div> */}

      
      {/* Conteúdo */}
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