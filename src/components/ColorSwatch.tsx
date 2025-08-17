import React, { useState } from 'react';
import { Copy, Lock, Unlock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ColorSwatchProps {
  color: string;
  isLocked: boolean;
  onToggleLock: () => void;
  className?: string;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  isLocked,
  onToggleLock,
  className = ""
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        description: `Copied ${text} to clipboard`,
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgb = hexToRgb(color);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  // Determine if text should be light or dark based on color brightness
  const isLight = rgb ? (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) > 128 : false;

  return (
    <div className={`glass-card p-4 space-y-4 group hover-glass ${className}`}>
      {/* Color Display */}
      <div 
        className="color-swatch relative"
        style={{ backgroundColor: color }}
        onClick={() => copyToClipboard(color)}
      >
        {/* Lock/Unlock Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isLight ? 'text-foreground hover:bg-background/20' : 'text-background hover:bg-foreground/20'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock();
          }}
        >
          {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
        </Button>

        {/* Copy Indicator */}
        {copied && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`glass-card px-3 py-2 flex items-center gap-2 ${
              isLight ? 'text-foreground' : 'text-background'
            }`}>
              <Check size={16} />
              <span className="text-sm font-medium">Copied!</span>
            </div>
          </div>
        )}
      </div>

      {/* Color Information */}
      <div className="space-y-3 text-sm">
        {/* HEX */}
        <div 
          className="flex items-center justify-between p-2 rounded-lg bg-surface cursor-pointer hover:bg-accent transition-colors duration-200"
          onClick={() => copyToClipboard(color)}
        >
          <span className="font-medium text-muted-foreground">HEX</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-foreground">{color.toUpperCase()}</span>
            <Copy size={14} className="text-muted-foreground" />
          </div>
        </div>

        {/* RGB */}
        {rgb && (
          <div 
            className="flex items-center justify-between p-2 rounded-lg bg-surface cursor-pointer hover:bg-accent transition-colors duration-200"
            onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
          >
            <span className="font-medium text-muted-foreground">RGB</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-foreground">{rgb.r}, {rgb.g}, {rgb.b}</span>
              <Copy size={14} className="text-muted-foreground" />
            </div>
          </div>
        )}

        {/* HSL */}
        {hsl && (
          <div 
            className="flex items-center justify-between p-2 rounded-lg bg-surface cursor-pointer hover:bg-accent transition-colors duration-200"
            onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
          >
            <span className="font-medium text-muted-foreground">HSL</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-foreground">{hsl.h}°, {hsl.s}%, {hsl.l}%</span>
              <Copy size={14} className="text-muted-foreground" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};