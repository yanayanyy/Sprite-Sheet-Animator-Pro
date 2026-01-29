
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AnimationRow, SpriteConfig } from '../types';

interface SpriteAnimatorProps {
  imageSrc: string;
  currentRow: AnimationRow;
  config: SpriteConfig & { padding?: number; characterScale?: number };
  className?: string;
  size?: number;
}

export const SpriteAnimator: React.FC<SpriteAnimatorProps> = ({
  imageSrc,
  currentRow,
  config,
  className = "",
  size = 512
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const requestRef = useRef<number>(0);
  
  const stateRef = useRef({
    row: currentRow,
    fps: config.fps,
    padding: config.padding || 0,
    scale: config.characterScale || 1
  });

  useEffect(() => {
    if (stateRef.current.row !== currentRow) {
      frameRef.current = 0;
    }
    stateRef.current = {
      row: currentRow,
      fps: config.fps,
      padding: config.padding || 0,
      scale: config.characterScale || 1
    };
  }, [currentRow, config.fps, config.padding, config.characterScale]);

  const processImage = useCallback(async (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const tr = 255, tg = 0, tb = 255;
    const thresholdSq = config.threshold * config.threshold;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const rDiff = r - tr, gDiff = g - tg, bDiff = b - tb;
      const distSq = rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;
      
      if (distSq < thresholdSq) {
        data[i + 3] = 0; 
      } else if (distSq < thresholdSq * 1.5) {
        const dist = Math.sqrt(distSq);
        const alpha = (dist - config.threshold) / (config.threshold * 0.5);
        data[i + 3] = Math.min(data[i + 3], Math.floor(alpha * 255));
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }, [config.threshold]);

  useEffect(() => {
    if (!imageSrc) {
      setLoadState('idle');
      offscreenCanvasRef.current = null;
      return;
    }
    
    let isMounted = true;
    setLoadState('loading');
    const img = new Image();
    img.crossOrigin = "anonymous";

    const handleLoad = async () => {
      try {
        const processed = await processImage(img);
        if (isMounted) {
          if (processed) {
            offscreenCanvasRef.current = processed;
            setLoadState('success');
          } else {
            setLoadState('error');
          }
        }
      } catch (e) {
        if (isMounted) {
          console.error("Sprite processing error:", e);
          setLoadState('error');
        }
      }
    };

    img.onload = handleLoad;
    img.onerror = () => isMounted && setLoadState('error');
    img.src = imageSrc;

    if (img.complete) handleLoad();

    const timeout = setTimeout(() => {
      if (isMounted && loadState === 'loading') setLoadState('error');
    }, 20000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [imageSrc, processImage]);

  const animate = useCallback((time: number) => {
    if (loadState === 'success' && offscreenCanvasRef.current && canvasRef.current) {
      const { fps, row, padding, scale } = stateRef.current;
      const deltaTime = time - lastTimeRef.current;
      const interval = 1000 / Math.max(fps, 1);

      if (deltaTime >= interval) {
        lastTimeRef.current = time;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          const frameW = offscreenCanvasRef.current.width / config.columns;
          const frameH = offscreenCanvasRef.current.height / config.rows;
          
          ctx.clearRect(0, 0, size, size);
          const drawSize = size * scale;
          const offset = (size - drawSize) / 2;

          ctx.imageSmoothingEnabled = scale <= 1.2;
          ctx.drawImage(
            offscreenCanvasRef.current,
            frameRef.current * frameW + padding,
            row * frameH + padding,
            frameW - padding * 2,
            frameH - padding * 2,
            offset, offset, drawSize, drawSize
          );

          frameRef.current = (frameRef.current + 1) % config.columns;
        }
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [loadState, config.columns, config.rows, size]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-[2.5rem] ${className}`} style={{ width: size, height: size }}>
      {loadState === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020205]/80 backdrop-blur-xl z-30">
          <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Rendering Frames</p>
        </div>
      )}
      {loadState === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/20 text-red-400 p-8 text-center backdrop-blur-sm">
          <p className="font-black text-xs uppercase tracking-widest">Load Failed</p>
          <p className="text-[10px] opacity-60 mt-2">Invalid image or processing error.</p>
        </div>
      )}
      <canvas ref={canvasRef} width={size} height={size} className="w-full h-full object-contain" />
    </div>
  );
};
