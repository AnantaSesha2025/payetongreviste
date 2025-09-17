import { useState, useEffect } from 'react';
import {
  isLocalAIReady,
  getInitializationStatus,
} from '../lib/localChatbotService';
import './AIStatusIndicator.css';

/**
 * AI Status Indicator Component
 * Shows the status of the local AI engine initialization
 */
export function AIStatusIndicator() {
  const [status, setStatus] = useState<{
    isInitializing: boolean;
    isReady: boolean;
    error: string | null;
  }>({
    isInitializing: false,
    isReady: false,
    error: null,
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        console.log('🔍 Checking AI status...');
        const { isInitializing, isReady } = getInitializationStatus();
        console.log('📊 AI Status:', { isInitializing, isReady });
        setStatus({ isInitializing, isReady, error: null });

        if (!isReady && !isInitializing) {
          // Try to initialize
          console.log('🚀 Starting AI initialization...');
          setStatus(prev => ({ ...prev, isInitializing: true }));
          const ready = await isLocalAIReady();
          console.log('✅ AI initialization result:', ready);
          setStatus({ isInitializing: false, isReady: ready, error: null });
        }
      } catch (error) {
        console.error('❌ AI Status check error:', error);
        setStatus({
          isInitializing: false,
          isReady: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    checkStatus();

    // Check status every 2 seconds
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  // Always show something for debugging
  console.log('🎨 Rendering AI Status:', status);

  if (status.isReady) {
    return (
      <div className="ai-status ai-status--ready">
        <div className="ai-status-icon">🤖</div>
        <span>IA Locale Active</span>
      </div>
    );
  }

  if (status.isInitializing) {
    return (
      <div className="ai-status ai-status--loading">
        <div className="ai-status-spinner"></div>
        <span>Initialisation IA...</span>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="ai-status ai-status--error">
        <div className="ai-status-icon">⚠️</div>
        <span>Mode Fallback</span>
      </div>
    );
  }

  return (
    <div className="ai-status ai-status--offline">
      <div className="ai-status-icon">💬</div>
      <span>Mode Simple</span>
    </div>
  );
}
