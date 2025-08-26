import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { scrollToTop } from "@/hooks/use-scroll-to-top";
import biomesDataRaw from '@/data/biomes.json';
import { Biome } from '@/types/biome';
import { loadBiomesWithImages } from '@/lib/imageLoader';

const biomesData = loadBiomesWithImages(biomesDataRaw as Biome[]);

const BiomePage = () => {
  const { biomeId } = useParams();
  const navigate = useNavigate();
  
  const biome = biomesData.find(b => b.id === biomeId);

  useEffect(() => {
    if (!biome) {
      navigate('/');
      return;
    }
    
    // Apply biome theme
    const root = document.documentElement;
    root.style.setProperty('--biome-primary', biome.theme.primary);
    root.style.setProperty('--biome-accent', biome.theme.accent);
    root.style.setProperty('--biome-bg', biome.theme.bg);
    
    return () => {
      // Reset theme on unmount
      root.style.removeProperty('--biome-primary');
      root.style.removeProperty('--biome-accent');
      root.style.removeProperty('--biome-bg');
    };
  }, [biome, navigate]);

  if (!biome) {
    return null;
  }

  const handleSubBiomeClick = (subBiomeId: string) => {
    scrollToTop();
    navigate(`/biome/${biomeId}/${subBiomeId}`);
  };

  const handleBackToHome = () => {
    scrollToTop();
    navigate('/');
  };

  // Utiliser l'image personnalisée si disponible, sinon fallback sur Unsplash
  const biomeImageUrl = biome.image || `https://images.unsplash.com/1600x600/?${biome.theme.unsplash}&w=1600&h=600&fit=crop`;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={biomeImageUrl}
          alt={biome.nom}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHome}
              className="text-white hover:bg-white/20 mb-6 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux biomes
            </Button>
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">{biome.nom}</h1>
              <p className="text-xl text-white/90 mb-4 drop-shadow">
                {biome.subBiomes.length} sous-biome{biome.subBiomes.length > 1 ? 's' : ''} à découvrir
              </p>
              <p className="text-white/80 text-lg max-w-2xl">
                Explorez les différents écosystèmes de ce biome et évaluez votre expérience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-background to-muted/10 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4" style={{ color: biome.theme.primary }}>
                Choisissez un sous-biome à évaluer
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Chaque sous-biome offre une expérience unique avec ses propres caractéristiques
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {biome.subBiomes.map((subBiome) => {
              // Utiliser l'image personnalisée du sous-biome si disponible, sinon fallback sur Unsplash
              const subBiomeImageUrl = subBiome.image || `https://images.unsplash.com/800x600/?${biome.theme.unsplash}+${subBiome.nom.toLowerCase().replace(/\s+/g, '+')}`;
              
              return (
                <Card 
                  key={subBiome.id}
                  className="group relative overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-elevated h-48"
                  onClick={() => handleSubBiomeClick(subBiome.id)}
                >
                  <div className="absolute inset-0 transition-all duration-500 group-hover:scale-110">
                    <img
                      src={subBiomeImageUrl}
                      alt={subBiome.nom}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  
                  <div className="relative z-10 p-6 h-48 flex flex-col justify-end text-white">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-white drop-shadow-lg group-hover:scale-105 transition-transform">
                          {subBiome.nom}
                        </h3>
                        <ChevronRight 
                          className="w-5 h-5 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" 
                        />
                      </div>
                      
                      {subBiome.subEcosystems && subBiome.subEcosystems.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {subBiome.subEcosystems.slice(0, 2).map((ecosystem, index) => (
                              <Badge 
                                key={index} 
                                className="text-xs bg-white/20 text-white border-white/30 backdrop-blur-sm"
                              >
                                {ecosystem}
                              </Badge>
                            ))}
                            {subBiome.subEcosystems.length > 2 && (
                              <Badge className="text-xs bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                +{subBiome.subEcosystems.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-white/80 drop-shadow">
                      Cliquez pour commencer l'évaluation
                    </div>
                  </div>
                </Card>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiomePage;