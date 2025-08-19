import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">Biome Vibes</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Unauthenticated>
            <div className="flex items-center space-x-2">
              <SignInButton mode="redirect">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Se connecter
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  S'inscrire
                </button>
              </SignUpButton>
            </div>
          </Unauthenticated>
          
          <Authenticated>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Connecté</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>
          </Authenticated>
          
          <AuthLoading>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </AuthLoading>
        </div>
      </div>
    </header>
  );
}