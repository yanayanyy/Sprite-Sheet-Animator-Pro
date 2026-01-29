
import React, { useState, useEffect } from 'react';
import { GenModel, MODEL_DETAILS, ModelConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ModelConfig;
  onUpdateConfig: (config: ModelConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onUpdateConfig }) => {
  const [localConfig, setLocalConfig] = useState<ModelConfig>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleConfigureKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
    }
  };

  const saveAndClose = () => {
    onUpdateConfig(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={saveAndClose} />
      
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[3rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <header className="mb-8 flex-shrink-0">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white">Engine Config</h2>
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-2">Provider & Infrastructure</p>
        </header>

        <div className="flex-grow overflow-y-auto pr-2 space-y-6 scrollbar-thin">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Infrastructure</label>
            <div className="grid grid-cols-1 gap-3">
              {(Object.keys(MODEL_DETAILS) as GenModel[]).map((modelId) => {
                const details = MODEL_DETAILS[modelId];
                const isActive = localConfig.type === modelId;
                return (
                  <button
                    key={modelId}
                    onClick={() => setLocalConfig({ ...localConfig, type: modelId })}
                    className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                      isActive 
                      ? 'bg-white border-white shadow-xl shadow-white/5' 
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-black uppercase ${isActive ? 'text-black' : 'text-slate-200'}`}>{details.name}</span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${isActive ? 'bg-black text-white' : 'bg-slate-800 text-slate-400'}`}>{details.badge}</span>
                      </div>
                      <p className={`text-[9px] mt-1 ${isActive ? 'text-slate-600' : 'text-slate-500'}`}>{details.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-black' : 'border-slate-800'}`}>
                      {isActive && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {localConfig.type === 'custom' ? (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 space-y-5 animate-in slide-in-from-top-2">
               <h3 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Custom Parameters</h3>
               
               <div className="space-y-2">
                 <label className="text-[9px] font-bold text-slate-500 uppercase">Endpoint Base URL</label>
                 <input 
                   type="text" 
                   value={localConfig.customUrl || ''} 
                   onChange={e => setLocalConfig({...localConfig, customUrl: e.target.value})}
                   placeholder="https://api.yourprovider.com/v1"
                   className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-emerald-500 transition-colors"
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-[9px] font-bold text-slate-500 uppercase">Custom API Key</label>
                 <input 
                   type="password" 
                   value={localConfig.customApiKey || ''} 
                   onChange={e => setLocalConfig({...localConfig, customApiKey: e.target.value})}
                   placeholder="sk-..."
                   className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-emerald-500 transition-colors"
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-[9px] font-bold text-slate-500 uppercase">Model Identifier</label>
                 <input 
                   type="text" 
                   value={localConfig.customModelName || ''} 
                   onChange={e => setLocalConfig({...localConfig, customModelName: e.target.value})}
                   placeholder="e.g. dall-e-3"
                   className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-emerald-500 transition-colors"
                 />
               </div>
            </div>
          ) : (
            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6 space-y-4 animate-in slide-in-from-top-2">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase text-indigo-300 tracking-wide">Google AI Studio</h4>
                  <p className="text-[10px] text-indigo-400/80 mt-1 leading-relaxed">
                    Uses official @google/genai SDK. Requires paid tier for Pro features.
                  </p>
                </div>
              </div>
              <button 
                onClick={handleConfigureKey}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                Configure Gemini Key
              </button>
            </div>
          )}
        </div>

        <button 
          onClick={saveAndClose}
          className="w-full mt-8 py-5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-slate-200 transition-colors shadow-xl"
        >
          Save & Commit
        </button>
      </div>
    </div>
  );
};
