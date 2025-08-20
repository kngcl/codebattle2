import React, { useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  X,
  Sparkles,
  Trophy,
  Zap,
  Shield
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'achievement';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-600 to-emerald-600',
          border: 'border-green-500/30',
          icon: CheckCircle,
          iconColor: 'text-green-400',
          textColor: 'text-green-100'
        };
      case 'error':
        return {
          bg: 'from-red-600 to-pink-600',
          border: 'border-red-500/30',
          icon: XCircle,
          iconColor: 'text-red-400',
          textColor: 'text-red-100'
        };
      case 'warning':
        return {
          bg: 'from-yellow-600 to-orange-600',
          border: 'border-yellow-500/30',
          icon: AlertCircle,
          iconColor: 'text-yellow-400',
          textColor: 'text-yellow-100'
        };
      case 'info':
        return {
          bg: 'from-blue-600 to-cyan-600',
          border: 'border-blue-500/30',
          icon: Info,
          iconColor: 'text-blue-400',
          textColor: 'text-blue-100'
        };
      case 'achievement':
        return {
          bg: 'from-purple-600 to-pink-600',
          border: 'border-purple-500/30',
          icon: Trophy,
          iconColor: 'text-purple-400',
          textColor: 'text-purple-100'
        };
      default:
        return {
          bg: 'from-gray-600 to-gray-700',
          border: 'border-gray-500/30',
          icon: Info,
          iconColor: 'text-gray-400',
          textColor: 'text-gray-100'
        };
    }
  };

  const style = getToastStyle();
  const Icon = style.icon;

  return (
    <div className="relative animate-slide-in-right">
      <div className={`absolute inset-0 bg-gradient-to-r ${style.bg} rounded-xl blur-xl opacity-30`}></div>
      <div className={`relative flex items-start gap-3 p-4 bg-gray-900/90 backdrop-blur-sm rounded-xl border ${style.border} shadow-2xl min-w-[320px] max-w-md`}>
        <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-r ${style.bg} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{title}</h4>
          {message && (
            <p className="text-sm text-gray-300">{message}</p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 p-1 hover:bg-gray-800 rounded-lg transition-all group"
        >
          <X className="w-4 h-4 text-gray-500 group-hover:text-white" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 rounded-b-xl overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${style.bg} animate-progress`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
};

export default Toast;