import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Square,
  Maximize2,
  Minimize2,
  Camera,
  Check,
  Volume2,
  Sparkles,
  Zap,
  Activity,
  Compass,
  Film,
  Terminal,
  Shield,
  RotateCw
} from 'lucide-react';
import { StoryboardClip, PlayerState } from '../types';
import { audioSynth } from '../utils/audioSynth';

interface LiveAnimationStudioProps {
  activeClip: StoryboardClip;
  playerState: PlayerState;
  onTogglePlay: () => void;
  onSelectNextClip: () => void;
  onSelectPrevClip: () => void;
}

export const LiveAnimationStudio: React.FC<LiveAnimationStudioProps> = ({
  activeClip,
  playerState,
  onTogglePlay,
  onSelectNextClip,
  onSelectPrevClip,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [renderMode, setRenderMode] = useState<'seedance' | 'plasma-fx'>('seedance');

  // Camera Orbit state
  const orbitRef = useRef({ yaw: 0, pitch: 0, targetYaw: 0, targetPitch: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    orbitRef.current.targetYaw += dx * 0.006;
    orbitRef.current.targetPitch = Math.max(-0.6, Math.min(0.6, orbitRef.current.targetPitch + dy * 0.006));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Canvas 60FPS Render Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let frame = 0;

    const resizeCanvas = () => {
      const container = containerRef.current;
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(360, (w * 9) / 16);
      canvas.width = w;
      canvas.height = h;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;
      const t = frame * 0.02;

      // Orbit camera smooth damping
      const orbit = orbitRef.current;
      orbit.yaw += (orbit.targetYaw - orbit.yaw) * 0.12;
      orbit.pitch += (orbit.targetPitch - orbit.pitch) * 0.12;

      // Clear Canvas (Deep Cyber Obsidian)
      ctx.fillStyle = '#05070e';
      ctx.fillRect(0, 0, w, h);

      // 1. Grid Perspective Lines
      ctx.save();
      ctx.strokeStyle = renderMode === 'plasma-fx' ? 'rgba(255, 170, 0, 0.08)' : 'rgba(0, 243, 255, 0.06)';
      ctx.lineWidth = 1;
      const horizonY = h * 0.72 + orbit.pitch * 50;
      const horizonX = w * 0.5 + orbit.yaw * 60;

      for (let x = -w * 0.5; x < w * 1.5; x += 45) {
        ctx.beginPath();
        ctx.moveTo(horizonX, horizonY);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = horizonY; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Liquid Chrome & Particle Vortex
      ctx.save();
      const pCount = 50;
      for (let i = 0; i < pCount; i++) {
        const speed = 0.5 + (i % 4) * 0.2;
        const angle = (i / pCount) * Math.PI * 2 + t * speed;
        const radius = 60 + ((i * 17) % 180);
        const px = horizonX + Math.cos(angle + orbit.yaw) * radius;
        const py = horizonY - 40 + Math.sin(angle) * (radius * 0.4) + orbit.pitch * 30;

        ctx.fillStyle = i % 2 === 0 ? (renderMode === 'plasma-fx' ? '#ffaa00' : '#00f3ff') : '#b026ff';
        ctx.beginPath();
        ctx.arc(px, py, 1.5 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Central Dragon Avatar Silhouette / Visage
      ctx.save();
      const cx = horizonX;
      const cy = horizonY - 50;

      // Holographic Pedestal Base
      const pedGlow = ctx.createRadialGradient(cx, cy + 80, 10, cx, cy + 80, 120);
      pedGlow.addColorStop(0, renderMode === 'plasma-fx' ? 'rgba(255, 170, 0, 0.35)' : 'rgba(0, 243, 255, 0.25)');
      pedGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = pedGlow;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 80, 120, 30, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dragon Head Shape
      ctx.fillStyle = '#080d1a';
      ctx.strokeStyle = renderMode === 'plasma-fx' ? '#ffaa00' : '#00f3ff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 35, cy - 30);
      ctx.lineTo(cx + 15, cy - 45);
      ctx.lineTo(cx + 60, cy - 15);
      ctx.lineTo(cx + 50, cy + 5);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx - 25, cy + 15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Ocular Visor Glow
      ctx.fillStyle = renderMode === 'plasma-fx' ? '#ff5500' : '#00f3ff';
      ctx.shadowColor = renderMode === 'plasma-fx' ? '#ffaa00' : '#00f3ff';
      ctx.shadowBlur = 12;
      ctx.fillRect(cx + 18, cy - 30, 16, 6);
      ctx.shadowBlur = 0;

      // Swept Back Horns
      ctx.strokeStyle = renderMode === 'plasma-fx' ? '#ff3366' : '#b026ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy - 40);
      ctx.quadraticCurveTo(cx - 50, cy - 75, cx - 75, cy - 60);
      ctx.stroke();

      ctx.restore();

      // 4. 32-Band Live Audio Spectrum at Base
      ctx.save();
      const barW = (w - 40) / 32;
      for (let b = 0; b < 32; b++) {
        const val = playerState.isPlaying ? Math.abs(Math.sin(t * 3 + b * 0.4)) * 35 + 5 : 4;
        const bx = 20 + b * barW;
        ctx.fillStyle = renderMode === 'plasma-fx' ? 'rgba(255, 170, 0, 0.7)' : 'rgba(0, 243, 255, 0.65)';
        ctx.fillRect(bx, h - 20 - val, barW - 2, val);
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, [playerState.isPlaying, renderMode]);

  const handleSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `dragon9_clip_${activeClip.clipNumber}_snapshot.png`;
    link.href = dataUrl;
    link.click();
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2000);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-mono">
      {/* Step Header Banner */}
      <div className="p-6 rounded-2xl glass-panel-glow border border-sky-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Film className="w-5 h-5 text-sky-400" />
            <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider">
              Step 5: 60FPS Live Animation Studio Viewport
            </h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time WebGL/Canvas 60fps render engine previewing Dragon 9 characters, liquid chrome physics, 360° camera rotation, and Seedance 2.5 prompt HUD overlay.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRenderMode(renderMode === 'seedance' ? 'plasma-fx' : 'seedance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 border ${
              renderMode === 'plasma-fx'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(255,170,0,0.4)]'
                : 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{renderMode === 'plasma-fx' ? 'Plasma Mode' : 'Seedance Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Viewport Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#05070e] shadow-2xl select-none cursor-grab active:cursor-grabbing ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : ''
        }`}
      >
        <canvas ref={canvasRef} className="block w-full h-auto pointer-events-none" />

        {/* Viewport HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
          {/* Top HUD Row */}
          <div className="flex justify-between items-start">
            <div className="pointer-events-auto bg-black/80 border border-cyan-500/40 rounded-xl p-3 backdrop-blur-md space-y-1 text-xs">
              <span className="text-[10px] text-cyan-400 font-bold uppercase block">
                CLIP #{activeClip.clipNumber} // {activeClip.timecode}
              </span>
              <span className="text-white font-bold block">{activeClip.sceneAction.slice(0, 45)}...</span>
              <span className="text-slate-400 text-[10px] block">
                Trajectory: <strong className="text-cyan-300">{activeClip.cameraTrajectory}</strong>
              </span>
            </div>

            <div className="pointer-events-auto flex items-center gap-1.5 bg-black/80 p-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
              <button
                onClick={onTogglePlay}
                className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all text-xs font-bold flex items-center gap-1"
              >
                {playerState.isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{playerState.isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={handleSnapshot}
                className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-all"
                title="Capture Frame Snapshot"
              >
                {snapshotTaken ? <Check className="w-4 h-4 text-emerald-400" /> : <Camera className="w-4 h-4" />}
              </button>

              <button
                onClick={handleToggleFullscreen}
                className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-all"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Bottom Prompt HUD Row */}
          <div className="pointer-events-auto bg-black/85 border border-purple-500/40 rounded-xl p-3 backdrop-blur-md space-y-1 text-xs">
            <span className="text-[10px] text-purple-300 font-bold uppercase block flex items-center gap-1">
              <Terminal className="w-3 h-3 text-purple-400" />
              Active Seedance 2.5 C Dance Diffusion Prompt:
            </span>
            <p className="text-purple-100 text-[11px] leading-relaxed font-mono truncate">
              {activeClip.seedance25Prompt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
