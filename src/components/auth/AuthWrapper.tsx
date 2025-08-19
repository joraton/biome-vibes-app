import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { UserSync } from './UserSync';
import { ReactNode } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <div className="min-h-screen">
      {/* Header avec authentification */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Biome Vibes</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Unauthenticated>
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Se connecter
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    S'inscrire
                  </button>
                </SignUpButton>
              </div>
            </Unauthenticated>
            
            <Authenticated>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </Authenticated>
            
            <AuthLoading>
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </AuthLoading>
          </div>
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="flex-1">
        <AuthLoading>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement...</p>
            </div>
          </div>
        </AuthLoading>
        
        <Unauthenticated>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Explorez les biomes du monde
              </h2>
              <p className="text-gray-600 mb-6">
                Connectez-vous pour sauvegarder vos évaluations, consulter votre historique et personnaliser votre expérience.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <SignInButton mode="modal">
                  <button className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Se connecter
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Créer un compte
                  </button>
                </SignUpButton>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">
                  Ou continuez sans compte (fonctionnalités limitées)
                </p>
                {children}
              </div>
            </div>
          </div>
        </Unauthenticated>
        
        <Authenticated>
          <UserSync />
          {children}
        </Authenticated>
      </main>
    </div>
  );
}