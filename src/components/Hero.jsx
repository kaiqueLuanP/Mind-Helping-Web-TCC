import phone1 from '../assets/phone1.png';

function Hero() {
  return (
    <section id="Hero" className="relative bg-gradient-to-r from-blue-50 to-blue-100 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Apoio Emocional Ao Seu Alcance
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Conectamos você a profissionais qualificados para cuidar da sua saúde mental, quando e onde você precisar.
            </p>
            <div className="space-x-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors">
                Começar agora
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg text-base font-semibold hover:bg-blue-50 transition-colors">
                Saiba mais
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-100 w-48 h-48 bg-blue-200 rounded-full filter blur-2xl opacity-30"></div>
            <div className="relative">
              <img src={phone1} alt="App Preview" className="w-full max-w-xl mx-auto ml-30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Hero;