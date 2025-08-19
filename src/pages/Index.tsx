import { BiomeCard } from "@/components/BiomeCard";
import { Button } from "@/components/ui/button";
import { HistoryModal } from "@/components/HistoryModal";

import biomesDataRaw from "@/data/biomes.json";
import type { Biome } from "@/types/biome";
import { loadBiomesWithImages } from "@/lib/imageLoader";
import { getAllEvaluations } from "@/lib/storage";
import { useState, useEffect } from "react";
import { MapPin, Leaf, Star } from "lucide-react";
import heroImage from "@/assets/hero-biomes.jpg";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const biomesData = loadBiomesWithImages(biomesDataRaw as Biome[]);

const Index = () => {
  const [showHistory, setShowHistory] = useState(false);
  
  // Utiliser Convex pour récupérer les évaluations de l'utilisateur
  const userEvaluations = useQuery(api.users.getUserEvaluations);
  const hasEvaluations = userEvaluations && userEvaluations.length > 0;
  
  // Fallback vers le stockage local si l'utilisateur n'est pas connecté
  const [localEvaluations, setLocalEvaluations] = useState(false);
  
  useEffect(() => {
    if (userEvaluations === undefined) {
      // L'utilisateur n'est pas connecté, utiliser le stockage local
      const evaluations = getAllEvaluations();
      setLocalEvaluations(evaluations.length > 0);
    }
  }, [userEvaluations]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative h-screen overflow-hidden">
        <img
          src={heroImage}
          alt="Diversité des biomes terrestres"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-6 text-white/90">
              <Leaf className="w-10 h-10" />
              <h1 className="text-5xl md:text-7xl font-bold">
                Évaluation des Biomes
              </h1>
              <MapPin className="w-10 h-10" />
            </div>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Explorez et évaluez votre ressenti sur les différents écosystèmes de notre planète. 
              Découvrez la beauté et la diversité de la nature à travers un questionnaire personnalisé.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg font-semibold"
              >
                <Star className="w-5 h-5 mr-2" />
                Commencer l'exploration
              </Button>
              {(hasEvaluations || localEvaluations) && (
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setShowHistory(true)}
                  className="border-2 border-white/80 text-white bg-black/20 hover:bg-white/20 hover:border-white px-8 py-4 text-lg backdrop-blur-md font-semibold shadow-lg transition-all duration-300"
                >
                  Voir mon historique
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </div>



      {/* Biomes Section */}
      <div className="bg-gradient-to-br from-background via-background to-muted/20 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choisissez un biome à explorer</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Chaque biome offre une expérience unique avec ses propres caractéristiques et écosystèmes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {biomesData.map((biome) => (
              <BiomeCard key={biome.id} biome={biome} />
            ))}
          </div>

          {/* Stats Section */}
          <div className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="bg-card rounded-lg p-6 shadow-card">
                <div className="text-3xl font-bold text-primary mb-2">
                  {biomesData.reduce((total, biome) => total + biome.subBiomes.length, 0)}
                </div>
                <div className="text-muted-foreground">Sous-biomes disponibles</div>
              </div>
              <div className="bg-card rounded-lg p-6 shadow-card">
                <div className="text-3xl font-bold text-primary mb-2">10</div>
                <div className="text-muted-foreground">Critères d'évaluation</div>
              </div>
              <div className="bg-card rounded-lg p-6 shadow-card">
                <div className="text-3xl font-bold text-primary mb-2">∞</div>
                <div className="text-muted-foreground">Expériences possibles</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
};

export default Index;
