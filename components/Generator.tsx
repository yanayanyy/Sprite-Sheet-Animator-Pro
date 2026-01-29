
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ModelConfig, MODEL_DETAILS } from '../types';

interface GeneratorProps {
  onImageGenerated: (base64: string) => void;
  modelConfig: ModelConfig;
  onOpenSettings: () => void;
}

const PROMPT_TEMPLATE = (charName: string) => `请生成一张精灵图（sprite sheet）

硬性要求：
- PNG 或 JPG 均可（推荐 PNG 以减少压缩噪点）
- 背景色必须是且只能是纯品红（magenta）#ff00ff：不要渐变/阴影/纹理/噪点/压缩噪点；不要出现第二种背景色像素；应用会自动把背景抠成透明
- 角色不要自带任何“背景/场景/地面/墙面/光斑/烟雾”等元素；除角色本身外，所有区域必须是纯品红背景（#ff00ff）
- 请避免在角色/道具/阴影中使用背景色（#ff00ff 或非常接近的品红色），否则会被一起抠掉
- 角色表面不要出现品红色反光/品红色轮廓光/品红色光晕（避免被误抠）
- 分成 8 列 × 7 行的网格，每一格必须是正方形帧（每帧宽高相等！）
- 每一帧与相邻帧必须紧挨着：不要留白/间隔/内边距/外边距；不要画网格线或分隔线（不要有任何缝隙！）
- 整体长宽比约为 8:7（≈1.1429）
- 推荐输出 4K 级别的高分辨率图片（如 4096×3584，每帧 512×512），程序会等比例缩放到最终尺寸 1024×896（每帧 128×128）
- 请确保图像质量高：角色细节清晰、边缘锐利、无模糊/锯齿/压缩伪影
- 同一行表示同一个动画；从左到右是连续帧，循环播放
- Idle（第1行）需要有呼吸和眨眼的动作，不要画成完全静止不动的帧
- Sleepy（第4行）只画闭眼呼吸的帧，不要画打哈欠的帧（因为循环播放时不停打哈欠会很突兀）
- 同一个动画（同一行）相邻两帧之间的变化必须非常连贯：不要跳帧、不要突然大幅位移/大幅姿态变化/大幅表情变化、不要突然变焦或改变视角
- 角色在每一帧中的位置尽量一致（建议以画布中心对齐），不要裁切到边缘

行含义（从上到下）：
- 第1行：Idle（idle）
- 第2行：Happy / Love（happy, love）
- 第3行：Excited / Celebrate（excited, celebrate）
- 第4行 : Sleepy / Snoring（sleepy, snoring）
- 第5行：Working（working）
- 第6行：Angry / Surprised / Shy（angry, surprised, shy）
- 第7行：Dragging（dragging）

角色设定：${charName}
风格：可爱、干净、3D 风格（例如 3D 卡通渲染 / 轻拟真），统一光照与配色，背景保持纯品红色（方便抠图）
输出：只输出这张 sprite sheet（png/jpg）`;

export const Generator: React.FC<GeneratorProps> = ({ onImageGenerated, modelConfig, onOpenSettings }) => {
  const [charName, setCharName] = useState("一只可爱的小蓝龙，圆滚滚的，大眼睛");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPromptTemplate, setShowPromptTemplate] = useState(false);
  const [showConfigHint, setShowConfigHint] = useState(false);

  const currentModelDetails = MODEL_DETAILS[modelConfig.type];

  const handleGenerate = async () => {
    if (modelConfig.type === 'custom') {
      if (!modelConfig.customUrl || !modelConfig.customApiKey || !modelConfig.customModelName) {
        setShowConfigHint(true);
        return;
      }
    } else {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setShowConfigHint(true);
        return;
      }
    }

    setIsGenerating(true);
    setError(null);
    try {
      if (modelConfig.type === 'custom') {
        const response = await fetch(`${modelConfig.customUrl}/images/generations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${modelConfig.customApiKey}`
          },
          body: JSON.stringify({
            model: modelConfig.customModelName,
            prompt: PROMPT_TEMPLATE(charName),
            n: 1,
            size: "1024x1024", 
            response_format: "b64_json"
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || "Custom API request failed.");
        }

        const data = await response.json();
        if (data.data?.[0]?.b64_json) {
          setResultImage(`data:image/png;base64,${data.data[0].b64_json}`);
        } else if (data.data?.[0]?.url) {
          setResultImage(data.data[0].url);
        } else {
          throw new Error("No image data returned from custom endpoint.");
        }
      } else {
        // Create a new instance right before the call to pick up the most recent key
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: modelConfig.type,
          contents: {
            parts: [{ text: PROMPT_TEMPLATE(charName) }],
          },
          config: {
            imageConfig: {
              aspectRatio: "4:3",
              // imageSize is only supported for gemini-3-pro-image-preview
              ...(modelConfig.type === 'gemini-3-pro-image-preview' ? { imageSize: "2K" } : {})
            }
          }
        });

        let foundImage = false;
        if (response.candidates && response.candidates.length > 0) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              const base64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
              setResultImage(base64);
              foundImage = true;
              break;
            }
          }
        }
        if (!foundImage) throw new Error("No image was generated. Please try again.");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      // If the request fails due to missing setup/billing, trigger the key selection dialog hint
      if (err.message?.includes("Requested entity was not found")) {
        setShowConfigHint(true);
      }
      setError(err.message || "An unexpected error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[3rem] backdrop-blur-3xl shadow-2xl space-y-6 relative overflow-hidden">
        {showConfigHint && (
          <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
            <div className="text-center space-y-4 max-w-xs">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <h4 className="text-sm font-black uppercase text-white tracking-widest">Config Required</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {modelConfig.type === 'custom' 
                  ? "Custom parameters (URL, Key, Model) are incomplete."
                  : `Please select a valid Gemini API key for ${currentModelDetails.name}.`
                }
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <button 
                  onClick={() => { setShowConfigHint(false); onOpenSettings(); }}
                  className="w-full py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all"
                >
                  Go to Settings
                </button>
                <button 
                  onClick={() => setShowConfigHint(false)}
                  className="w-full py-2 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${modelConfig.type === 'custom' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : (modelConfig.type.includes('pro') ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' : 'bg-pink-500 shadow-[0_0_8px_#ec4899]')}`}></span>
              {modelConfig.type === 'custom' ? `${currentModelDetails.name}: ${modelConfig.customModelName || 'Unnamed'}` : currentModelDetails.name}
            </div>
            <button 
              onClick={() => setShowPromptTemplate(!showPromptTemplate)}
              className="text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              {showPromptTemplate ? '[ Hide Logic ]' : '[ View Logic ]'}
            </button>
          </label>
          <textarea
            value={charName}
            onChange={(e) => setCharName(e.target.value)}
            placeholder="Describe your character..."
            className="w-full h-32 bg-slate-950/60 border border-slate-800 rounded-3xl p-5 text-sm text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none shadow-inner"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${
            isGenerating 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span>Initialize Rendering</span>
            </>
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-bold text-center leading-relaxed tracking-wider animate-shake">
            {error}
          </div>
        )}
      </div>

      {showPromptTemplate && (
        <div className="p-8 bg-slate-900/30 border border-white/5 rounded-[2.5rem] animate-in slide-in-from-top-2 duration-500">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
            Prompt Logic Architecture
          </h4>
          <div className="max-h-60 overflow-y-auto pr-4 scrollbar-thin">
            <pre className="text-[9px] text-slate-500 font-mono leading-relaxed whitespace-pre-wrap opacity-60">
              {PROMPT_TEMPLATE(charName)}
            </pre>
          </div>
        </div>
      )}

      {resultImage && (
        <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[3.5rem] backdrop-blur-3xl shadow-2xl space-y-6 animate-in zoom-in-95 duration-700">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Master Sheet Ready
            </span>
            <button 
              onClick={() => onImageGenerated(resultImage)}
              className="px-8 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-pink-500/30 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
              Animate Character
            </button>
          </div>
          <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 ring-12 ring-black/30 group cursor-crosshair bg-slate-950">
            <img src={resultImage} alt="Generated Sprite Sheet" className="w-full h-auto transition-transform duration-1000 group-hover:scale-[1.02]" />
          </div>
        </div>
      )}
    </div>
  );
};
