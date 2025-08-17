import React from 'react';
import { ColorPalette } from '@/components/ColorPalette';
import heroBackground from '@/assets/hero-background.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/60 to-background"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center space-y-12">
          {/* Hero Text */}
          <div className="space-y-6 animate-float-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-card text-sm font-medium text-muted-foreground">
              <div className="w-2 h-2 bg-gradient-primary rounded-full animate-pulse"></div>
              Professional Color Palette Generator
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              Create Beautiful{' '}
              <span className="gradient-text">Color Palettes</span>{' '}
              <br />Instantly
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Generate, customize, and export modern color schemes for your next project. 
              Perfect for designers, developers, and creative professionals.
            </p>
          </div>

          {/* Color Palette Generator */}
          <div className="animate-float-up" style={{ animationDelay: '200ms' }}>
            <ColorPalette />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Everything you need to work with{' '}
              <span className="gradient-text">colors</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional tools and features designed to streamline your color workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 text-center space-y-4 hover-glass">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold">Smart Generation</h3>
              <p className="text-muted-foreground">
                AI-powered color combinations that work perfectly together. Lock colors you love and generate the rest.
              </p>
            </div>

            <div className="glass-card p-8 text-center space-y-4 hover-glass">
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold">Instant Export</h3>
              <p className="text-muted-foreground">
                Copy hex, RGB, HSL codes instantly. Export palettes in multiple formats for any project.
              </p>
            </div>

            <div className="glass-card p-8 text-center space-y-4 hover-glass">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold">Easy Sharing</h3>
              <p className="text-muted-foreground">
                Share your palettes with unique URLs. Perfect for team collaboration and client feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-bold">ColorCraft</span>
          </div>
          <p className="text-muted-foreground">
            Made with ❤️ for designers and developers worldwide
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
