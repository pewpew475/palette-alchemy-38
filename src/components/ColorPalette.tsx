import React, { useState, useCallback } from 'react';
import { RefreshCw, Download, Share2, Copy, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColorSwatch } from './ColorSwatch';
import { useToast } from '@/hooks/use-toast';

interface ColorInfo {
  color: string;
  locked: boolean;
}

export const ColorPalette: React.FC = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const [palette, setPalette] = useState<ColorInfo[]>([
    { color: '#8B5CF6', locked: false }, // Purple
    { color: '#EC4899', locked: false }, // Pink  
    { color: '#06B6D4', locked: false }, // Cyan
    { color: '#10B981', locked: false }, // Emerald
    { color: '#F59E0B', locked: false }, // Amber
  ]);

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const generatePalette = useCallback(() => {
    setIsGenerating(true);
    
    // Simulate generation delay for better UX
    setTimeout(() => {
      setPalette(prev => 
        prev.map(colorInfo => 
          colorInfo.locked 
            ? colorInfo 
            : { ...colorInfo, color: generateRandomColor() }
        )
      );
      setIsGenerating(false);
    }, 300);
  }, []);

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
    // Create a simple text export for now
    const exportData = {
      colors: palette.map(p => p.color),
      created: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'color-palette.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      description: 'Palette exported successfully',
      duration: 2000,
    });
  }, [palette, toast]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Button
          onClick={generatePalette}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {palette.map((colorInfo, index) => (
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
          Click the lock icon to keep a color while generating new ones. 
          Click on any color or code to copy it instantly.
        </p>
      </div>
    </div>
  );
};