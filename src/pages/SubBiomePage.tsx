import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestionnaireForm } from "@/components/QuestionnaireForm";
import { ResultPanel } from "@/components/ResultPanel";
import { HistoryModal } from "@/components/HistoryModal";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { scrollToTop } from "@/hooks/use-scroll-to-top";
import biomesDataRaw from "@/data/biomes.json";
import { biomeDescriptions } from "@/lib/biomeDescriptions";
import { 
  saveEvaluation, 
  getEvaluation, 
  calculateScore, 
  calculateFinalScore
} from "@/lib/storage";
import { loadBiomesWithImages } from "@/lib/imageLoader";
import type { Biome, BiomeEvaluation } from "@/types/biome";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";

const biomesData = loadBiomesWithImages(biomesDataRaw as Biome[]);

const SubBiomePage = () => {
  const { biomeId, subBiomeId } = useParams();
  const navigate = useNavigate();
  const [currentEvaluation, setCurrentEvaluation] = useState<BiomeEvaluation | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const { user } = useUser();
  const addEvaluation = useMutation(api.users.addEvaluation);
  
  const biome = biomesData.find(b => b.id === biomeId);
  const subBiome = biome?.subBiomes.find(sb => sb.id === subBiomeId);
  const description = subBiomeId ? biomeDescriptions[subBiomeId] : null;

  useEffect(() => {
    if (!biome || !subBiome) {
      navigate('/');
      return;
    }
    
    // Apply biome theme
    const root = document.documentElement;
    root.style.setProperty('--biome-primary', biome.theme.primary);
    root.style.setProperty('--biome-accent', biome.theme.accent);
    root.style.setProperty('--biome-bg', biome.theme.bg);
    
    // Check for existing evaluation
    const existing = getEvaluation(biomeId!, subBiomeId!);
    setCurrentEvaluation(existing);
    
    return () => {
      // Reset theme on unmount
      root.style.removeProperty('--biome-primary');
      root.style.removeProperty('--biome-accent');
      root.style.removeProperty('--biome-bg');
    };
  }, [biome, subBiome, biomeId, subBiomeId, navigate]);

  if (!biome || !subBiome) {
    return null;
  }

  const handleBackToBiome = () => {
    scrollToTop();
    navigate(`/biome/${biomeId}`);
  };

  const handleFormSubmit = async (answers: number[], subjectiveScore?: number, commentaireSubjectif?: string, includeSubjective = false) => {
    console.log('🔄 Début de la sauvegarde de l\'évaluation');
    console.log('👤 Utilisateur connecté:', !!user);
    console.log('📊 Données à sauvegarder:', { biomeId, subBiomeId, answers, subjectiveScore, commentaireSubjectif, includeSubjective });
    
    const scoreTest20 = calculateScore(answers);
    const finalScore = calculateFinalScore(scoreTest20, subjectiveScore, includeSubjective);
    
    const evaluation: BiomeEvaluation = {
      biomeId: biomeId!,
      subBiomeId: subBiomeId!,
      answers,
      scoreTest20,
      noteSubjective20: subjectiveScore,
      commentaireSubjectif,
      includeSubjective,
      finalDisplayed: finalScore,
      timestamp: new Date().toISOString()
    };
    
    // Save to Convex if user is authenticated
    if (user) {
      console.log('💾 Tentative de sauvegarde dans Convex...');
      try {
        const result = await addEvaluation({
          biomeId: biomeId!,
          subBiomeId: subBiomeId!,
          answers,
          scoreTest20,
          noteSubjective20: subjectiveScore,
          commentaireSubjectif,
          includeSubjective,
          finalDisplayed: finalScore
        });
        console.log('✅ Sauvegarde Convex réussie:', result);
      } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde dans Convex:', error);
        console.log('🔄 Fallback vers le stockage local...');
        // Fallback to local storage if Convex fails
        saveEvaluation(evaluation);
        console.log('✅ Sauvegarde locale réussie');
      }
    } else {
      console.log('💾 Sauvegarde dans le stockage local (utilisateur non connecté)...');
      // Save to local storage if user is not authenticated
      saveEvaluation(evaluation);
      console.log('✅ Sauvegarde locale réussie');
    }
    
    setCurrentEvaluation(evaluation);
    console.log('🎉 Évaluation terminée et affichée');
  };

  const handleNewEvaluation = () => {
    setCurrentEvaluation(null);
  };

  // Utiliser l'image personnalisée du sous-biome si disponible, sinon fallback sur Unsplash
  const subBiomeImageUrl = subBiome.image || `https://images.unsplash.com/1400x400/?${biome.theme.unsplash}+${subBiome.nom.toLowerCase().replace(/\s+/g, '+')}&w=1400&h=400&fit=crop`;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={subBiomeImageUrl}
          alt={subBiome.nom}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/70" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToBiome}
              className="text-white hover:bg-white/20 mb-4 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à {biome.nom}
            </Button>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">{subBiome.nom}</h1>
              <p className="text-lg text-white/90 drop-shadow">{biome.nom}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-background to-muted/10 py-8">
        <div className="container mx-auto px-4">
          {/* Description Card */}
          {description && (
            <Card className="mb-8 p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4" style={{ color: biome.theme.primary }}>
                À propos de ce sous-biome
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                 {description.description}
               </p>
               <div className="flex flex-wrap gap-2 mb-4">
                 {description.tags.map((tag, index) => (
                   <Badge 
                     key={index} 
                     variant="secondary"
                     style={{ 
                       backgroundColor: `${biome.theme.primary}15`,
                       color: biome.theme.primary 
                     }}
                   >
                     {tag}
                   </Badge>
                 ))}
               </div>
              
              {subBiome.subEcosystems && subBiome.subEcosystems.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Écosystèmes caractéristiques :</h3>
                  <div className="flex flex-wrap gap-2">
                    {subBiome.subEcosystems.map((ecosystem, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="text-sm"
                        style={{ 
                          backgroundColor: `${biome.theme.accent}20`,
                          color: biome.theme.primary,
                          borderColor: `${biome.theme.accent}40`
                        }}
                      >
                        {ecosystem}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Evaluation Section */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <Card className="p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: biome.theme.primary }}>
                    {currentEvaluation ? 'Votre évaluation' : 'Évaluez votre expérience'}
                  </h2>
                  {currentEvaluation && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHistory(true)}
                        style={{ 
                          borderColor: biome.theme.accent,
                          color: biome.theme.primary 
                        }}
                      >
                        Historique
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNewEvaluation}
                        style={{ 
                          borderColor: biome.theme.accent,
                          color: biome.theme.primary 
                        }}
                      >
                        Nouvelle évaluation
                      </Button>
                    </div>
                  )}
                </div>
                
                {!currentEvaluation ? (
                   <QuestionnaireForm
                     onSubmit={handleFormSubmit}
                     theme={biome.theme}
                   />
                 ) : (
                   <ResultPanel
                     scoreTest20={currentEvaluation.scoreTest20}
                     subjectiveScore={currentEvaluation.noteSubjective20}
                     includeSubjective={currentEvaluation.includeSubjective}
                     finalScore={currentEvaluation.finalDisplayed}
                     biomeName={biome.nom}
                     subBiomeName={subBiome.nom}
                     theme={biome.theme}
                     onShowHistory={() => setShowHistory(true)}
                   />
                 )}
               </Card>
             </div>
          </div>
             
          {currentEvaluation && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={handleNewEvaluation}
                className="transition-smooth"
              >
                Refaire l'évaluation
              </Button>
            </div>
          )}
        </div>
      </div>

      <HistoryModal
         isOpen={showHistory}
         onClose={() => setShowHistory(false)}
       />
    </div>
  );
};

export default SubBiomePage;