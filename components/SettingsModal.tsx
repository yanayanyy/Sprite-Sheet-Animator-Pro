
import React from 'react';
import { GenModel, MODEL_DETAILS } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: GenModel;
  onSelectModel: (model: GenModel) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, selectedModel, onSelectModel }) => {
  if (!isOpen) return null;

  const handleConfigureKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[3rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <header className="mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white">Project Config</h2>
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-2">Engine & Authorization</p>
        </header>

        <div className="space-y-4 mb-8">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Vision Model</label>
          <div className="grid grid-cols-1 gap-3">
            {(Object.keys(MODEL_DETAILS) as GenModel[]).map((modelId) => {
              const details = MODEL_DETAILS[modelId];
              const isActive = selectedModel === modelId;
              return (
                <button
                  key={modelId}
                  onClick={() => onSelectModel(modelId)}
                  className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                    isActive 
                    ? 'bg-white border-white' 
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

        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase text-indigo-300 tracking-wide">API Authorization</h4>
              <p className="text-[10px] text-indigo-400/80 mt-1 leading-relaxed">
                Ensure billing is active. Paimon Studio requires a paid project for Pro features.
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline ml-1 opacity-100 hover:text-indigo-200">View Docs</a>
              </p>
            </div>
          </div>
          <button 
            onClick={handleConfigureKey}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            Update Key Selection
          </button>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-slate-300 transition-colors"
        >
          Close Settings
        </button>
      </div>
    </div>
  );
};
