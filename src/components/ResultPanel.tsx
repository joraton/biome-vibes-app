import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getScoreFeedback } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
import { scrollToTop } from "@/hooks/use-scroll-to-top";

interface ResultPanelProps {
  scoreTest20: number;
  subjectiveScore?: number;
  includeSubjective: boolean;
  finalScore: number;
  biomeName: string;
  subBiomeName: string;
  theme: {
    primary: string;
    accent: string;
    bg: string;
  };
  onShowHistory: () => void;
}

export const ResultPanel = ({ 
  scoreTest20, 
  subjectiveScore, 
  includeSubjective, 
  finalScore, 
  biomeName,
  subBiomeName,
  theme,
  onShowHistory 
}: ResultPanelProps) => {
  const navigate = useNavigate();
  const feedback = getScoreFeedback(finalScore);

  const handleBackToBiomes = () => {
    scrollToTop();
    navigate(`/`);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2" style={{ color: theme.primary }}>
          Résultats pour {subBiomeName}
        </h3>
        <p className="text-muted-foreground">{biomeName}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Note du questionnaire</span>
          <Badge variant="secondary">{scoreTest20}/20</Badge>
        </div>

        {subjectiveScore && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Note subjective</span>
            <Badge variant="outline">{subjectiveScore}/20</Badge>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Note finale</span>
            <Badge 
              className="text-white"
              style={{ backgroundColor: theme.primary }}
            >
              {finalScore}/20
            </Badge>
          </div>
          
          <Progress 
            value={(finalScore / 20) * 100} 
            className="h-3"
            style={{
              backgroundColor: `${theme.primary}20`,
            }}
          />
          <div className="text-center">
            <span 
              className="text-sm font-medium"
              style={{ color: theme.primary }}
            >
              {feedback}
            </span>
          </div>
        </div>

        {includeSubjective && subjectiveScore && (
          <div className="text-xs text-muted-foreground text-center p-3 bg-muted rounded-lg">
            Note calculée avec la moyenne entre le questionnaire ({scoreTest20}/20) 
            et votre note subjective ({subjectiveScore}/20)
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleBackToBiomes}
          variant="outline"
          className="flex-1"
        >
          Choisir un autre biome
        </Button>
        <Button
          onClick={onShowHistory}
          variant="secondary"
          className="flex-1"
        >
          Voir l'historique
        </Button>
      </div>
    </Card>
  );
};