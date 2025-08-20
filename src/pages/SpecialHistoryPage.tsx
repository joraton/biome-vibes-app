import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, User, Calendar, MessageSquare, Star } from "lucide-react";

// Interface pour les évaluations avec informations utilisateur
interface EvaluationWithUser {
  _id: string;
  _creationTime: number;
  biomeId: string;
  subBiomeId: string;
  answers: number[];
  scoreTest20: number;
  noteSubjective20?: number;
  commentaireSubjectif?: string;
  includeSubjective: boolean;
  finalDisplayed: number;
  timestamp: number;
  userEmail: string;
  userName: string;
}

const SpecialHistoryPage = () => {
  const { user } = useUser();
  const evaluations = useQuery(api.users.getAllEvaluationsWithUsers);

  // Emails spéciaux à afficher
  const specialEmails = [
    "tachipistacchio@gmail.com",
    user?.emailAddresses[0]?.emailAddress
  ].filter(Boolean);

  // Filtrer les évaluations pour les utilisateurs spéciaux
  const specialEvaluations = evaluations?.filter(evaluation => 
    specialEmails.includes(evaluation.userEmail)
  ) || [];

  // Trier par date (plus récent en premier)
  const sortedEvaluations = specialEvaluations.sort((a, b) => 
    new Date(b._creationTime).getTime() - new Date(a._creationTime).getTime()
  );

  // Grouper par utilisateur
  const evaluationsByUser = sortedEvaluations.reduce((acc, evaluation) => {
    const email = evaluation.userEmail;
    if (!acc[email]) {
      acc[email] = [];
    }
    acc[email].push(evaluation);
    return acc;
  }, {} as Record<string, EvaluationWithUser[]>);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getUserDisplayName = (email: string) => {
    if (email === "tachipistacchio@gmail.com") {
      return "Tachipistacchio";
    }
    if (email === user?.emailAddresses[0]?.emailAddress) {
      return "Vous";
    }
    return email;
  };

  const getSubBiomeName = (subBiomeId: string) => {
    // Pour l'instant, on retourne l'ID. On pourrait améliorer en chargeant les données des biomes
    return subBiomeId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="w-8 h-8 text-red-500 fill-current" />
              <h1 className="text-3xl font-bold text-foreground">Historique Spécial</h1>
              <Heart className="w-8 h-8 text-red-500 fill-current" />
            </div>
            <p className="text-muted-foreground">
              Historique des évaluations de biomes pour nos utilisateurs spéciaux
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {sortedEvaluations.length}
                </div>
                <div className="text-sm text-muted-foreground">Évaluations totales</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {Object.keys(evaluationsByUser).length}
                </div>
                <div className="text-sm text-muted-foreground">Utilisateurs actifs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {sortedEvaluations.filter(e => e.commentaireSubjectif).length}
                </div>
                <div className="text-sm text-muted-foreground">Avec commentaires</div>
              </CardContent>
            </Card>
          </div>

          {/* Historique par utilisateur */}
          {Object.entries(evaluationsByUser).map(([email, userEvaluations]) => (
            <div key={email} className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  {getUserDisplayName(email)}
                </h2>
                <Badge variant="secondary">
                  {userEvaluations.length} évaluation{userEvaluations.length > 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="space-y-4">
                {userEvaluations.map((evaluation) => (
                  <Card key={evaluation._id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {getSubBiomeName(evaluation.subBiomeId)}
                        </CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(new Date(evaluation._creationTime))}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Scores */}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">
                            Score questionnaire: <strong>{evaluation.scoreTest20}/20</strong>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">
                            Score final: <strong>{evaluation.finalDisplayed}/20</strong>
                          </span>
                        </div>
                        {evaluation.includeSubjective && evaluation.noteSubjective20 && (
                          <div className="flex items-center space-x-2">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className="text-sm">
                              Note subjective: <strong>{evaluation.noteSubjective20}/20</strong>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Commentaire subjectif */}
                      {evaluation.commentaireSubjectif && (
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <MessageSquare className="w-4 h-4 text-primary mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-foreground mb-1">
                                Commentaire personnel :
                              </div>
                              <div className="text-sm text-muted-foreground italic">
                                "{evaluation.commentaireSubjectif}"
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {email !== Object.keys(evaluationsByUser)[Object.keys(evaluationsByUser).length - 1] && (
                <Separator className="mt-8" />
              )}
            </div>
          ))}

          {sortedEvaluations.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Aucune évaluation trouvée
                </h3>
                <p className="text-muted-foreground">
                  Les évaluations des utilisateurs spéciaux apparaîtront ici.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialHistoryPage;