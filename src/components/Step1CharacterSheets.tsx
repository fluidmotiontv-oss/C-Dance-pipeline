import React, { useState } from 'react';
import {
  UserCheck,
  Tag,
  Sparkles,
  Camera,
  Layers,
  Copy,
  Check,
  Plus,
  Trash2,
  Wand2,
  RefreshCw,
  Eye,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { CharacterSheet, TurnaroundAngle } from '../types';

interface Step1CharacterSheetsProps {
  characters: CharacterSheet[];
  activeCharacter: CharacterSheet;
  onSelectCharacter: (char: CharacterSheet) => void;
  onUpdateCharacterTags: (charId: string, tags: string[]) => void;
  onAddCharacterTag: (charId: string, tag: string) => void;
}

export const Step1CharacterSheets: React.FC<Step1CharacterSheetsProps> = ({
  characters,
  activeCharacter,
  onSelectCharacter,
  onUpdateCharacterTags,
  onAddCharacterTag,
}) => {
  const [selectedAngle, setSelectedAngle] = useState<TurnaroundAngle>('three-quarter');
  const [newTagInput, setNewTagInput] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [generatedPromptResult, setGeneratedPromptResult] = useState<string | null>(null);

  const angles: { id: TurnaroundAngle; label: string; degrees: string }[] = [
    { id: 'front', label: 'Front View', degrees: '0° Frontal' },
    { id: 'side', label: 'Side Profile', degrees: '90° Profile' },
    { id: 'three-quarter', label: '3/4 Hero Angle', degrees: '45° Dynamic' },
    { id: 'back', label: 'Dorsal View', degrees: '180° Rear' }
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const cleanTag = newTagInput.trim().toUpperCase().replace(/\s+/g, '_');
    onAddCharacterTag(activeCharacter.id, cleanTag);
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = activeCharacter.referenceTags.filter((t) => t !== tagToRemove);
    onUpdateCharacterTags(activeCharacter.id, updated);
  };

  const handleGenerateAiSheet = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/generate-character-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterName: activeCharacter.name,
          role: activeCharacter.role,
          description: activeCharacter.description
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedPromptResult(data.data.promptTemplate || data.data.styleAnchor);
      }
    } catch (err) {
      console.error('Failed to generate sheet:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-mono">
      {/* Step Header Banner */}
      <div className="p-6 rounded-2xl glass-panel-glow border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider">
              Step 1: Asset Preparation & Character Sheets
            </h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Lock character designs with 360° turnaround model sheets (Front, Side, 3/4, Back) and collect up to 30 reference tags per character to prevent identity and style drift in Seedance 2.5 C Dance cuts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            30 REF TAGS MAX / CHAR
          </span>
        </div>
      </div>

      {/* Main Character Selector Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {characters.map((char) => {
          const isSelected = activeCharacter.id === char.id;
          return (
            <div
              key={char.id}
              onClick={() => onSelectCharacter(char)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_20px_rgba(0,243,255,0.2)] text-white'
                  : 'bg-[#080d1a]/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {char.codeName}
                  </span>
                  <span className="text-[10px] text-slate-400">{char.referenceTags.length} / 30 Tags</span>
                </div>
                <h3 className="font-display text-base font-bold text-white mb-1">{char.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{char.tagline}</p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Design Locked</span>
                </span>
                <span className="text-slate-500">{char.role.toUpperCase()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Character Turnaround Angles & Reference Tagging Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 360° Turnaround Model Sheet Angles (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-6 rounded-2xl glass-panel-glow border border-cyan-500/30 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                  CHARACTER TURNAROUND MODEL SHEET
                </span>
                <h3 className="font-display text-base font-bold text-white">
                  {activeCharacter.name} ({selectedAngle.toUpperCase()} ANGLE)
                </h3>
              </div>

              {/* Angle Switcher Tabs */}
              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-slate-800">
                {angles.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAngle(a.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedAngle === a.id
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {a.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Angle Description Box */}
            <div className="p-4 rounded-xl bg-black/80 border border-cyan-500/30 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>Turnaround Specification [{selectedAngle.toUpperCase()}]:</span>
                </span>
                <button
                  onClick={() => handleCopy(activeCharacter.turnaroundAngles[selectedAngle], 'angle-spec')}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === 'angle-spec' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'angle-spec' ? 'Copied' : 'Copy Angle Spec'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-mono">
                {activeCharacter.turnaroundAngles[selectedAngle]}
              </p>
            </div>

            {/* Visual Style Anchor & Prompt Engineering Template */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-purple-300 font-bold flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-purple-400" />
                  <span>Seedance 2.5 Prompt Engineering Template:</span>
                </span>
                <button
                  onClick={() => handleCopy(activeCharacter.promptEngineeringTemplate, 'prompt-template')}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === 'prompt-template' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'prompt-template' ? 'Copied' : 'Copy Template'}</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-black/80 border border-purple-500/30 text-xs text-purple-200 leading-relaxed font-mono select-all">
                {activeCharacter.promptEngineeringTemplate}
              </div>
            </div>

            {/* AI Generator Action */}
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[11px] text-slate-400">
                Generate AI character sheet prompt with Gemini API
              </span>
              <button
                onClick={handleGenerateAiSheet}
                disabled={isAiGenerating}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isAiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isAiGenerating ? 'Generating...' : 'Synthesize Sheet'}</span>
              </button>
            </div>

            {generatedPromptResult && (
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-xs text-emerald-200">
                <span className="font-bold text-emerald-400 block mb-1">Generated Character Model Prompt:</span>
                {generatedPromptResult}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Reference Tagging System (Collect up to 30 Tags per Char) (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-2xl glass-panel-glow border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-400" />
                <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Reference Tagging Matrix
                </h4>
              </div>
              <span className="text-xs text-slate-400 font-bold">
                {activeCharacter.referenceTags.length} / 30 Tags
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              In Seedance 2.5 C Dance, collecting up to 30 reference tags locks the character's geometry, jacket physics, and ocular sensors to prevent identity drift across scene transitions.
            </p>

            {/* Input to Add New Tag */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddTag(); }}
                placeholder="e.g. D9_GLOWING_VISOR..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-black/70 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:border-purple-500 focus:outline-none font-mono"
              />
              <button
                onClick={handleAddTag}
                disabled={activeCharacter.referenceTags.length >= 30 || !newTagInput.trim()}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tag</span>
              </button>
            </div>

            {/* Reference Tags Cloud */}
            <div className="flex flex-wrap gap-1.5 max-h-72 overflow-y-auto p-3 rounded-xl bg-black/60 border border-slate-800/80">
              {activeCharacter.referenceTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-[11px] text-purple-200 font-mono flex items-center gap-1.5 group"
                >
                  <span>#{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                    title="Remove Tag"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-slate-500">
              Tip: Tags are automatically formatted for C Dance multimodal reference indexing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
