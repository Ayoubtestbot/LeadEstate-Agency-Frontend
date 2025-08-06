import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Check, 
  Zap, 
  Star, 
  ArrowRight, 
  Loader2,
  AlertCircle,
  Crown,
  Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTrialBanner } from '../components/TrialBanner';

const UpgradePage = () => {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedCycle, setSelectedCycle] = useState('annual');
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const navigate = useNavigate();
  const { trialInfo } = useTrialBanner();

  useEffect(() => {
    loadPlansAndCurrentStatus();
  }, []);

  const loadPlansAndCurrentStatus = async () => {
    try {
      setLoading(true);
      
      // Load subscription plans
      const plansResponse = await fetch('/api/subscription/plans');
      const plansData = await plansResponse.json();
      
      if (plansData.success) {
        setPlans(plansData.data);
        // Default to Pro plan selection
        setSelectedPlan(plansData.data.find(p => p.name === 'pro') || plansData.data[1]);
      }

      // Load current subscription status
      const token = localStorage.getItem('token');
      if (token) {
        const statusResponse = await fetch('/api/subscription/status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const statusData = await statusResponse.json();
        
        if (statusData.success) {
          setCurrentPlan(statusData.data.subscription);
        }
      }
    } catch (error) {
      console.error('Failed to load plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;
    
    try {
      setUpgrading(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          billingCycle: selectedCycle
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // For now, show success message
        // In Phase 6, this will integrate with Stripe
        alert('Upgrade functionality will be available soon with payment integration!');
        navigate('/dashboard');
      } else {
        alert('Upgrade failed: ' + data.message);
      }
    } catch (error) {
      alert('Upgrade failed. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  const getPlanIcon = (planName) => {
    switch (planName) {
      case 'starter': return <Zap className="w-6 h-6" />;
      case 'pro': return <Star className="w-6 h-6" />;
      case 'agency': return <Crown className="w-6 h-6" />;
      default: return <Building2 className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planName) => {
    switch (planName) {
      case 'starter': return 'border-blue-200 bg-blue-50';
      case 'pro': return 'border-purple-200 bg-purple-50';
      case 'agency': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Upgrade Your LeadEstate Plan
            </h1>
            <p className="mt-2 text-gray-600">
              {trialInfo ? 
                `${trialInfo.daysRemaining} days remaining in your free trial` :
                'Choose the perfect plan for your real estate business'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trial Urgency Banner */}
        {trialInfo && trialInfo.daysRemaining <= 3 && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Your trial expires in {trialInfo.daysRemaining} day{trialInfo.daysRemaining !== 1 ? 's' : ''}!
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Upgrade now to keep your leads and continue growing your business.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Billing Cycle Toggle */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'monthly', label: 'Monthly' },
              { key: 'quarterly', label: 'Quarterly', badge: '10% off' },
              { key: 'semi_annual', label: 'Semi-Annual', badge: '17% off' },
              { key: 'annual', label: 'Annual', badge: '20% off' }
            ].map(({ key, label, badge }) => (
              <button
                key={key}
                onClick={() => setSelectedCycle(key)}
                className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedCycle === key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
                {badge && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            const isCurrentPlan = currentPlan?.planName === plan.name;
            const price = plan.pricing[selectedCycle] || plan.pricing.monthly;
            const savings = plan.savings[selectedCycle] || 0;
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-blue-500 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${plan.name === 'pro' ? 'ring-2 ring-purple-500 ring-opacity-20' : ''}`}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.name === 'pro' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${getPlanColor(plan.name)}`}>
                      {getPlanIcon(plan.name)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.displayName}</h3>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(price)}
                      </span>
                      <span className="text-gray-600 ml-2">
                        /{selectedCycle === 'semi_annual' ? '6mo' : selectedCycle.replace('_', ' ')}
                      </span>
                    </div>
                    {savings > 0 && (
                      <p className="text-green-600 text-sm font-medium mt-1">
                        Save {savings}% vs monthly
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">
                        {plan.limits.maxLeads ? `${plan.limits.maxLeads.toLocaleString()} leads` : 'Unlimited leads'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">
                        {plan.limits.maxUsers ? `${plan.limits.maxUsers} team members` : 'Unlimited team members'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">
                        {plan.features.analytics} analytics
                      </span>
                    </div>
                    {plan.features.whatsapp && (
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">WhatsApp integration</span>
                      </div>
                    )}
                    {plan.features.api_access && (
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">API access</span>
                      </div>
                    )}
                    {plan.features.white_label && (
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">White-label solution</span>
                      </div>
                    )}
                  </div>

                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="text-center mb-4">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        Current Plan
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Upgrade Button */}
        <div className="text-center">
          <button
            onClick={handleUpgrade}
            disabled={upgrading || !selectedPlan}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {upgrading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Upgrade to {selectedPlan?.displayName}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
          
          <p className="text-gray-600 text-sm mt-4">
            30-day money-back guarantee • Cancel anytime • Secure payment
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
