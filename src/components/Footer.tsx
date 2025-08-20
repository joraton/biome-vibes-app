import { Heart, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="w-6 h-6 text-green-600" />
              <span className="text-xl font-bold">BiomeVibes</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Explorez et évaluez les biomes de notre planète. 
              Partagez vos expériences et découvrez la beauté de la nature.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="/#biomes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Explorer les biomes
                </a>
              </li>
              <li>
                <a href="/historique" className="text-muted-foreground hover:text-foreground transition-colors">
                  Mon historique
                </a>
              </li>
            </ul>
          </div>

          {/* À propos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">À propos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Notre mission
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Équipe
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Fait avec</span>
              <Link to="/historique-special" className="inline-flex items-center hover:scale-110 transition-transform">
                <Heart className="w-4 h-4 text-red-500 fill-current hover:text-red-600 cursor-pointer" />
              </Link>
              <span>pour la nature</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © 2024 BiomeVibes. Tous droits réservés.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};