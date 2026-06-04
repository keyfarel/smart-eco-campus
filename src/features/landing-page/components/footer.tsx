import { Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-card/50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Smart Eco-Campus Efficiency System by Group 6.
          </p>
        </div>
      </div>
    </footer>
  )
}
