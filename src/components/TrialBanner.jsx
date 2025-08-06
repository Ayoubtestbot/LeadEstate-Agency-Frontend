import React, { useState, useEffect } from 'react';
import { Clock, X, CreditCard, Zap } from 'lucide-react';

const TrialBanner = ({ 
  daysRemaining, 
  trialEndDate, 
  onUpgrade, 
  onDismiss,
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  });

  useEffect(() => {
    if (!trialEndDate) return;

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(trialEndDate).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [trialEndDate]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Default upgrade action - redirect to upgrade page
      window.location.href = '/upgrade';
    }
  };

  if (!isVisible || daysRemaining <= 0) {
    return null;
  }

  // Determine banner style based on days remaining
  const getBannerStyle = () => {
    if (daysRemaining <= 1) {
      return {
        bg: 'bg-gradient-to-r from-red-500 to-red-600',
        text: 'text-white',
        urgency: 'URGENT'
      };
    } else if (daysRemaining <= 3) {
      return {
        bg: 'bg-gradient-to-r from-orange-500 to-orange-600',
        text: 'text-white',
        urgency: 'EXPIRING SOON'
      };
    } else if (daysRemaining <= 7) {
      return {
        bg: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
        text: 'text-white',
        urgency: 'REMINDER'
      };
    } else {
      return {
        bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
        text: 'text-white',
        urgency: 'FREE TRIAL'
      };
    }
  };

  const style = getBannerStyle();

  return (
    <div className={`${style.bg} ${style.text} shadow-lg border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Left side - Trial info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span className="text-sm font-medium">
                  {style.urgency}
                </span>
                <span className="text-sm opacity-90">
                  {daysRemaining === 1 ? (
                    `Trial expires in ${timeLeft.hours}h ${timeLeft.minutes}m`
                  ) : (
                    `${daysRemaining} days remaining`
                  )}
                </span>
              </div>
            </div>

            {/* Countdown for urgent cases */}
            {daysRemaining <= 1 && (
              <div className="hidden sm:flex items-center space-x-4 text-sm font-mono bg-white/20 px-3 py-1 rounded-full">
                <div className="text-center">
                  <div className="font-bold">{timeLeft.days}</div>
                  <div className="text-xs opacity-75">days</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{timeLeft.hours}</div>
                  <div className="text-xs opacity-75">hours</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{timeLeft.minutes}</div>
                  <div className="text-xs opacity-75">mins</div>
                </div>
              </div>
            )}
          </div>

          {/* Center - Message */}
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <Zap className="w-4 h-4" />
            <span>
              {daysRemaining <= 1 
                ? "Don't lose access to your leads!" 
                : daysRemaining <= 3
                ? "Upgrade now to keep your data and continue growing!"
                : "Enjoying LeadEstate? Upgrade to unlock all features!"
              }
            </span>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleUpgrade}
              className="inline-flex items-center px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-sm"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Upgrade Now</span>
              <span className="sm:hidden">Upgrade</span>
            </button>

            {/* Dismiss button - only show if not urgent */}
            {daysRemaining > 1 && (
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile message */}
        <div className="md:hidden pb-2">
          <p className="text-sm opacity-90">
            {daysRemaining <= 1 
              ? "Don't lose access to your leads!" 
              : daysRemaining <= 3
              ? "Upgrade now to keep your data!"
              : "Upgrade to unlock all features!"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

// Hook to manage trial banner state
export const useTrialBanner = () => {
  const [trialInfo, setTrialInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrialStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/trial-status', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.isTrial) {
            setTrialInfo({
              daysRemaining: data.data.daysRemaining,
              trialEndDate: data.data.trialEndDate,
              isExpiringSoon: data.data.daysRemaining <= 3,
              needsUpgrade: data.data.needsUpgrade
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch trial status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrialStatus();
  }, []);

  return { trialInfo, loading };
};

export default TrialBanner;
