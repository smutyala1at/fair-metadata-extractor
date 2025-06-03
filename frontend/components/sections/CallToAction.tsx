"use client";

import { useState } from "react";
import { ArrowRight, Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateRepoUrl } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function CallToAction() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [analysisResults, setAnalysisResults] = useState(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setRepoUrl(url);
    setIsValid(url === "" || validateRepoUrl(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repoUrl) {
      toast({
        title: "URL required",
        description: "Please enter a repository URL",
        variant: "destructive",
      });
      return;
    }

    if (!validateRepoUrl(repoUrl)) {
      setIsValid(false);
      toast({
        title: "Invalid URL",
        description: "Please enter a valid GitHub or GitLab repository URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResults(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: repoUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysisResults(data.data);
      toast({
        title: "Analysis complete",
        description: "Repository metadata has been extracted successfully",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Extract comprehensive research metadata in seconds",
    "Identify authors, contributors, and funding sources",
    "Get installation instructions and dependencies",
    "Access DOIs, licenses, and research keywords"
  ];

  return (
    <section className="w-full py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container relative mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Ready to Extract Research Metadata?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Unlock valuable insights from any research repository on GitHub or GitLab. Start analyzing your repositories now.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-10">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-0 h-5 w-5 mt-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  type="url" 
                  value={repoUrl}
                  onChange={handleInputChange}
                  placeholder="Enter GitHub or GitLab repository URL"
                  className={`h-12 bg-secondary pl-10 ${!isValid ? 'border-destructive focus-visible:ring-destructive' : 'border-border'}`}
                />
                {!isValid && (
                  <p className="text-destructive text-sm mt-1 text-left">
                    Please enter a valid GitHub or GitLab repository URL
                  </p>
                )}
              </div>
              <Button 
                type="submit" 
                className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⟳</span> Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Analyze Now <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start"
              >
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="ml-3 text-muted-foreground">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}