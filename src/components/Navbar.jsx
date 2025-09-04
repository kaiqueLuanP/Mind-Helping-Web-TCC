function Navbar() {
  return (
    <nav className="bg-white/95 backdrop-blur-sm fixed w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              MINDHELPING
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#About" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Sobre nós</a>
            <a href="#WorkWithUs" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Trabalhe conosco</a>
            <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">FAQ</a>
            <a href="#Contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Contato</a>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors">
              Entrar
            </button>
          </div>
          <button className="md:hidden">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;