import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { Biome } from "@/types/biome";

interface BiomeCardProps {
  biome: Biome;
}

export const BiomeCard = ({ biome }: BiomeCardProps) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate(`/biome/${biome.id}`);
  };

  const imageUrl = biome.image || `https://images.unsplash.com/1200x800/?${biome.theme.unsplash}`;

  return (
    <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-elevated cursor-pointer h-64">
      <div className="absolute inset-0 transition-all duration-500 group-hover:scale-110">
        <img
          src={imageUrl}
          alt={biome.nom}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>
      
      <div className="relative z-10 p-6 h-64 flex flex-col justify-end text-white">
        <div className="mb-4">
          <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{biome.nom}</h3>
          <p className="text-white/90 text-sm drop-shadow">
            {biome.subBiomes.length} sous-biome{biome.subBiomes.length > 1 ? 's' : ''} à explorer
          </p>
        </div>
        
        <Button 
          onClick={handleExplore}
          className="self-start transition-all duration-300 group-hover:scale-105 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-black"
        >
          Explorer
        </Button>
      </div>
    </Card>
  );
};