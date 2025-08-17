import React from 'react';
import { Settings, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ColorHarmony, ColorTheme, getThemeInfo, getHarmonyInfo } from '@/utils/colorGeneration';

interface PaletteSettingsProps {
  colorCount: number;
  harmony: ColorHarmony;
  theme: ColorTheme;
  onColorCountChange: (count: number) => void;
  onHarmonyChange: (harmony: ColorHarmony) => void;
  onThemeChange: (theme: ColorTheme) => void;
}

export const PaletteSettings: React.FC<PaletteSettingsProps> = ({
  colorCount,
  harmony,
  theme,
  onColorCountChange,
  onHarmonyChange,
  onThemeChange,
}) => {
  const harmonies: ColorHarmony[] = [
    'random',
    'analogous', 
    'complementary',
    'triadic',
    'tetradic',
    'monochrome',
    'split-complementary'
  ];

  const themes: ColorTheme[] = [
    'vibrant',
    'pastel',
    'vintage',
    'earthy',
    'neon',
    'minimal',
    'warm',
    'cool',
    'dark',
    'light'
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="glass-card border-glass-border hover:bg-glass text-foreground"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="glass-card border-glass-border backdrop-blur-xl w-80" align="center">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Palette Settings</h3>
          </div>

          {/* Color Count */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Colors: {colorCount}
            </Label>
            <Slider
              value={[colorCount]}
              onValueChange={(value) => onColorCountChange(value[0])}
              max={10}
              min={3}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>3</span>
              <span>10</span>
            </div>
          </div>

          {/* Color Harmony */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Color Harmony</Label>
            <Select value={harmony} onValueChange={(value: ColorHarmony) => onHarmonyChange(value)}>
              <SelectTrigger className="glass-card border-glass-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-glass-border backdrop-blur-xl">
                {harmonies.map((h) => {
                  const info = getHarmonyInfo(h);
                  return (
                    <SelectItem key={h} value={h} className="hover:bg-accent">
                      <div className="flex flex-col">
                        <span className="font-medium">{info.name}</span>
                        <span className="text-xs text-muted-foreground">{info.description}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Color Theme */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Color Theme</Label>
            <Select value={theme} onValueChange={(value: ColorTheme) => onThemeChange(value)}>
              <SelectTrigger className="glass-card border-glass-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-glass-border backdrop-blur-xl">
                {themes.map((t) => {
                  const info = getThemeInfo(t);
                  return (
                    <SelectItem key={t} value={t} className="hover:bg-accent">
                      <div className="flex items-center gap-2">
                        <span>{info.emoji}</span>
                        <div className="flex flex-col">
                          <span className="font-medium">{info.name}</span>
                          <span className="text-xs text-muted-foreground">{info.description}</span>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Current Settings Display */}
          <div className="pt-3 border-t border-border">
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Current:</span>
                <span className="font-medium text-foreground">
                  {colorCount} colors • {getHarmonyInfo(harmony).name} • {getThemeInfo(theme).emoji} {getThemeInfo(theme).name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};