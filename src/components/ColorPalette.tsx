import React, { useState, useCallback } from 'react';
import { RefreshCw, Download, Share2, Copy, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColorSwatch } from './ColorSwatch';
import { PaletteSettings } from './PaletteSettings';
import { useToast } from '@/hooks/use-toast';
import { 
  generatePalette, 
  ColorHarmony, 
  ColorTheme,
  generateRandomColor 
} from '@/utils/colorGeneration';

interface ColorInfo {
  color: string;
  locked: boolean;
}

export const ColorPalette: React.FC = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Palette configuration
  const [colorCount, setColorCount] = useState(5);
  const [harmony, setHarmony] = useState<ColorHarmony>('random');
  const [theme, setTheme] = useState<ColorTheme>('vibrant');

  // Initialize palette with better default colors
  const [palette, setPalette] = useState<ColorInfo[]>([
    { color: '#8B5CF6', locked: false }, // Purple
    { color: '#EC4899', locked: false }, // Pink  
    { color: '#06B6D4', locked: false }, // Cyan
    { color: '#10B981', locked: false }, // Emerald
    { color: '#F59E0B', locked: false }, // Amber
  ]);

  // Update palette size when colorCount changes
  React.useEffect(() => {
    setPalette(prev => {
      const newPalette = [...prev];
      
      // If we need more colors, add them
      while (newPalette.length < colorCount) {
        newPalette.push({ 
          color: generateRandomColor(theme), 
          locked: false 
        });
      }
      
      // If we need fewer colors, remove from the end (but keep locked colors)
      if (newPalette.length > colorCount) {
        const lockedIndices = new Set(
          newPalette.map((_, index) => index)
            .filter(index => newPalette[index].locked && index < colorCount)
        );
        
        // Keep first colorCount items, prioritizing locked colors
        const finalPalette: ColorInfo[] = [];
        let keptLocked = 0;
        
        // First, add all locked colors that fit within the new count
        for (let i = 0; i < newPalette.length && finalPalette.length < colorCount; i++) {
          if (newPalette[i].locked && keptLocked < colorCount) {
            finalPalette.push(newPalette[i]);
            keptLocked++;
          }
        }
        
        // Then fill remaining slots with unlocked colors
        for (let i = 0; i < newPalette.length && finalPalette.length < colorCount; i++) {
          if (!newPalette[i].locked) {
            finalPalette.push(newPalette[i]);
          }
        }
        
        // If we still don't have enough, generate new ones
        while (finalPalette.length < colorCount) {
          finalPalette.push({ 
            color: generateRandomColor(theme), 
            locked: false 
          });
        }
        
        return finalPalette.slice(0, colorCount);
      }
      
      return newPalette.slice(0, colorCount);
    });
  }, [colorCount, theme]);

  const generateNewPalette = useCallback(() => {
    setIsGenerating(true);
    
    // Simulate generation delay for better UX
    setTimeout(() => {
      // Get locked colors with their indices
      const lockedColors = palette
        .map((colorInfo, index) => ({ index, color: colorInfo.color, locked: colorInfo.locked }))
        .filter(item => item.locked);

      // Generate new palette using advanced algorithm
      const newColors = generatePalette(colorCount, harmony, theme, lockedColors);
      
      // Update palette maintaining lock states
      setPalette(prev => 
        newColors.map((color, index) => ({
          color,
          locked: index < prev.length ? prev[index].locked : false
        }))
      );
      
      setIsGenerating(false);
    }, 300);
  }, [palette, colorCount, harmony, theme]);

  const toggleLock = useCallback((index: number) => {
    setPalette(prev => 
      prev.map((colorInfo, i) => 
        i === index 
          ? { ...colorInfo, locked: !colorInfo.locked }
          : colorInfo
      )
    );
  }, []);

  const copyAllColors = useCallback(async () => {
    const colors = palette.map(p => p.color).join(', ');
    try {
      await navigator.clipboard.writeText(colors);
      toast({
        description: 'All colors copied to clipboard',
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy colors: ', err);
    }
  }, [palette, toast]);

  const sharePalette = useCallback(() => {
    const colors = palette.map(p => p.color.replace('#', '')).join('-');
    const url = `${window.location.origin}/?colors=${colors}`;
    navigator.clipboard.writeText(url);
    toast({
      description: 'Palette link copied to clipboard',
      duration: 2000,
    });
  }, [palette, toast]);

  const exportPalette = useCallback(() => {
    // Create a comprehensive export with metadata
    const exportData = {
      colors: palette.map(p => p.color),
      settings: {
        count: colorCount,
        harmony,
        theme
      },
      metadata: {
        created: new Date().toISOString(),
        generator: 'ColorCraft'
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `color-palette-${harmony}-${theme}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      description: 'Palette exported successfully',
      duration: 2000,
    });
  }, [palette, colorCount, harmony, theme, toast]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Button
          onClick={generateNewPalette}
          disabled={isGenerating}
          className="bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity duration-300 px-8 py-6 text-lg font-semibold rounded-[var(--radius)] shadow-glass"
        >
          {isGenerating ? (
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Palette className="w-5 h-5 mr-2" />
          )}
          {isGenerating ? 'Generating...' : 'Generate Palette'}
        </Button>

        <div className="flex gap-2">
          <PaletteSettings
            colorCount={colorCount}
            harmony={harmony}
            theme={theme}
            onColorCountChange={setColorCount}
            onHarmonyChange={setHarmony}
            onThemeChange={setTheme}
          />
          
          <Button
            variant="outline"
            onClick={copyAllColors}
            className="glass-card border-glass-border hover:bg-glass text-foreground"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy All
          </Button>
          
          <Button
            variant="outline"
            onClick={sharePalette}
            className="glass-card border-glass-border hover:bg-glass text-foreground"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          
          <Button
            variant="outline"
            onClick={exportPalette}
            className="glass-card border-glass-border hover:bg-glass text-foreground"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Color Swatches */}
      <div className={`grid gap-6 ${
        colorCount <= 3 ? 'grid-cols-1 sm:grid-cols-3' :
        colorCount <= 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
        colorCount <= 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5' :
        colorCount <= 6 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
        colorCount <= 8 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
      }`}>
        {palette.slice(0, colorCount).map((colorInfo, index) => (
          <div key={index} className="animate-float-up" style={{ animationDelay: `${index * 100}ms` }}>
            <ColorSwatch
              color={colorInfo.color}
              isLocked={colorInfo.locked}
              onToggleLock={() => toggleLock(index)}
            />
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="glass-card p-6 text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">💡 Pro Tips</h3>
        <p className="text-muted-foreground">
          Use the settings to adjust palette size (3-10 colors), choose color harmonies, and select themes. 
          Lock colors you love and generate new combinations around them.
        </p>
      </div>
    </div>
  );
};