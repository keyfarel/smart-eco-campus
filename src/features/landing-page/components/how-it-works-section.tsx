import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, Eye, Database } from "lucide-react"

const features = [
  {
    icon: Cpu,
    title: "IoT Sensor Network",
    description: "Deploy thousands of smart sensors across your campus to monitor temperature, humidity, air quality, and energy consumption in real-time.",
    highlights: ["Smart Sensors", "Edge Computing", "Low Latency"],
  },
  {
    icon: Eye,
    title: "AI Vision Analytics",
    description: "Leverage computer vision and machine learning to analyze occupancy patterns, optimize lighting, and detect anomalies automatically.",
    highlights: ["Object Detection", "Pattern Recognition", "Predictive Models"],
  },
  {
    icon: Database,
    title: "Big Data Platform",
    description: "Process millions of data points per second with our scalable analytics engine. Generate actionable insights and predictive maintenance alerts.",
    highlights: ["Real-time Processing", "Data Lake", "Custom Dashboards"],
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 px-6 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_70%)]" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-emerald-500 font-semibold text-sm uppercase tracking-wider mb-3">
            Technology Stack
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Our integrated platform combines three core technologies to deliver 
            unprecedented efficiency and sustainability.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="bg-card border-zinc-800 hover:border-emerald-500/30 transition-all duration-300 group"
            >
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-emerald-500" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base leading-relaxed mb-6">
                  {feature.description}
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  {feature.highlights.map((highlight, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Connection lines visual */}
        <div className="hidden md:flex justify-center items-center mt-12 gap-4">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        </div>
      </div>
    </section>
  )
}
