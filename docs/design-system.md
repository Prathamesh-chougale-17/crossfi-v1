# Design System Documentation

## Overview

Jeu Plaza features a comprehensive design system built with modern CSS architecture, OKLCH color space, and Tailwind CSS 4 integration. The system provides consistent theming, typography, and visual effects across the entire platform. The design emphasizes a retro gaming aesthetic with modern polish, using DotGothic16 as the primary font and sophisticated color management through OKLCH color space.

## CSS Architecture

### Custom Properties Structure

The design system is built on CSS custom properties organized into logical categories:

```css
:root {
  /* Color System - OKLCH Color Space */
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --accent: oklch(0.967 0.001 286.375);
  --accent-foreground: oklch(0.21 0.006 285.885);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.705 0.015 286.067);
  
  /* Chart Colors */
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  
  /* Sidebar Colors */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.141 0.005 285.823);
  --sidebar-primary: oklch(0.21 0.006 285.885);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.967 0.001 286.375);
  --sidebar-accent-foreground: oklch(0.21 0.006 285.885);
  --sidebar-border: oklch(0.92 0.004 286.32);
  --sidebar-ring: oklch(0.705 0.015 286.067);
  
  /* Layout & Spacing */
  --radius: 0.625rem;
}
```

### Dark Mode Overrides

Dark mode is implemented through CSS custom property overrides:

```css
.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.21 0.006 285.885);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.21 0.006 285.885);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.92 0.004 286.32);
  --primary-foreground: oklch(0.21 0.006 285.885);
  --secondary: oklch(0.274 0.006 286.033);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.274 0.006 286.033);
  --muted-foreground: oklch(0.705 0.015 286.067);
  --accent: oklch(0.274 0.006 286.033);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.552 0.016 285.938);
  
  /* Chart Colors */
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  
  /* Sidebar Colors */
  --sidebar: oklch(0.21 0.006 285.885);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.274 0.006 286.033);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.552 0.016 285.938);
}
```

## Color System

### OKLCH Color Space

The design system uses OKLCH (Oklch Lightness Chroma Hue) color space for superior color management:

#### Benefits
- **Perceptual Uniformity**: Colors appear more consistent to human vision
- **Better Gradients**: Smoother color transitions without muddy intermediate colors
- **Accessibility**: More predictable contrast ratios across color variations
- **Future-Proof**: Modern color space with wide gamut support

#### Color Categories

**Semantic Colors**
- `--background`: Main background color
- `--foreground`: Primary text color
- `--primary`: Brand primary color (orange-red)
- `--secondary`: Brand secondary color (lime green)
- `--accent`: Accent color (purple-blue)

**UI Component Colors**
- `--card`: Card background color
- `--popover`: Popover background color
- `--muted`: Muted background and text colors
- `--destructive`: Error/danger color
- `--border`: Border color
- `--input`: Input field background
- `--ring`: Focus ring color

**Chart Colors**
- `--chart-1` through `--chart-5`: Data visualization color palette

**Sidebar Colors**
- Dedicated color tokens for sidebar components with proper contrast

### Color Usage Examples

```tsx
// Using semantic colors
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Primary Action
  </button>
  <button className="bg-secondary text-secondary-foreground">
    Secondary Action
  </button>
</div>

// Using UI component colors
<div className="bg-card border border-border rounded-lg">
  <input className="bg-input border-input" />
</div>
```

## Typography System

### Font Stack

The typography system uses a hybrid approach with multiple carefully selected fonts:

**Primary Display Font**
- **Font**: DotGothic16
- **Usage**: Applied to body element for retro gaming aesthetic
- **Weight**: 400 (single weight)
- **Configuration**: `--font-dot-gothic` CSS variable

**Sans-serif (UI Elements)**
- **Font**: Geist
- **Usage**: Modern UI components, clean interface elements
- **Configuration**: `--font-geist-sans` CSS variable mapped to `--font-sans`
- **Fallbacks**: ui-sans-serif, sans-serif, system-ui

**Monospace (Code)**
- **Font**: Geist Mono
- **Usage**: Code display, technical content, canvas forge editor
- **Configuration**: `--font-geist-mono` CSS variable mapped to `--font-mono`
- **Fallbacks**: Courier, monospace

**Font Loading Strategy**
```tsx
// Font configuration in app/layout.tsx
const dotGot = DotGothic16({
  variable: "--font-dot-gothic",
  subsets: ["latin"],
  weight: "400",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

### Typography Usage

```tsx
// Font family classes
<h1 className="font-sans">Sans-serif heading</h1>
<h2 className="font-serif">Serif heading</h2>
<code className="font-mono">Monospace code</code>

// Typography scale (Tailwind classes)
<h1 className="text-6xl font-bold">Hero title</h1>
<h2 className="text-3xl font-semibold">Section title</h2>
<p className="text-base">Body text</p>
<span className="text-sm text-muted-foreground">Caption</span>

// Letter spacing classes
<p className="tracking-tighter">Tighter spacing</p>
<p className="tracking-tight">Tight spacing</p>
<p className="tracking-normal">Normal spacing (0.5px)</p>
<p className="tracking-wide">Wide spacing</p>
<p className="tracking-wider">Wider spacing</p>
<p className="tracking-widest">Widest spacing</p>
```

### Letter Spacing System

The design system includes a comprehensive letter-spacing (tracking) system:

```css
/* Base tracking value */
--tracking-normal: 0.5px;

/* Calculated tracking variants */
--tracking-tighter: calc(var(--tracking-normal) - 0.05em);  /* 0.45px equivalent */
--tracking-tight: calc(var(--tracking-normal) - 0.025em);   /* 0.475px equivalent */
--tracking-normal: var(--tracking-normal);                  /* 0.5px */
--tracking-wide: calc(var(--tracking-normal) + 0.025em);    /* 0.525px equivalent */
--tracking-wider: calc(var(--tracking-normal) + 0.05em);    /* 0.55px equivalent */
--tracking-widest: calc(var(--tracking-normal) + 0.1em);    /* 0.6px equivalent */
```

**Usage Guidelines:**
- **Normal (0.5px)**: Default for body text and most UI elements
- **Tighter/Tight**: For dense content or small text where space is limited
- **Wide/Wider/Widest**: For headings, logos, or decorative text that needs more breathing room

**Global Application:**
```css
body {
  letter-spacing: var(--tracking-normal);
}
```

All text elements inherit the base 0.5px letter spacing, providing consistent typography throughout the application.

## Shadow System

### Shadow Design Philosophy

The shadow system uses a subtle 1px offset with low-opacity black shadows for a refined, modern aesthetic:

```css
/* Shadow scale from subtle to dramatic */
--shadow-2xs: 1px 4px 5px 0px hsl(0 0% 0% / 0.01);  /* Very subtle */
--shadow-xs: 1px 4px 5px 0px hsl(0 0% 0% / 0.01);   /* Subtle */
--shadow-sm: 1px 4px 5px 0px hsl(0 0% 0% / 0.03), 1px 1px 2px -1px hsl(0 0% 0% / 0.03);
--shadow: 1px 4px 5px 0px hsl(0 0% 0% / 0.03), 1px 1px 2px -1px hsl(0 0% 0% / 0.03);
--shadow-md: 1px 4px 5px 0px hsl(0 0% 0% / 0.03), 1px 2px 4px -1px hsl(0 0% 0% / 0.03);
--shadow-lg: 1px 4px 5px 0px hsl(0 0% 0% / 0.03), 1px 4px 6px -1px hsl(0 0% 0% / 0.03);
--shadow-xl: 1px 4px 5px 0px hsl(0 0% 0% / 0.03), 1px 8px 10px -1px hsl(0 0% 0% / 0.03);
--shadow-2xl: 1px 4px 5px 0px hsl(0 0% 0% / 0.07);  /* More prominent */
```

### Shadow Usage

```tsx
// Shadow classes
<div className="shadow-sm">Subtle shadow</div>
<div className="shadow-lg">Prominent shadow</div>
<div className="shadow-xl hover:shadow-2xl transition-shadow">
  Interactive shadow
</div>
```

## Layout & Spacing

### Border Radius

The design system uses rounded corners (0.625rem radius) for a modern, friendly aesthetic:

```css
--radius: 0.625rem;
```

This creates a contemporary look with subtle rounded edges throughout the interface. The radius scales appropriately:
- `--radius-sm`: calc(var(--radius) - 4px) = 0.375rem
- `--radius-md`: calc(var(--radius) - 2px) = 0.5rem  
- `--radius-lg`: var(--radius) = 0.625rem
- `--radius-xl`: calc(var(--radius) + 4px) = 0.875rem

### Spacing System

Consistent spacing is maintained through Tailwind's spacing scale:

```tsx
// Spacing examples
<div className="p-4">Padding 1rem</div>
<div className="m-8">Margin 2rem</div>
<div className="space-y-4">Vertical spacing between children</div>
<div className="gap-6">Grid/flex gap</div>
```

## Animation System

### Transition Timing

Consistent timing creates a cohesive feel:

```css
/* Standard transition duration */
transition-all duration-300

/* Longer transitions for complex animations */
transition-all duration-500

/* Quick feedback transitions */
transition-colors duration-200
```

### Common Animation Patterns

**Hover Effects**
```tsx
<button className="transform hover:scale-105 transition-all duration-300">
  Scale on hover
</button>

<div className="hover:shadow-xl transition-shadow duration-300">
  Shadow on hover
</div>
```

**Loading States**
```tsx
<div className="animate-pulse">Loading content</div>
<div className="animate-spin">Loading spinner</div>
```

**Entrance Animations**
```tsx
<div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
  Fade and slide in
</div>

<div className="animate-in fade-in duration-1000 delay-200">
  Staggered entrance
</div>
```

## Tailwind CSS Integration

### Theme Configuration

The design system integrates with Tailwind CSS through the `@theme inline` directive:

```css
@theme inline {
  /* Color tokens */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-accent: var(--accent);
  
  /* Typography tokens */
  --font-sans: var(--font-sans);
  --font-serif: var(--font-serif);
  --font-mono: var(--font-mono);
  
  /* Shadow tokens */
  --shadow-sm: var(--shadow-sm);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  
  /* Layout tokens */
  --radius-lg: var(--radius);
}
```

### Custom Utilities

Additional utilities can be added for design system consistency:

```css
@layer utilities {
  .glass-morphism {
    @apply bg-card/50 backdrop-blur-sm border border-border/50;
  }
  
  .gradient-text {
    @apply bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent;
  }
  
  .modern-card {
    @apply bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300;
  }
}
```

## Component Patterns

### Glass Morphism Cards

```tsx
<div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
  <h3 className="text-xl font-bold mb-4">Card Title</h3>
  <p className="text-muted-foreground">Card content</p>
</div>
```

### Enhanced Game Cards (Games Library Pattern)

```tsx
<Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50">
  {/* Card Background Effect */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
  
  {/* Status Badges */}
  <div className="absolute top-4 left-4 z-10 flex gap-2">
    <Badge className="bg-green-500/90 text-white border-green-400/50 shadow-lg">
      <Sparkles className="h-3 w-3 mr-1" />
      New
    </Badge>
    <Badge className="bg-purple-500/90 text-white border-purple-400/50 shadow-lg">
      <Star className="h-3 w-3 mr-1" />
      Featured
    </Badge>
  </div>

  <CardHeader className="relative z-10">
    {/* Game Image with Play Overlay */}
    <div className="relative mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 aspect-video">
      <Image src={game.image} alt={game.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      
      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-primary/90 backdrop-blur-sm rounded-full p-4 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
          <Play className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>

    {/* Game Metadata */}
    <div className="flex items-start justify-between">
      <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
        {game.name}
      </CardTitle>
      <div className="flex items-center gap-1 text-yellow-500">
        <Star className="h-4 w-4 fill-current" />
        <span className="text-sm font-medium">{game.rating}</span>
      </div>
    </div>
  </CardHeader>

  <CardContent>
    {/* Feature Badges */}
    <div className="flex flex-wrap gap-2">
      {game.features.map((feature) => (
        <Badge key={feature} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
          {feature}
        </Badge>
      ))}
    </div>
  </CardContent>
</Card>
```

### Streamlined Hero Sections

```tsx
<div className="text-center mb-8">
  <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
    Games
  </h1>
  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
    Play exciting games built for entertainment and fun.
  </p>
</div>
```

### Statistics Dashboard Cards

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
  <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
    <div className="flex items-center justify-center gap-3 mb-2">
      <Play className="h-5 w-5 text-green-500" />
      <span className="text-2xl font-bold text-green-500">{count}</span>
    </div>
    <div className="text-sm text-muted-foreground font-medium">Available Games</div>
  </div>
</div>
```

### Gradient Backgrounds

```tsx
<div className="bg-gradient-to-br from-primary/10 via-transparent to-accent/10">
  <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 rounded-lg">
    Gradient button
  </div>
</div>
```

### Status Indicators

```tsx
<div className="flex items-center gap-2">
  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
  <span className="text-green-600 font-medium">Active</span>
</div>
```

## Best Practices

### Color Usage
- Use semantic color tokens (`--primary`, `--accent`) instead of hardcoded colors
- Maintain proper contrast ratios for accessibility
- Test colors in both light and dark modes

### Typography
- Use the font stack consistently across components
- Maintain proper text hierarchy with size and weight
- Ensure readability across all device sizes

### Shadows
- Use shadows consistently to establish visual hierarchy
- Apply hover effects for interactive elements
- Don't overuse dramatic shadows

### Animation
- Keep transitions smooth and purposeful
- Use consistent timing across similar interactions
- Provide reduced motion alternatives for accessibility

### Responsive Design
- Design mobile-first, enhance for larger screens
- Use responsive spacing and typography scales
- Test across different device sizes and orientations

## Accessibility Considerations

### Color Contrast
- All color combinations meet WCAG AA standards
- High contrast mode support through CSS custom properties
- Color is not the only way to convey information

### Typography
- Readable font sizes (minimum 16px for body text)
- Sufficient line height for readability
- Proper heading hierarchy

### Interactive Elements
- Clear focus states with visible focus rings
- Adequate touch target sizes (minimum 44px)
- Hover and focus states for all interactive elements

### Motion
- Respect `prefers-reduced-motion` user preference
- Provide alternatives to motion-based interactions
- Keep animations purposeful and not distracting

## Development Workflow

### Adding New Colors
1. Define the color in OKLCH format in `:root`
2. Add dark mode override in `.dark` if needed
3. Add to Tailwind theme configuration
4. Document the color's purpose and usage

### Creating New Components
1. Use existing design tokens from the system
2. Follow established patterns for shadows, spacing, and typography
3. Ensure responsive behavior
4. Test in both light and dark modes

### Maintaining Consistency
- Regular design system audits
- Component library documentation
- Design token usage guidelines
- Cross-browser testing

This design system provides a solid foundation for building consistent, accessible, and visually appealing interfaces across the Jeu Plaza platform.