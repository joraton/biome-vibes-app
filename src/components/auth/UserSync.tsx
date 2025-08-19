import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function UserSync() {
  const { user, isLoaded } = useUser();
  const ensureUser = useMutation(api.users.ensureUser);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const syncUser = async () => {
      try {
        await ensureUser({
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName || undefined,
          imageUrl: user.imageUrl || undefined,
        });
      } catch (error) {
        console.error('Erreur lors de la synchronisation de l\'utilisateur:', error);
      }
    };

    syncUser();
  }, [user, isLoaded, ensureUser]);

  return null;
}