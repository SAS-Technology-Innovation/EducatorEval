import { useAuthStore } from '../stores/auth';
import UserProfile from '../components/user/UserProfile';
import { Loader2 } from 'lucide-react';
import type { User } from '../types';

export default function ProfilePage() {
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-sas-blue-600" />
      </div>
    );
  }

  const handleUpdate = async (updatedUser: Partial<User>) => {
    // Update the auth store with the new user data
    await updateUser(updatedUser);
  };

  return (
    <UserProfile
      user={user}
      onUpdate={handleUpdate}
    />
  );
}
