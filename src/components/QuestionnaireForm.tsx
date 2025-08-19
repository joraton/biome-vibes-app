import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import questions from "@/data/questions.json";

interface QuestionnaireFormProps {
  onSubmit: (answers: number[], subjectiveScore?: number, commentaireSubjectif?: string, includeSubjective?: boolean) => void;
  theme: {
    primary: string;
    accent: string;
    bg: string;
  };
}

export const QuestionnaireForm = ({ onSubmit, theme }: QuestionnaireFormProps) => {
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(0));
  const [subjectiveScore, setSubjectiveScore] = useState<string>("");
  const [commentaireSubjectif, setCommentaireSubjectif] = useState<string>("");
  const [includeSubjective, setIncludeSubjective] = useState(false);

  const handleAnswerChange = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validAnswers = answers.every(answer => answer > 0);
    
    if (!validAnswers) {
      alert("Veuillez répondre à toutes les questions.");
      return;
    }

    const numericSubjective = subjectiveScore ? parseFloat(subjectiveScore) : undefined;
    onSubmit(answers, numericSubjective, commentaireSubjectif || undefined, includeSubjective);
  };

  const allAnswered = answers.every(answer => answer > 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.primary }}>
          Questionnaire d'évaluation
        </h3>
        <p className="text-muted-foreground mb-6 text-sm">
          Évaluez chaque aspect de 1 (très négatif) à 5 (excellent)
        </p>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="space-y-3">
              <Label className="text-sm font-medium">{question}</Label>
              <div 
                role="radiogroup" 
                aria-labelledby={`question-${index}`}
                className="flex gap-2 justify-between max-w-xs"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex flex-col items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={value}
                      checked={answers[index] === value}
                      onChange={() => handleAnswerChange(index, value)}
                      className="sr-only"
                    />
                    <div 
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-smooth ${
                        answers[index] === value 
                          ? 'border-opacity-100 text-white' 
                          : 'border-border hover:border-opacity-60'
                      }`}
                      style={{
                        backgroundColor: answers[index] === value ? theme.primary : 'transparent',
                        borderColor: answers[index] === value ? theme.primary : undefined,
                      }}
                    >
                      {value}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {value === 1 ? 'Très négatif' : 
                       value === 2 ? 'Négatif' :
                       value === 3 ? 'Neutre' :
                       value === 4 ? 'Positif' : 'Excellent'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.primary }}>
          Évaluation personnelle (optionnelle)
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subjective-score">Votre note personnelle (0 à 20)</Label>
            <Input
              id="subjective-score"
              type="number"
              min="0"
              max="20"
              step="0.1"
              value={subjectiveScore}
              onChange={(e) => setSubjectiveScore(e.target.value)}
              placeholder="Ex: 16.5"
              className="max-w-xs"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="commentaire-subjectif">Vos impressions et commentaires</Label>
            <Textarea
              id="commentaire-subjectif"
              value={commentaireSubjectif}
              onChange={(e) => setCommentaireSubjectif(e.target.value)}
              placeholder="Partagez vos impressions, ce qui vous a marqué, vos observations..."
              className="min-h-[100px] resize-none"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="include-subjective"
              checked={includeSubjective}
              onCheckedChange={setIncludeSubjective}
              disabled={!subjectiveScore}
            />
            <Label htmlFor="include-subjective" className="text-sm">
              Inclure ma note subjective dans la note finale
            </Label>
          </div>
        </div>
      </Card>

      <Button
        type="submit"
        disabled={!allAnswered}
        className="w-full transition-smooth"
        style={{
          backgroundColor: allAnswered ? theme.primary : undefined,
          borderColor: allAnswered ? theme.primary : undefined,
        }}
      >
        Calculer ma note
      </Button>
    </form>
  );
};