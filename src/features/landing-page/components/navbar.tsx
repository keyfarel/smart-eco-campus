"use client"
import { Button } from "@/components/ui/button"
import { Leaf, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Team", href: "#team" },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-zinc-800/50">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors duration-300">
            <Leaf className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="font-semibold text-foreground hidden sm:inline">
            Eco-Campus
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link href="/login">
            <Button
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-medium"
            >
              Get Started
            </Button>
          </Link>
        </div>


        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-zinc-800">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-foreground py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link href="/login" className="w-full" onClick={() => setIsMenuOpen(false)}>
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-medium w-full mt-2"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
