/**
 * EnvironmentBanner Component
 *
 * Displays a banner at the top of the application indicating the current environment.
 * Only shows in development and staging environments - hidden in production.
 */
export default function EnvironmentBanner() {
  const environment = import.meta.env.VITE_ENVIRONMENT;

  // Don't show banner in production
  if (environment === 'production') {
    return null;
  }

  // Determine banner styling based on environment
  const getBannerStyle = () => {
    switch (environment) {
      case 'staging':
        return {
          bg: 'bg-yellow-500',
          text: 'text-white',
          icon: '🧪',
          label: 'STAGING ENVIRONMENT'
        };
      case 'development':
      default:
        return {
          bg: 'bg-blue-500',
          text: 'text-white',
          icon: '🔧',
          label: 'DEVELOPMENT ENVIRONMENT'
        };
    }
  };

  const style = getBannerStyle();

  return (
    <div className={`${style.bg} ${style.text} text-center py-1 px-4 text-sm font-medium z-50`}>
      {style.icon} {style.label} - Test data only
    </div>
  );
}
