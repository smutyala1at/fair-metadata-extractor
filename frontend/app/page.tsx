import HeroSection from "@/components/sections/HeroSection";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import HowItWorks from "@/components/sections/HowItWorks";
import ResultsPreview from "@/components/sections/ResultsPreview";
import Community from "@/components/sections/Community";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <div className="w-full">
        <HeroSection />
        <div className="space-y-24 pb-24">
          <FeaturesGrid />
          <HowItWorks />
          <ResultsPreview />
          <Community />
        </div>
      </div>
      <Toaster />
    </main>
  );
}