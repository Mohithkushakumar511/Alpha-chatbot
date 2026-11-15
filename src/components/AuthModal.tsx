import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Database,
} from 'lucide-react';
import type { User, Conversation } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBase: string;
  onAuthSuccess: (token: string, user: User) => void;
  guestConversations: Conversation[];
  onTransferConversations: (token: string) => Promise<void>;
  initialMode?: 'signin' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  apiBase,
  onAuthSuccess,
  guestConversations,
  onTransferConversations,
  initialMode = 'signin',
}) => {
  const [tab, setTab] = useState<'signin' | 'register'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Transfer flow state
  const [pendingAuth, setPendingAuth] = useState<{ token: string; user: User } | null>(null);
  const [showTransferOffer, setShowTransferOffer] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  // Forgot password dialog
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setError(null);
    setSuccessMsg(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleSwitchTab = (newTab: 'signin' | 'register') => {
    setTab(newTab);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (tab === 'register') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter.');
        return;
      }
    }

    setIsLoading(true);

    try {
      const endpoint = tab === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body =
        tab === 'register'
          ? { full_name: fullName.trim(), email: cleanEmail, password }
          : { email: cleanEmail, password };

      const res = await fetch(`${apiBase}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        let errorMsg = data.error;
        if (!errorMsg && data.detail) {
          if (Array.isArray(data.detail)) {
            errorMsg = data.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
          } else if (typeof data.detail === 'string') {
            errorMsg = data.detail;
          }
        }

        if (!errorMsg) {
          if (res.status === 401) {
            errorMsg = 'Invalid email address or password.';
          } else if (res.status === 404) {
            errorMsg = 'Authentication service endpoint not found on server (404). Please verify your backend server.';
          } else if (res.status === 500) {
            errorMsg = 'Server encountered an error during authentication. Please try again.';
          } else {
            errorMsg = 'Authentication failed. Please verify your credentials.';
          }
        }

        throw new Error(errorMsg);
      }

      setSuccessMsg(tab === 'register' ? 'Account created successfully!' : 'Signed in successfully!');

      const token = data.token;
      const user = data.user;

      // Check if user has local guest conversations that can be transferred
      if (guestConversations && guestConversations.length > 0) {
        setPendingAuth({ token, user });
        setShowTransferOffer(true);
      } else {
        setTimeout(() => {
          onAuthSuccess(token, user);
          onClose();
        }, 500);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmTransfer = async () => {
    if (!pendingAuth) return;
    setIsTransferring(true);
    try {
      await onTransferConversations(pendingAuth.token);
      onAuthSuccess(pendingAuth.token, pendingAuth.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to transfer chats.');
      onAuthSuccess(pendingAuth.token, pendingAuth.user);
      onClose();
    } finally {
      setIsTransferring(false);
    }
  };

  const handleSkipTransfer = () => {
    if (pendingAuth) {
      onAuthSuccess(pendingAuth.token, pendingAuth.user);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Dialog Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#0D0A1A]/95 border border-[#251E3E] rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-[#F8FAFC] flex flex-col"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1E1638] transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. GUEST-TO-ACCOUNT TRANSFER MODAL VIEW */}
        {showTransferOffer ? (
          <div className="flex flex-col items-center text-center py-4 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/30 to-[#38BDF8]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Database className="w-7 h-7 text-[#B794F4]" />
            </div>

            <h3 className="font-display font-bold text-xl text-[#F8FAFC] mb-2">
              Transfer Guest Conversations?
            </h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-xs leading-relaxed mb-6">
              You have <strong className="text-[#38BDF8]">{guestConversations.length}</strong> conversation(s) from your guest session. Would you like to transfer and save them to your account now?
            </p>

            <div className="w-full flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleConfirmTransfer}
                disabled={isTransferring}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] hover:from-[#9061F9] hover:to-[#7E3AF2] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#8B5CF6]/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isTransferring ? (
                  <span>Transferring Conversations...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Yes, Transfer My Conversations</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSkipTransfer}
                className="w-full py-2.5 px-4 rounded-xl bg-[#131020] hover:bg-[#1E1638] border border-[#251E3E] text-[#A1A1AA] hover:text-[#F8FAFC] text-xs font-medium transition-all cursor-pointer"
              >
                Skip & Start Fresh
              </button>
            </div>
          </div>
        ) : showForgotModal ? (
          /* 2. FORGOT PASSWORD VIEW */
          <div className="flex flex-col py-2 animate-in fade-in duration-200">
            <h3 className="font-display font-bold text-xl text-[#F8FAFC] mb-1.5">
              Reset Your Password
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-4">
              Enter your registered email address to receive password recovery instructions.
            </p>

            {forgotSent ? (
              <div className="p-4 rounded-2xl bg-[#131020] border border-[#38BDF8]/40 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-[#38BDF8] mx-auto" />
                <p className="text-xs text-[#F8FAFC]">
                  If an account exists for <strong>{forgotEmail}</strong>, password reset details have been routed.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-[#8B5CF6] text-white text-xs font-semibold cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotEmail.includes('@')) {
                    setForgotSent(true);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                    Account Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-[#A1A1AA]" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#131020] border border-[#251E3E] focus:border-[#8B5CF6] text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#A1A1AA]/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold cursor-pointer transition-all"
                  >
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-2.5 rounded-xl bg-[#131020] text-[#A1A1AA] hover:text-white text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* 3. PRIMARY SIGN IN & REGISTER TABS */
          <>
            {/* Header Brand */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B5CF6] via-[#6D28D9] to-[#38BDF8] p-[1px] shadow-[0_0_12px_rgba(139,92,246,0.35)] flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-[#080811] flex items-center justify-center">
                  <span className="font-display font-black text-xs text-white">α</span>
                </div>
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-[#F8FAFC]">
                  Alpha AI Account
                </h2>
                <p className="text-[11px] text-[#A1A1AA]">
                  Optional sync for persistent conversations & history
                </p>
              </div>
            </div>

            {/* Segmented Tab Switcher */}
            <div className="flex p-1 rounded-2xl bg-[#131020] border border-[#251E3E] mb-5">
              <button
                type="button"
                onClick={() => handleSwitchTab('signin')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  tab === 'signin'
                    ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
                    : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleSwitchTab('register')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  tab === 'register'
                    ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
                    : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-[#EC4899]/15 border border-[#EC4899]/40 flex items-start gap-2.5 text-xs text-[#F472B6] animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Banner */}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-[#34D399]/15 border border-[#34D399]/40 flex items-center gap-2.5 text-xs text-[#34D399] animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Full Name (Registration only) */}
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <UserIcon className="absolute left-3.5 w-4 h-4 text-[#A1A1AA]" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Mohith Kusha Kumar"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#131020] border border-[#251E3E] focus:border-[#8B5CF6] text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#A1A1AA]/40 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-[#A1A1AA]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#131020] border border-[#251E3E] focus:border-[#8B5CF6] text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#A1A1AA]/40 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#A1A1AA]">
                    Password
                  </label>
                  {tab === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] text-[#8B5CF6] hover:text-[#B794F4] transition-colors cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-[#A1A1AA]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#131020] border border-[#251E3E] focus:border-[#8B5CF6] text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#A1A1AA]/40 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#A1A1AA] hover:text-[#F8FAFC] cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Registration only) */}
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-[#A1A1AA]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#131020] border border-[#251E3E] focus:border-[#8B5CF6] text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#A1A1AA]/40 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] hover:from-[#9061F9] hover:to-[#7E3AF2] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#8B5CF6]/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{tab === 'signin' ? 'Sign In to Alpha' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Guest Fallback Action */}
            <div className="mt-5 pt-4 border-t border-[#251E3E]/60 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-[#A1A1AA] hover:text-[#38BDF8] transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Want to explore first? <strong>Continue as Guest</strong></span>
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
