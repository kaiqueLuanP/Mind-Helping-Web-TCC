import { Link } from "@tanstack/react-router";
import professional from '../assets/professional.png';
import { Button } from './ui/button';

function WorkWithUs() {
  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Trabalhe conosco</h2>
              <div className="w-20 h-1 bg-blue-600"></div>
            </div>
            <p className="text-base text-gray-600">
              Junte-se a nossa missão de tornar o cuidado emocional acessível a todos.
              Buscamos profissionais apaixonados e comprometidos com a transformação da saúde mental no Brasil.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-1.5 rounded-full">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Icone de check</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">Flexibilidade de horários</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-1.5 rounded-full">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Icone de check</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">Plataforma intuitiva</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-1.5 rounded-full">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Icone de check</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">Suporte dedicado</span>
              </div>
            </div>
            <Link to="/login">
              <Button type='button' className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors">
                Junte-se a nós
              </Button>
            </Link>
          </div>
          <div className="relative flex justify-center items-center">
            <img
              src={professional}
              alt="Professional"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
export default WorkWithUs;
