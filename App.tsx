
import React, { useState, useEffect } from 'react';
import { SpriteAnimator } from './components/SpriteAnimator';
import { Generator } from './components/Generator';
import { SettingsModal } from './components/SettingsModal';
import { AnimationRow, ANIMATION_LABELS, SpriteConfig, ModelConfig } from './types';

const DEFAULT_CONFIG: SpriteConfig & { padding: number; characterScale: number } = {
  columns: 8,
  rows: 7,
  fps: 12,
  chromaKey: "#ff00ff",
  threshold: 120, 
  padding: 3,     
  characterScale: 1.0
};

type ViewMode = 'generator' | 'animator';

export default function App() {
  const [activeView, setActiveView] = useState<ViewMode>('generator');
  const [imageSrc, setImageSrc] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<AnimationRow>(AnimationRow.IDLE);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [showSheet, setShowSheet] = useState(false);
  const [bgType, setBgType] = useState<'checkboard' | 'dark' | 'light'>('checkboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [modelConfig, setModelConfig] = useState<ModelConfig>(() => {
    const saved = localStorage.getItem('sprite_animator_pro_model_config');
    return saved ? JSON.parse(saved) : { type: 'gemini-3-pro-image-preview' };
  });

  useEffect(() => {
    localStorage.setItem('sprite_animator_pro_model_config', JSON.stringify(modelConfig));
  }, [modelConfig]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImageSrc(e.target.result as string);
          setActiveView('animator');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratedImage = (base64: string) => {
    setImageSrc(base64);
    setActiveView('animator');
  };

  const getBgClass = () => {
    switch(bgType) {
      case 'dark': return 'bg-[#05050a]';
      case 'light': return 'bg-slate-200';
      default: return 'checkboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-slate-100 flex flex-col p-4 md:p-8 font-sans transition-colors duration-500">
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        config={modelConfig}
        onUpdateConfig={setModelConfig}
      />

      <div className="max-w-7xl mx-auto w-full flex-grow">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <div className="bg-slate-900/60 p-1.5 rounded-full border border-white/5 backdrop-blur-md flex shadow-2xl">
            <button 
              onClick={() => setActiveView('generator')}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeView === 'generator' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 00-2 0v1a1 1 0 002 0zM13 16v-1a1 1 0 00-2 0v1a1 1 0 002 0zM16.464 14.95a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 011.414-1.414l.707.707z" /></svg>
              Creator
            </button>
            <button 
              onClick={() => setActiveView('animator')}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeView === 'animator' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
              Animator
            </button>
          </div>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-12 h-12 flex items-center justify-center bg-slate-900 border border-white/5 rounded-full text-slate-500 hover:text-white transition-all shadow-xl active:rotate-90 duration-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <aside className="lg:col-span-4 space-y-6">
            <header className="p-2 mb-4">
              <h1 className="text-4xl font-black italic bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent uppercase tracking-tighter leading-none">
                Animator<br/>Pro
              </h1>
              <p className="text-[10px] text-slate-600 font-bold tracking-[0.4em] uppercase mt-3 opacity-60">Engine Selection Active</p>
            </header>

            {activeView === 'animator' ? (
              <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2.5rem] space-y-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-500/20 transition-all duration-700"></div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]"></span>
                    01. Master Sheet
                  </label>
                  <div className="relative group/upload border-2 border-dashed border-slate-800 hover:border-pink-500/50 rounded-3xl p-6 transition-all bg-slate-950/60 cursor-pointer text-center">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="space-y-2 py-2">
                      <div className="text-slate-600 group-hover/upload:text-pink-400 transition-colors">
                        <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 group-hover/upload:text-slate-300">Drop Sprite Sheet Here</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-2">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>Character Scale</span>
                      <span className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">x{config.characterScale.toFixed(2)}</span>
                    </div>
                    <input type="range" min="0.5" max="3.0" step="0.05" value={config.characterScale} onChange={(e) => setConfig({...config, characterScale: parseFloat(e.target.value)})} className="w-full" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>Chroma Distance</span>
                      <span className="text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded-full">{config.threshold}</span>
                    </div>
                    <input type="range" min="10" max="250" value={config.threshold} onChange={(e) => setConfig({...config, threshold: parseInt(e.target.value)})} className="w-full" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>Frame Inset (Crop)</span>
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{config.padding}px</span>
                    </div>
                    <input type="range" min="0" max="20" value={config.padding} onChange={(e) => setConfig({...config, padding: parseInt(e.target.value)})} className="w-full" />
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5">
                    <div className="flex-grow space-y-2">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Playback</span>
                        <span className="text-white">{config.fps} FPS</span>
                      </div>
                      <input type="range" min="1" max="24" value={config.fps} onChange={(e) => setConfig({...config, fps: parseInt(e.target.value)})} className="w-full" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Stage Theme</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['checkboard', 'dark', 'light'] as const).map(type => (
                      <button key={type} onClick={() => setBgType(type)} className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${bgType === type ? 'bg-white text-black border-white' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}>{type}</button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${modelConfig.type === 'custom' ? 'bg-emerald-500' : (modelConfig.type.includes('pro') ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' : 'bg-pink-500 shadow-[0_0_8px_#ec4899]')}`}></span>
                      Active Configuration
                    </label>
                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                       <p className="text-[11px] font-black text-indigo-400 uppercase mb-1">
                         {/* Fix: replaced undefined localConfig with modelConfig */}
                         {modelConfig.type === 'custom' ? (modelConfig.customModelName || 'Custom Model') : (modelConfig.type.includes('pro') ? 'Pro Engine' : 'Flash Engine')}
                       </p>
                       <p className="text-[9px] text-slate-500 italic">
                         {modelConfig.type === 'custom' ? `Endpoint: ${modelConfig.customUrl || 'Not set'}` : `Optimized for ${modelConfig.type.includes('pro') ? '2K Master Sheets' : 'Rapid 1K Iterations'}.`}
                       </p>
                    </div>
                    <ul className="text-[11px] text-slate-400 space-y-3 font-medium">
                      <li className="flex gap-2"><span className="text-indigo-500">●</span> 8 columns x 7 rows grid</li>
                      <li className="flex gap-2"><span className="text-indigo-500">●</span> Pure #ff00ff magenta background</li>
                      <li className="flex gap-2 text-[9px] text-slate-500">Change models via settings icon.</li>
                    </ul>
                 </div>
              </div>
            )}
          </aside>

          <main className="lg:col-span-8">
            {activeView === 'generator' ? (
              <Generator 
                onImageGenerated={handleGeneratedImage} 
                modelConfig={modelConfig}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            ) : (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className={`${getBgClass()} relative w-full aspect-square md:aspect-[16/10] rounded-[3.5rem] overflow-hidden border border-white/5 shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-700`}>
                  {imageSrc ? (
                    <SpriteAnimator 
                      imageSrc={imageSrc} 
                      currentRow={selectedRow} 
                      config={config} 
                      size={580} 
                    />
                  ) : (
                    <div className="text-center p-12 max-w-sm">
                      <div className="w-20 h-20 mx-auto mb-6 bg-slate-900 rounded-3xl flex items-center justify-center text-slate-700 border border-slate-800 animate-bounce">
                         <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1.5"/></svg>
                      </div>
                      <h3 className="text-lg font-black uppercase tracking-tighter mb-2">Stage Ready</h3>
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-[0.2em] leading-relaxed">Go to Creator tab to generate a character or upload one here.</p>
                    </div>
                  )}

                  {imageSrc && (
                    <div className="absolute top-10 left-10 pointer-events-none">
                      <div className="bg-black/40 backdrop-blur-2xl px-6 py-4 rounded-[2rem] border border-white/10 shadow-2xl">
                        <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em] mb-1">Row {selectedRow + 1}</p>
                        <p className="text-xl font-black italic uppercase tracking-tight text-white">{ANIMATION_LABELS[selectedRow].title}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {(Object.keys(ANIMATION_LABELS) as unknown as string[]).map((key) => {
                    const rowIdx = parseInt(key);
                    const isActive = selectedRow === rowIdx;
                    return (
                      <button
                        key={rowIdx}
                        onClick={() => setSelectedRow(rowIdx as AnimationRow)}
                        className={`group relative p-4 rounded-[2.2rem] transition-all border-2 text-left active:scale-95 ${
                          isActive 
                          ? 'bg-white text-black border-white shadow-[0_20px_40px_-10px_rgba(255,255,255,0.25)] scale-[1.02] z-10' 
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'
                        }`}
                      >
                        <div className={`text-[9px] font-black uppercase tracking-tighter mb-1 ${isActive ? 'text-pink-600' : 'text-slate-600'}`}>Row {rowIdx + 1}</div>
                        <div className="text-[11px] font-black uppercase leading-tight truncate">{ANIMATION_LABELS[rowIdx as AnimationRow].title}</div>
                        {isActive && <div className="absolute top-4 right-5 w-1.5 h-1.5 rounded-full bg-pink-500"></div>}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col items-center gap-6">
                  <button 
                    onClick={() => setShowSheet(!showSheet)}
                    className="px-10 py-4 rounded-full bg-slate-900/40 border border-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all active:scale-95"
                  >
                    {showSheet ? "Collapse Grid" : "Inspect Sheet Map"}
                  </button>

                  {showSheet && imageSrc && (
                    <div className="w-full bg-slate-900/30 p-8 rounded-[3rem] border border-white/5 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                      <div className="relative group/sheet overflow-hidden rounded-2xl border border-white/10 ring-8 ring-black/20">
                        <img src={imageSrc} alt="Master Sheet" className="w-full h-auto opacity-70 group-hover/sheet:opacity-100 transition-opacity" />
                        <div className="absolute left-0 right-0 border-y-2 border-pink-500/50 bg-pink-500/5 pointer-events-none transition-all" style={{ top: `${(selectedRow / 7) * 100}%`, height: `${(1 / 7) * 100}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      
      <footer className="max-w-7xl mx-auto w-full pt-12 pb-6 border-t border-white/5 mt-8 flex justify-between items-center opacity-40">
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">© 2025 Sprite Sheet Animator Pro • AI Sprite Engine</p>
        <div className="flex gap-4">
           <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
        </div>
      </footer>
    </div>
  );
}
