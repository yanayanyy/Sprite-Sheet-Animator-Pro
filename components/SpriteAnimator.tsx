
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
  
  // Use a Ref to hold the current row so the animation loop always has the latest without restarts
  const stateRef = useRef({
    row: currentRow,
    fps: config.fps,
    padding: config.padding || 0,
    scale: config.characterScale || 1
  });

  useEffect(() => {
    // Reset frame to 0 when row actually changes
    if (stateRef.current.row !== currentRow) {
      frameRef.current = 0;
    }
    
    // Update ref with latest values from props
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

    const tr = 255, tg = 0, tb = 255; // Magenta #FF00FF
    const threshold = config.threshold;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      
      // Calculate Squared Euclidean Distance for performance
      const rDiff = r - tr;
      const gDiff = g - tg;
      const bDiff = b - tb;
      const distSq = rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;
      const dist = Math.sqrt(distSq);
      
      if (dist < threshold) {
        data[i + 3] = 0; 
      } else if (dist < threshold + 40) {
        // Linear fade for smooth edges
        const alpha = (dist - threshold) / 40;
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
    
    setLoadState('loading');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    
    img.onload = async () => {
      try {
        const processed = await processImage(img);
        if (processed) {
          offscreenCanvasRef.current = processed;
          setLoadState('success');
        } else {
          setLoadState('error');
        }
      } catch (e) {
        console.error("Image processing error:", e);
        setLoadState('error');
      }
    };
    img.onerror = () => {
      console.error("Image failed to load:", imageSrc);
      setLoadState('error');
    };
  }, [imageSrc, processImage]);

  const animate = useCallback((time: number) => {
    if (loadState !== 'success' || !offscreenCanvasRef.current || !canvasRef.current) {
      requestAnimationFrame(animate);
      return;
    }

    const { fps, row, padding, scale } = stateRef.current;
    const deltaTime = time - lastTimeRef.current;
    const interval = 1000 / fps;

    if (deltaTime >= interval) {
      lastTimeRef.current = time;
      
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const fullW = offscreenCanvasRef.current.width;
        const fullH = offscreenCanvasRef.current.height;
        const frameW = fullW / config.columns;
        const frameH = fullH / config.rows;
        
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Final draw size in pixels
        const drawSize = size * scale;
        const offsetX = (size - drawSize) / 2;
        const offsetY = (size - drawSize) / 2;

        // Use pixelated rendering if significantly zoomed in
        ctx.imageSmoothingEnabled = scale <= 1.5;
        
        ctx.drawImage(
          offscreenCanvasRef.current,
          frameRef.current * frameW + padding,
          row * frameH + padding,
          frameW - padding * 2,
          frameH - padding * 2,
          offsetX,
          offsetY,
          drawSize,
          drawSize
        );

        // Advance frame AFTER drawing
        frameRef.current = (frameRef.current + 1) % config.columns;
      }
    }

    requestAnimationFrame(animate);
  }, [loadState, config.columns, config.rows, size]);

  useEffect(() => {
    const handle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(handle);
  }, [animate]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-[2rem] ${className}`} style={{ width: size, height: size }}>
      {loadState === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-30">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-pink-400 text-xs font-black uppercase tracking-[0.2em] animate-pulse">Filtering Magenta...</p>
        </div>
      )}
      {loadState === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/20 text-red-400 p-8 text-center">
          <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <p className="font-bold text-sm uppercase">Invalid Sprite Sheet</p>
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size} 
        className="max-w-full h-full object-contain" 
      />
    </div>
  );
};
