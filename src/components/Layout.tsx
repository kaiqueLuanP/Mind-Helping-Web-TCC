import React, { useState } from 'react'
import { Link, Outlet } from '@tanstack/react-router'
import { User, Menu, X } from 'lucide-react'

interface LayoutProps {
  children?: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-sky-500 text-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="font-bold text-lg">Mind Helping</div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="opacity-90 hover:opacity-100 transition-opacity duration-200"
              >
                Início
              </Link>
              <Link
                to="/calendar"
                className="opacity-90 hover:opacity-100 transition-opacity duration-200"
              >
                Agenda
              </Link>
            </nav>

            {/* User Info - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-sm">Profissional</div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-white/10 rounded-md transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/20">
              <nav className="flex flex-col space-y-3 pt-4">
                <Link
                  to="/"
                  className="opacity-90 hover:opacity-100 transition-opacity duration-200 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Início
                </Link>
                <Link
                  to="/calendar"
                  className="opacity-90 hover:opacity-100 transition-opacity duration-200 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Agenda
                </Link>
                <div className="flex items-center gap-3 pt-3 border-t border-white/20">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-sm">Profissional</div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="pt-20 max-w-7xl mx-auto px-4 pb-12">
        {children ?? <Outlet />}
      </main>
    </div>
  )
}