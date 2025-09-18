import { useState } from "react";
import { Link } from "@tanstack/react-router";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm fixed w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              MINDHELPING
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#About" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Sobre nós
            </a>
            <a href="#WorkWithUs" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Trabalhe conosco
            </a>
            <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              FAQ
            </a>
            <a href="#Contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Contato
            </a>
            <Link to="/login">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors">
                Entrar
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <a 
                href="#About" 
                className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sobre nós
              </a>
              <a 
                href="#WorkWithUs" 
                className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trabalhe conosco
              </a>
              <a 
                href="#faq" 
                className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <a 
                href="#Contact" 
                className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contato
              </a>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full mt-2 bg-blue-600 text-white px-6 py-2 rounded-full font-medium">
                  Entrar
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;