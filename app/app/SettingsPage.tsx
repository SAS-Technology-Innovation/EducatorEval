import { useAuthStore } from '../stores/auth';
import UserSettings from '../components/user/UserSettings';
import { Loader2 } from 'lucide-react';
import { coreApi } from '../api';
import type { UserPreferences } from '../types';

export default function SettingsPage() {
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-sas-blue-600" />
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = async (settings: any) => {
    // Save preferences to the user's profile in Firestore
    // Transform UserSettings component format to UserPreferences format
    const preferences: UserPreferences = {
      theme: settings.theme === 'system' ? 'auto' : settings.theme,
      language: settings.language || 'en',
      timezone: settings.timezone || 'America/New_York',
      notifications: {
        email: settings.notifications?.email?.observations ?? true,
        push: settings.notifications?.push?.observations ?? true,
        sms: false,
      },
      dashboard: {
        layout: settings.dashboard?.defaultView === 'list' ? 'list' : 'grid',
        compactMode: false,
        showWelcomeMessage: true,
      },
    };

    try {
      await coreApi.users.update(user.id, { preferences });
      // Also update the local auth store
      await updateUser({ preferences });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to save settings:', error);
      }
      throw error; // Re-throw so the component can show an error
    }
  };

  return (
    <UserSettings
      user={user}
      onUpdate={handleUpdate}
    />
  );
}
