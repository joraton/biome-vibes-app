import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllEvaluations, getScoreFeedback } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import biomesDataRaw from '@/data/biomes.json';
import { Biome, BiomeEvaluation } from '@/types/biome';
import { loadBiomesWithImages } from '@/lib/imageLoader';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const biomesData = loadBiomesWithImages(biomesDataRaw as Biome[]);

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryModal = ({ isOpen, onClose }: HistoryModalProps) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  
  // Récupérer les évaluations depuis Convex
  const convexEvaluations = useQuery(api.users.getUserEvaluations);
  
  const evaluations = useMemo(() => {
    let allEvals: BiomeEvaluation[] = [];
    
    if (convexEvaluations && convexEvaluations.length > 0) {
       // Convertir les données Convex au format BiomeEvaluation
       allEvals = convexEvaluations.map(evaluation => ({
         biomeId: evaluation.biomeId,
         subBiomeId: evaluation.subBiomeId,
         answers: evaluation.answers,
         scoreTest20: evaluation.scoreTest20,
         noteSubjective20: evaluation.noteSubjective20,
         commentaireSubjectif: evaluation.commentaireSubjectif,
         finalDisplayed: evaluation.finalDisplayed,
         timestamp: new Date(evaluation.timestamp).toISOString(),
         includeSubjective: evaluation.includeSubjective
       }));
    } else {
      // Fallback vers le stockage local si pas de données Convex
      allEvals = getAllEvaluations();
    }
    
    return allEvals.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return b.finalDisplayed - a.finalDisplayed;
    });
  }, [convexEvaluations, sortBy]);

  const getBiomeInfo = (biomeId: string, subBiomeId: string) => {
    const biome = biomesData.find(b => b.id === biomeId);
    const subBiome = biome?.subBiomes.find(sb => sb.id === subBiomeId);
    return {
      biomeName: biome?.nom || 'Biome inconnu',
      subBiomeName: subBiome?.nom || 'Sous-biome inconnu',
      theme: biome?.theme || { primary: '#666', accent: '#999', bg: '#f5f5f5' }
    };
  };

  const handleVisitBiome = (evaluation: BiomeEvaluation) => {
    navigate(`/biome/${evaluation.biomeId}/${evaluation.subBiomeId}`);
    onClose();
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Historique de vos évaluations</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <Button
            variant={sortBy === 'date' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('date')}
          >
            Trier par date
          </Button>
          <Button
            variant={sortBy === 'score' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('score')}
          >
            Trier par note
          </Button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-3">
          {evaluations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucune évaluation enregistrée</p>
              <p className="text-sm">Commencez par explorer un biome !</p>
            </div>
          ) : (
            evaluations.map((evaluation, index) => {
              const { biomeName, subBiomeName, theme } = getBiomeInfo(evaluation.biomeId, evaluation.subBiomeId);
              const feedback = getScoreFeedback(evaluation.finalDisplayed);
              
              return (
                <div
                  key={`${evaluation.biomeId}-${evaluation.subBiomeId}-${index}`}
                  className="p-4 border rounded-lg hover:shadow-card transition-smooth cursor-pointer"
                  onClick={() => handleVisitBiome(evaluation)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{subBiomeName}</h4>
                      <p className="text-sm text-muted-foreground">{biomeName}</p>
                    </div>
                    <Badge 
                      className="text-white ml-2"
                      style={{ backgroundColor: theme.primary }}
                    >
                      {evaluation.finalDisplayed}/20
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDate(evaluation.timestamp)}</span>
                    <span style={{ color: theme.primary }}>{feedback}</span>
                  </div>
                  
                  {evaluation.includeSubjective && evaluation.noteSubjective20 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Questionnaire: {evaluation.scoreTest20}/20 • 
                      Subjectif: {evaluation.noteSubjective20}/20
                    </div>
                  )}
                  
                  {evaluation.commentaireSubjectif && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                      <span className="font-medium text-muted-foreground">Commentaire:</span>
                      <p className="mt-1 text-muted-foreground italic">"{evaluation.commentaireSubjectif}"</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};