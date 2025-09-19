import phone1 from '../assets/phone1.png';
import { Button } from './ui/button';

function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-blue-100 pt-24 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Apoio Emocional Ao Seu Alcance
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Conectamos você a profissionais qualificados para cuidar da sua saúde mental, quando e onde você precisar.
            </p>
            <div className="flex justify-between items-center gap-x-2">
              <Button type="button" className="w-full bg-blue-600 text-white px-6 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors">
                Começar agora
              </Button>
              <Button type="button" variant="outline" className="w-full border-2 border-blue-600 text-blue-600 px-6 rounded-lg text-base font-semibold">
                Saiba mais
              </Button>
            </div>
          </div>
          <img src={phone1} alt="App Preview" className='' />
        </div>
      </div>
    </section>
  );
}
export default Hero;