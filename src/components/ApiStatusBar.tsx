import React from 'react';
import { Server, Cpu, Globe, Mic } from 'lucide-react';
import type { SystemStatus } from '../types';

interface ApiStatusBarProps {
  systemStatus: SystemStatus | null;
}

export const ApiStatusBar: React.FC<ApiStatusBarProps> = ({ systemStatus }) => {
  const serverOnline = systemStatus?.server?.online ?? true;
  const groqConnected = systemStatus?.groq?.connected ?? false;
  const langSearchConnected = systemStatus?.langSearch?.connected ?? false;
  const voiceAvailable = systemStatus?.voice?.available ?? true;
  const voiceLabel = systemStatus?.voice?.label ?? 'Browser Audio';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-7 mb-7">
      <div className="w-full rounded-2xl sm:rounded-full bg-[#181818]/90 border border-[#383034] backdrop-blur-xl px-5 py-2.5 shadow-md shadow-black/50 flex flex-wrap items-center justify-center sm:justify-around gap-3 sm:gap-6 text-xs text-[#B8B8B8]">
        
        {/* 1. Server Status */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              serverOnline
                ? 'bg-[#E11D48] shadow-[0_0_6px_#E11D48]'
                : 'bg-[#383034]'
            }`}
          />
          <Server className="w-3.5 h-3.5 text-[#E11D48] flex-shrink-0" />
          <span className="text-[#B8B8B8]">
            Server:{' '}
            <strong className="text-[#F5F5F5] font-medium">
              {serverOnline ? 'Online' : 'Offline'}
            </strong>
          </span>
        </div>

        <span className="hidden sm:inline-block w-px h-3.5 bg-[#383034]" />

        {/* 2. Groq API Status */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              groqConnected
                ? 'bg-[#E11D48] shadow-[0_0_6px_#E11D48]'
                : 'bg-[#383034]'
            }`}
          />
          <Cpu className="w-3.5 h-3.5 text-[#E11D48] flex-shrink-0" />
          <span className="text-[#B8B8B8]">
            Groq API:{' '}
            <strong className="text-[#F5F5F5] font-medium">
              {groqConnected ? 'Connected' : 'Unavailable'}
            </strong>
          </span>
        </div>

        <span className="hidden sm:inline-block w-px h-3.5 bg-[#383034]" />

        {/* 3. LangSearch Status */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              langSearchConnected
                ? 'bg-[#E11D48] shadow-[0_0_6px_#E11D48]'
                : 'bg-[#383034]'
            }`}
          />
          <Globe className="w-3.5 h-3.5 text-[#E11D48] flex-shrink-0" />
          <span className="text-[#B8B8B8]">
            LangSearch:{' '}
            <strong className="text-[#F5F5F5] font-medium">
              {langSearchConnected ? 'Connected' : 'Unavailable'}
            </strong>
          </span>
        </div>

        <span className="hidden sm:inline-block w-px h-3.5 bg-[#383034]" />

        {/* 4. Voice Status */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              voiceAvailable
                ? 'bg-[#E11D48] shadow-[0_0_6px_#E11D48]'
                : 'bg-[#383034]'
            }`}
          />
          <Mic className="w-3.5 h-3.5 text-[#E11D48] flex-shrink-0" />
          <span className="text-[#B8B8B8]">
            Voice:{' '}
            <strong className="text-[#F5F5F5] font-medium">
              {voiceAvailable ? voiceLabel : 'Unavailable'}
            </strong>
          </span>
        </div>

      </div>
    </div>
  );
};
