import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Package, Users, FileText, Tag, Book, Coins, FileCode, Link } from "lucide-react";

interface AnalysisResultsProps {
  data: {
    Dependencies?: string[];
    InstallationInstructions?: string[]; // Changed from Installation_Instructions and to array
    Authors?: string[];
    Contributors?: string[];
    Funding?: string[] | string; 
    DOI?: string[] | string;     
    License?: string;
    Keywords?: string[];
  };
}

export default function AnalysisResults({ data }: AnalysisResultsProps) {
  if (!data) {
    return null; // Or some fallback UI if data is not available
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      <Card className="glass-card border-0">
        <CardHeader className="space-y-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-lg border-b border-border">
          <CardTitle className="text-2xl text-primary">Repository Analysis Results</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Authors */}
            {data.Authors && data.Authors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center text-primary">
                  <Users className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Authors</h3>
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  {data.Authors.map((author, index) => (
                    <li key={index}>{author}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contributors */}
            {data.Contributors && data.Contributors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center text-primary">
                  <Users className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Contributors</h3>
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  {data.Contributors.map((contributor, index) => (
                    <li key={index}>{contributor}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dependencies */}
            {data.Dependencies && data.Dependencies.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center text-primary">
                  <Package className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Dependencies</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.Dependencies.map((dep, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className={index % 2 === 0 
                        ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20"
                        : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/20"
                      }
                    >
                      {dep}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Installation Instructions */}
            {data.InstallationInstructions && Array.isArray(data.InstallationInstructions) && data.InstallationInstructions.length > 0 && (
              <div className="space-y-2 md:col-span-2"> {/* Made it full width for better display */}
                <div className="flex items-center text-primary">
                  <FileCode className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Installation Instructions</h3>
                </div>
                <ul className="list-disc list-inside space-y-1 bg-secondary/50 p-3 rounded-md text-muted-foreground">
                  {data.InstallationInstructions.map((instruction, index) => (
                    <li key={index} className="font-mono text-sm whitespace-pre-wrap">{instruction}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Funding */}
            {data.Funding !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center text-primary">
                  <Coins className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Funding</h3>
                </div>
                {typeof data.Funding === 'string' && data.Funding.trim() !== '' ? (
                  <p className="text-muted-foreground">{data.Funding}</p>
                ) : Array.isArray(data.Funding) && data.Funding.length > 0 ? (
                  <ul className="space-y-1 text-muted-foreground">
                    {data.Funding.map((fund, index) => (
                      <li key={index}>{fund}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No funding information available.</p>
                )}
              </div>
            )}

            {/* DOI */}
            {data.DOI && (typeof data.DOI === 'string' && data.DOI.trim() !== '') || (Array.isArray(data.DOI) && data.DOI.length > 0) ? (
              <div className="space-y-2">
                <div className="flex items-center text-primary">
                  <Link className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">DOI</h3>
                </div>
                <p className="text-muted-foreground">
                  {Array.isArray(data.DOI) ? data.DOI.join(', ') : data.DOI}
                </p>
              </div>
            ) : null}


            {/* License */}
            {data.License && data.License.trim() !== '' && (
              <div className="space-y-2">
                <div className="flex items-center text-primary">
                  <Book className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">License</h3>
                </div>
                <p className="text-muted-foreground">{data.License}</p>
              </div>
            )}

            {/* Keywords */}
            {data.Keywords && Array.isArray(data.Keywords) && data.Keywords.length > 0 && (
              <div className="col-span-full space-y-2">
                <div className="flex items-center text-primary">
                  <Tag className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.Keywords.map((keyword, index) => (
                    <Badge 
                      key={index}
                      className={index % 2 === 0 
                        ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                        : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                      }
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}