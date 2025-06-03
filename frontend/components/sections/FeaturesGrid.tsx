"use client";

import { BarChart2, Code, Github, Microscope, Zap, Award } from "lucide-react";
import FeatureCard from "@/components/ui/FeatureCard";

export default function FeaturesGrid() {
  const features = [
    {
      icon: <Award className="h-10 w-10 text-blue-400" />,
      title: "FAIR Metadata Extraction",
      description: "Extract Findable, Accessible, Interoperable, and Reusable metadata from research repositories."
    },
    {
      icon: <Zap className="h-10 w-10 text-purple-400" />,
      title: "LLM-Powered Analysis",
      description: "Leverage advanced language models to understand research context and extract relevant metadata."
    },
    {
      icon: <Github className="h-10 w-10 text-blue-400" />,
      title: "GitHub Integration",
      description: "Seamlessly analyze any public GitHub repository with a simple URL input."
    },
    {
      icon: <Microscope className="h-10 w-10 text-purple-400" />,
      title: "Research Focus",
      description: "Optimized for academic and scientific repositories with special attention to research artifacts."
    },
    {
      icon: <BarChart2 className="h-10 w-10 text-blue-400" />,
      title: "Instant Results",
      description: "Get comprehensive metadata analysis in seconds without complex setup or configuration."
    },
    {
      icon: <Code className="h-10 w-10 text-purple-400" />,
      title: "Open Source",
      description: "Built with transparency and community in mind. Contribute to improving research discoverability."
    }
  ];

  return (
    <section className="w-full py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Powerful Features for Research Metadata
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our tool provides comprehensive metadata extraction designed specifically for research projects.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}