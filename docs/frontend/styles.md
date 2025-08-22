# Sistema de Estilos - Frontend

[← Voltar ao Índice Principal](../README.md)

## Visão Geral

O sistema de estilos da aplicação **2ª Coríntios 9** utiliza **TailwindCSS** como framework principal, complementado por estilos customizados e um sistema de design consistente. Esta abordagem garante uma interface moderna, responsiva e de fácil manutenção.

## Tecnologias e Ferramentas

### TailwindCSS
- **Versão**: 3.x
- **Configuração**: Customizada para o projeto
- **Plugins**: Forms, Typography, Aspect Ratio
- **Purge**: Configurado para otimização de produção

### PostCSS
- **Autoprefixer**: Para compatibilidade entre navegadores
- **CSSnano**: Minificação para produção
- **Plugins customizados**: Para funcionalidades específicas

## Configuração do TailwindCSS

### tailwind.config.js

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/renderer/index.html',
    './src/renderer/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      // Cores customizadas
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f'
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d'
        },
        church: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87'
        }
      },
      
      // Fontes customizadas
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Fira Code', 'monospace']
      },
      
      // Espaçamentos customizados
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      
      // Breakpoints customizados
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      },
      
      // Animações customizadas
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
        'pulse-slow': 'pulse 3s infinite'
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceSoft: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-5px)' },
          '60%': { transform: 'translateY(-3px)' }
        }
      },
      
      // Sombras customizadas
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 25px -5px rgba(0, 0, 0, 0.1)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
      },
      
      // Bordas customizadas
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ]
}
```

### PostCSS Configuration

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  }
}
```

## Estrutura de Estilos

### Arquivos CSS Principais

```css
/* src/renderer/src/styles/globals.css */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Importações de fontes */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Reset e base styles */
@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground font-sans;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  
  html {
    @apply scroll-smooth;
  }
  
  /* Scrollbar customizada */
  ::-webkit-scrollbar {
    @apply w-2;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-gray-100;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded-full;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-400;
  }
  
  /* Seleção de texto */
  ::selection {
    @apply bg-primary-200 text-primary-900;
  }
  
  /* Focus styles */
  :focus {
    @apply outline-none;
  }
  
  :focus-visible {
    @apply ring-2 ring-primary-500 ring-offset-2;
  }
}

/* Componentes base */
@layer components {
  /* Botões */
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .btn-primary {
    @apply btn bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800;
  }
  
  .btn-secondary {
    @apply btn bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500 active:bg-secondary-300;
  }
  
  .btn-success {
    @apply btn bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 active:bg-success-800;
  }
  
  .btn-warning {
    @apply btn bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 active:bg-warning-800;
  }
  
  .btn-error {
    @apply btn bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 active:bg-error-800;
  }
  
  .btn-outline {
    @apply btn border-2 border-current bg-transparent hover:bg-current hover:text-white;
  }
  
  .btn-ghost {
    @apply btn bg-transparent hover:bg-gray-100 text-gray-700;
  }
  
  /* Inputs */
  .input {
    @apply block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200;
  }
  
  .input-error {
    @apply input border-error-500 focus:ring-error-500 focus:border-error-500;
  }
  
  .input-success {
    @apply input border-success-500 focus:ring-success-500 focus:border-success-500;
  }
  
  /* Cards */
  .card {
    @apply bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden;
  }
  
  .card-header {
    @apply px-6 py-4 border-b border-gray-100;
  }
  
  .card-body {
    @apply px-6 py-4;
  }
  
  .card-footer {
    @apply px-6 py-4 border-t border-gray-100 bg-gray-50;
  }
  
  /* Modals */
  .modal-overlay {
    @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
  }
  
  .modal-content {
    @apply bg-white rounded-xl shadow-strong max-w-md w-full max-h-screen overflow-y-auto;
  }
  
  /* Badges */
  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
  }
  
  .badge-primary {
    @apply badge bg-primary-100 text-primary-800;
  }
  
  .badge-success {
    @apply badge bg-success-100 text-success-800;
  }
  
  .badge-warning {
    @apply badge bg-warning-100 text-warning-800;
  }
  
  .badge-error {
    @apply badge bg-error-100 text-error-800;
  }
  
  /* Loading */
  .loading-spinner {
    @apply animate-spin rounded-full border-2 border-gray-300 border-t-primary-600;
  }
  
  /* Transitions */
  .transition-base {
    @apply transition-all duration-200 ease-in-out;
  }
  
  .transition-slow {
    @apply transition-all duration-300 ease-in-out;
  }
  
  .transition-fast {
    @apply transition-all duration-150 ease-in-out;
  }
}

/* Utilitários customizados */
@layer utilities {
  /* Gradientes */
  .gradient-primary {
    background: linear-gradient(135deg, theme('colors.primary.600'), theme('colors.primary.800'));
  }
  
  .gradient-success {
    background: linear-gradient(135deg, theme('colors.success.500'), theme('colors.success.700'));
  }
  
  .gradient-church {
    background: linear-gradient(135deg, theme('colors.church.500'), theme('colors.church.700'));
  }
  
  /* Glassmorphism */
  .glass {
    @apply bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-30;
  }
  
  /* Truncate text */
  .truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Aspect ratios */
  .aspect-card {
    @apply aspect-w-16 aspect-h-9;
  }
  
  /* Custom shadows */
  .shadow-colored {
    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05);
  }
}
```

### Estilos de Componentes Específicos

```css
/* src/renderer/src/styles/components.css */

/* Menu Principal */
.menu-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6;
}

.menu-item {
  @apply card hover:shadow-medium transition-all duration-300 cursor-pointer group;
}

.menu-item:hover {
  @apply transform -translate-y-1;
}

.menu-item-icon {
  @apply w-12 h-12 mx-auto mb-4 text-primary-600 group-hover:text-primary-700 transition-colors;
}

.menu-item-title {
  @apply text-lg font-semibold text-gray-900 mb-2 text-center;
}

.menu-item-description {
  @apply text-sm text-gray-600 text-center;
}

/* Formulários */
.form-container {
  @apply max-w-2xl mx-auto p-6;
}

.form-group {
  @apply mb-6;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.form-error {
  @apply mt-1 text-sm text-error-600;
}

.form-help {
  @apply mt-1 text-sm text-gray-500;
}

.form-actions {
  @apply flex justify-end space-x-3 pt-6 border-t border-gray-200;
}

/* Tabelas */
.table-container {
  @apply overflow-x-auto shadow-soft rounded-lg;
}

.table {
  @apply min-w-full divide-y divide-gray-200;
}

.table-header {
  @apply bg-gray-50;
}

.table-header-cell {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-body {
  @apply bg-white divide-y divide-gray-200;
}

.table-row {
  @apply hover:bg-gray-50 transition-colors;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900;
}

/* Relatórios */
.report-container {
  @apply max-w-4xl mx-auto p-6;
}

.report-header {
  @apply mb-8 text-center;
}

.report-title {
  @apply text-3xl font-bold text-gray-900 mb-2;
}

.report-subtitle {
  @apply text-lg text-gray-600;
}

.report-section {
  @apply mb-8;
}

.report-section-title {
  @apply text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2;
}

.report-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6;
}

.report-card {
  @apply card text-center;
}

.report-card-value {
  @apply text-2xl font-bold text-primary-600 mb-1;
}

.report-card-label {
  @apply text-sm text-gray-600;
}

/* Filtros */
.filter-container {
  @apply bg-gray-50 p-4 rounded-lg mb-6;
}

.filter-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-4;
}

.filter-group {
  @apply space-y-2;
}

.filter-label {
  @apply block text-sm font-medium text-gray-700;
}

/* Navegação */
.breadcrumb {
  @apply flex items-center space-x-2 text-sm text-gray-600 mb-4;
}

.breadcrumb-item {
  @apply hover:text-primary-600 transition-colors;
}

.breadcrumb-separator {
  @apply text-gray-400;
}

/* Estados vazios */
.empty-state {
  @apply text-center py-12;
}

.empty-state-icon {
  @apply w-16 h-16 mx-auto mb-4 text-gray-400;
}

.empty-state-title {
  @apply text-lg font-medium text-gray-900 mb-2;
}

.empty-state-description {
  @apply text-gray-600 mb-4;
}

/* Notificações */
.notification {
  @apply p-4 rounded-lg border-l-4;
}

.notification-success {
  @apply notification bg-success-50 border-success-500 text-success-800;
}

.notification-warning {
  @apply notification bg-warning-50 border-warning-500 text-warning-800;
}

.notification-error {
  @apply notification bg-error-50 border-error-500 text-error-800;
}

.notification-info {
  @apply notification bg-primary-50 border-primary-500 text-primary-800;
}
```

### Estilos Responsivos

```css
/* src/renderer/src/styles/responsive.css */

/* Mobile First Approach */
@layer utilities {
  /* Containers responsivos */
  .container-responsive {
    @apply w-full mx-auto px-4;
  }
  
  @screen sm {
    .container-responsive {
      @apply max-w-screen-sm px-6;
    }
  }
  
  @screen md {
    .container-responsive {
      @apply max-w-screen-md px-8;
    }
  }
  
  @screen lg {
    .container-responsive {
      @apply max-w-screen-lg px-12;
    }
  }
  
  @screen xl {
    .container-responsive {
      @apply max-w-screen-xl;
    }
  }
  
  /* Grid responsivo */
  .grid-responsive {
    @apply grid grid-cols-1;
  }
  
  @screen sm {
    .grid-responsive {
      @apply grid-cols-2;
    }
  }
  
  @screen md {
    .grid-responsive {
      @apply grid-cols-3;
    }
  }
  
  @screen lg {
    .grid-responsive {
      @apply grid-cols-4;
    }
  }
  
  /* Texto responsivo */
  .text-responsive-sm {
    @apply text-sm;
  }
  
  @screen md {
    .text-responsive-sm {
      @apply text-base;
    }
  }
  
  .text-responsive-lg {
    @apply text-lg;
  }
  
  @screen md {
    .text-responsive-lg {
      @apply text-xl;
    }
  }
  
  @screen lg {
    .text-responsive-lg {
      @apply text-2xl;
    }
  }
  
  /* Espaçamento responsivo */
  .spacing-responsive {
    @apply p-4;
  }
  
  @screen md {
    .spacing-responsive {
      @apply p-6;
    }
  }
  
  @screen lg {
    .spacing-responsive {
      @apply p-8;
    }
  }
}

/* Breakpoints específicos para componentes */
@media (max-width: 640px) {
  .menu-grid {
    @apply grid-cols-1 gap-3 p-4;
  }
  
  .form-actions {
    @apply flex-col space-x-0 space-y-3;
  }
  
  .table-container {
    @apply text-xs;
  }
  
  .modal-content {
    @apply mx-2;
  }
}

@media (max-width: 768px) {
  .report-grid {
    @apply grid-cols-2;
  }
  
  .filter-grid {
    @apply grid-cols-1 gap-3;
  }
}
```

## Sistema de Design Tokens

### Design Tokens em CSS

```css
/* src/renderer/src/styles/tokens.css */

:root {
  /* Cores */
  --color-primary: #3b82f6;
  --color-primary-dark: #1d4ed8;
  --color-primary-light: #93c5fd;
  
  --color-secondary: #64748b;
  --color-secondary-dark: #334155;
  --color-secondary-light: #cbd5e1;
  
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-border: #e2e8f0;
  
  /* Tipografia */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-family-mono: 'Fira Code', monospace;
  
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* Espaçamento */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Bordas */
  --border-radius-sm: 0.375rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 0.75rem;
  --border-radius-xl: 1rem;
  
  --border-width-thin: 1px;
  --border-width-medium: 2px;
  --border-width-thick: 4px;
  
  /* Sombras */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  
  /* Transições */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 200ms ease-in-out;
  --transition-slow: 300ms ease-in-out;
  
  /* Z-index */
  --z-dropdown: 1000;
  --z-modal: 1050;
  --z-tooltip: 1100;
  --z-notification: 1200;
}

/* Tema escuro */
[data-theme="dark"] {
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-border: #334155;
  
  --color-primary: #60a5fa;
  --color-primary-dark: #3b82f6;
  --color-primary-light: #93c5fd;
}
```

### Uso dos Tokens em Componentes

```typescript
// src/renderer/src/components/Button/Button.tsx
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary'
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

## Utilitários de Estilo

### Função de Combinação de Classes

```typescript
// src/renderer/src/utils/cn.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Hook para Tema

```typescript
// src/renderer/src/hooks/useTheme.ts
import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme
    return stored || 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = window.document.documentElement
    
    const applyTheme = (newTheme: 'light' | 'dark') => {
      root.classList.remove('light', 'dark')
      root.classList.add(newTheme)
      root.setAttribute('data-theme', newTheme)
      setResolvedTheme(newTheme)
    }

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      applyTheme(systemTheme)
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light')
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      applyTheme(theme)
    }
  }, [theme])

  const setThemeWithStorage = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }

  return {
    theme,
    resolvedTheme,
    setTheme: setThemeWithStorage
  }
}
```

## Animações e Transições

### Animações Customizadas

```css
/* src/renderer/src/styles/animations.css */

/* Fade animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale animations */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scaleOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
}

/* Slide animations */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Loading animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

/* Shake animation for errors */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

/* Utility classes */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-fade-out {
  animation: fadeOut 0.3s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out;
}

.animate-fade-in-down {
  animation: fadeInDown 0.4s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}

.animate-scale-out {
  animation: scaleOut 0.2s ease-out;
}

.animate-slide-in-left {
  animation: slideInLeft 0.3s ease-out;
}

.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* Hover effects */
.hover-lift {
  transition: transform 0.2s ease-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

.hover-scale {
  transition: transform 0.2s ease-out;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-glow {
  transition: box-shadow 0.2s ease-out;
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}
```

### Componente de Transição

```typescript
// src/renderer/src/components/Transition/Transition.tsx
import React, { useState, useEffect } from 'react'
import { cn } from '../../utils/cn'

interface TransitionProps {
  show: boolean
  enter?: string
  enterFrom?: string
  enterTo?: string
  leave?: string
  leaveFrom?: string
  leaveTo?: string
  children: React.ReactNode
  className?: string
}

const Transition: React.FC<TransitionProps> = ({
  show,
  enter = 'transition-opacity duration-300',
  enterFrom = 'opacity-0',
  enterTo = 'opacity-100',
  leave = 'transition-opacity duration-200',
  leaveFrom = 'opacity-100',
  leaveTo = 'opacity-0',
  children,
  className
}) => {
  const [isVisible, setIsVisible] = useState(show)
  const [isEntering, setIsEntering] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      setIsEntering(true)
      
      const timer = setTimeout(() => {
        setIsEntering(false)
      }, 50)
      
      return () => clearTimeout(timer)
    } else {
      setIsLeaving(true)
      
      const timer = setTimeout(() => {
        setIsVisible(false)
        setIsLeaving(false)
      }, 200)
      
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!isVisible) return null

  const getClasses = () => {
    if (isEntering) {
      return cn(enter, enterFrom, className)
    }
    if (isLeaving) {
      return cn(leave, leaveTo, className)
    }
    return cn(enterTo, className)
  }

  return (
    <div className={getClasses()}>
      {children}
    </div>
  )
}

export default Transition
```

## Estilos para Impressão

### CSS de Impressão

```css
/* src/renderer/src/styles/print.css */

@media print {
  /* Reset para impressão */
  * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  
  /* Ocultar elementos não necessários */
  .no-print,
  .btn,
  .filter-container,
  nav,
  .breadcrumb {
    display: none !important;
  }
  
  /* Ajustes de layout */
  body {
    font-size: 12pt;
    line-height: 1.4;
    color: black;
    background: white;
  }
  
  .print-container {
    width: 100%;
    margin: 0;
    padding: 0;
  }
  
  /* Cabeçalhos */
  h1 {
    font-size: 18pt;
    margin-bottom: 12pt;
  }
  
  h2 {
    font-size: 16pt;
    margin-bottom: 10pt;
  }
  
  h3 {
    font-size: 14pt;
    margin-bottom: 8pt;
  }
  
  /* Tabelas */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12pt;
  }
  
  th, td {
    border: 1pt solid black;
    padding: 4pt;
    text-align: left;
  }
  
  th {
    background-color: #f0f0f0;
    font-weight: bold;
  }
  
  /* Quebras de página */
  .page-break {
    page-break-before: always;
  }
  
  .avoid-break {
    page-break-inside: avoid;
  }
  
  /* Rodapé de impressão */
  .print-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    font-size: 10pt;
    border-top: 1pt solid black;
    padding-top: 4pt;
  }
  
  /* URLs em links */
  a[href]:after {
    content: " (" attr(href) ")";
    font-size: 10pt;
    color: #666;
  }
  
  /* Ajustes específicos para relatórios */
  .report-container {
    max-width: none;
    margin: 0;
    padding: 12pt;
  }
  
  .report-grid {
    display: block;
  }
  
  .report-card {
    display: inline-block;
    width: 48%;
    margin-right: 2%;
    margin-bottom: 8pt;
    border: 1pt solid black;
    padding: 6pt;
  }
}

/* Estilos específicos para diferentes tipos de impressão */
@page {
  margin: 2cm;
  size: A4;
}

@page :first {
  margin-top: 3cm;
}

@page :left {
  margin-left: 3cm;
  margin-right: 2cm;
}

@page :right {
  margin-left: 2cm;
  margin-right: 3cm;
}
```

## Performance e Otimização

### Estratégias de Otimização

1. **Purge CSS**: TailwindCSS remove classes não utilizadas
2. **Critical CSS**: Carregamento inline de estilos críticos
3. **Lazy Loading**: Carregamento sob demanda de estilos de componentes
4. **Minificação**: Compressão de CSS em produção
5. **Caching**: Cache de estilos compilados

### Configuração de Build

```javascript
// vite.config.ts (configuração de build)
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
        ...(process.env.NODE_ENV === 'production' ? [cssnano()] : [])
      ]
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/renderer/src/styles/variables.scss";`
      }
    }
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
```

## Manutenção e Boas Práticas

### 1. **Organização de Arquivos**
- Separar estilos por funcionalidade
- Usar convenções de nomenclatura consistentes
- Manter arquivos pequenos e focados

### 2. **Reutilização**
- Criar componentes de estilo reutilizáveis
- Usar design tokens consistentemente
- Evitar duplicação de código CSS

### 3. **Documentação**
- Documentar componentes de estilo
- Manter guia de estilo atualizado
- Usar comentários explicativos

### 4. **Testes**
- Testar estilos em diferentes resoluções
- Validar acessibilidade
- Verificar compatibilidade de impressão

---

**O sistema de estilos fornece uma base sólida e flexível para a interface da aplicação, garantindo consistência visual, performance otimizada e facilidade de manutenção.**
