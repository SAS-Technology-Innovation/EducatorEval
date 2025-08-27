import React from 'react';
import { ArrowLeft, Home, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';

interface AppletNavigationProps {
  appletName: string;
  appletDescription?: string;
  onNavigateBack?: () => void;
  onNavigateHome?: () => void;
  onFullscreen?: () => void;
  isFullscreen?: boolean;
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{ label: string; href?: string; onClick?: () => void }>;
}

const AppletNavigation: React.FC<AppletNavigationProps> = ({
  appletName,
  appletDescription,
  onNavigateBack,
  onNavigateHome,
  onFullscreen,
  isFullscreen = false,
  showBreadcrumb = false,
  breadcrumbItems = []
}) => {
  return (
    <div className="bg-gradient-to-r from-sas-purple-600 to-sas-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left Section - Navigation */}
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            {onNavigateBack && (
              <button
                onClick={onNavigateBack}
                className="flex items-center px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Platform
              </button>
            )}

            {/* Home Button */}
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title="Go to Dashboard"
              >
                <Home className="w-4 h-4" />
              </button>
            )}

            {/* Applet Info */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold">A</span>
              </div>
              <div>
                <div className="text-sm font-semibold">{appletName}</div>
                {appletDescription && (
                  <div className="text-xs text-white/80">{appletDescription}</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Controls */}
          <div className="flex items-center space-x-2">
            {/* Fullscreen Toggle */}
            {onFullscreen && (
              <button
                onClick={onFullscreen}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            )}

            {/* External Link Indicator */}
            <div className="flex items-center text-xs text-white/80">
              <ExternalLink className="w-3 h-3 mr-1" />
              Applet
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        {showBreadcrumb && breadcrumbItems.length > 0 && (
          <div className="border-t border-white/20 px-4 py-2">
            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="text-white/60">/</span>}
                  {item.href || item.onClick ? (
                    <button
                      onClick={() => {
                        if (item.onClick) {
                          item.onClick();
                        } else if (item.href) {
                          window.location.href = item.href;
                        }
                      }}
                      className="text-white/90 hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className="text-white font-medium">{item.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppletNavigation;