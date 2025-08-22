# Sistema de Roteamento - Frontend

[← Voltar ao Índice Principal](../README.md)

## Visão Geral

O sistema de roteamento da aplicação **2ª Coríntios 9** utiliza uma abordagem baseada em estado ao invés do tradicional roteamento por URL. Esta decisão arquitetural foi tomada considerando que se trata de uma aplicação desktop Electron, onde a navegação é controlada por menus e ações do usuário.

## Arquitetura de Roteamento

### Componente Router Principal

```typescript
// src/renderer/src/Router.tsx
import React from 'react'
import { useGlobalContext } from './hooks/useGlobalContext'
import { Screens } from './@types/Screens.type'

// Importação de todas as telas
import Home from './Home'
import AddMember from './components/Add/AddMember'
import AddTithe from './components/Add/AddTithe'
import AddOffer from './components/Add/AddOffer'
import AddExpense from './components/Add/AddExpense'
import AddOtherEntry from './components/Add/AddOtherEntry'
import EditMembers from './components/Edit/EditMembers'
import GeneralReport from './components/Report/GeneralReport'
import DataOfChurchForm from './components/Config/DataOfChurchForm'

const Router: React.FC = () => {
  const { currentScreen } = useGlobalContext()

  const renderScreen = (): React.ReactElement => {
    switch (currentScreen) {
      case Screens.HOME:
        return <Home />
      
      case Screens.ADD_MEMBER:
        return <AddMember />
      
      case Screens.ADD_TITHE:
        return <AddTithe />
      
      case Screens.ADD_OFFER:
        return <AddOffer />
      
      case Screens.ADD_EXPENSE:
        return <AddExpense />
      
      case Screens.ADD_OTHER_ENTRY:
        return <AddOtherEntry />
      
      case Screens.EDIT_MEMBERS:
        return <EditMembers />
      
      case Screens.GENERAL_REPORT:
        return <GeneralReport />
      
      case Screens.CHURCH_CONFIG:
        return <DataOfChurchForm />
      
      default:
        return <Home />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderScreen()}
    </div>
  )
}

export default Router
```

### Definição de Telas

```typescript
// src/renderer/src/@types/Screens.type.ts
export enum Screens {
  HOME = 'home',
  ADD_MEMBER = 'add-member',
  ADD_TITHE = 'add-tithe',
  ADD_OFFER = 'add-offer',
  ADD_EXPENSE = 'add-expense',
  ADD_OTHER_ENTRY = 'add-other-entry',
  EDIT_MEMBERS = 'edit-members',
  GENERAL_REPORT = 'general-report',
  CHURCH_CONFIG = 'church-config'
}

export type ScreenType = keyof typeof Screens
```

## Gerenciamento de Estado de Navegação

### Context de Navegação

```typescript
// src/renderer/src/context/NavigationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Screens } from '../@types/Screens.type'

interface NavigationContextType {
  currentScreen: Screens
  previousScreen: Screens | null
  navigationHistory: Screens[]
  navigateTo: (screen: Screens) => void
  goBack: () => void
  canGoBack: boolean
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

interface NavigationProviderProps {
  children: ReactNode
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screens>(Screens.HOME)
  const [navigationHistory, setNavigationHistory] = useState<Screens[]>([Screens.HOME])

  const navigateTo = (screen: Screens) => {
    setNavigationHistory(prev => [...prev, screen])
    setCurrentScreen(screen)
  }

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory]
      newHistory.pop() // Remove a tela atual
      const previousScreen = newHistory[newHistory.length - 1]
      
      setNavigationHistory(newHistory)
      setCurrentScreen(previousScreen)
    }
  }

  const previousScreen = navigationHistory.length > 1 
    ? navigationHistory[navigationHistory.length - 2] 
    : null

  const canGoBack = navigationHistory.length > 1

  return (
    <NavigationContext.Provider value={{
      currentScreen,
      previousScreen,
      navigationHistory,
      navigateTo,
      goBack,
      canGoBack
    }}>
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation deve ser usado dentro de NavigationProvider')
  }
  return context
}
```

### Hook de Navegação

```typescript
// src/renderer/src/hooks/useNavigation.ts
import { useContext } from 'react'
import { NavigationContext } from '../context/NavigationContext'
import { Screens } from '../@types/Screens.type'

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  
  if (!context) {
    throw new Error('useNavigation deve ser usado dentro de NavigationProvider')
  }

  const { navigateTo, goBack, currentScreen, canGoBack, navigationHistory } = context

  // Funções de navegação específicas
  const goToHome = () => navigateTo(Screens.HOME)
  const goToAddMember = () => navigateTo(Screens.ADD_MEMBER)
  const goToAddTithe = () => navigateTo(Screens.ADD_TITHE)
  const goToAddOffer = () => navigateTo(Screens.ADD_OFFER)
  const goToAddExpense = () => navigateTo(Screens.ADD_EXPENSE)
  const goToAddOtherEntry = () => navigateTo(Screens.ADD_OTHER_ENTRY)
  const goToEditMembers = () => navigateTo(Screens.EDIT_MEMBERS)
  const goToGeneralReport = () => navigateTo(Screens.GENERAL_REPORT)
  const goToChurchConfig = () => navigateTo(Screens.CHURCH_CONFIG)

  // Verificações de tela atual
  const isHome = currentScreen === Screens.HOME
  const isAddScreen = currentScreen.startsWith('add-')
  const isEditScreen = currentScreen.startsWith('edit-')
  const isReportScreen = currentScreen.includes('report')
  const isConfigScreen = currentScreen.includes('config')

  return {
    // Estado atual
    currentScreen,
    canGoBack,
    navigationHistory,
    
    // Navegação geral
    navigateTo,
    goBack,
    
    // Navegação específica
    goToHome,
    goToAddMember,
    goToAddTithe,
    goToAddOffer,
    goToAddExpense,
    goToAddOtherEntry,
    goToEditMembers,
    goToGeneralReport,
    goToChurchConfig,
    
    // Verificações
    isHome,
    isAddScreen,
    isEditScreen,
    isReportScreen,
    isConfigScreen
  }
}
```

## Sistema de Menu e Navegação

### Configuração do Menu

```typescript
// src/renderer/src/utils/menuParams.ts
import { Screens } from '../@types/Screens.type'

export interface MenuOption {
  id: string
  label: string
  screen: Screens
  icon?: string
  description?: string
  category: 'add' | 'edit' | 'report' | 'config'
}

export const menuOptions: MenuOption[] = [
  // Adicionar
  {
    id: 'add-member',
    label: 'Adicionar Membro',
    screen: Screens.ADD_MEMBER,
    icon: 'UserPlus',
    description: 'Cadastrar novo membro da igreja',
    category: 'add'
  },
  {
    id: 'add-tithe',
    label: 'Adicionar Dízimo',
    screen: Screens.ADD_TITHE,
    icon: 'DollarSign',
    description: 'Registrar dízimo de membro',
    category: 'add'
  },
  {
    id: 'add-offer',
    label: 'Adicionar Oferta',
    screen: Screens.ADD_OFFER,
    icon: 'Gift',
    description: 'Registrar oferta especial',
    category: 'add'
  },
  {
    id: 'add-expense',
    label: 'Adicionar Despesa',
    screen: Screens.ADD_EXPENSE,
    icon: 'CreditCard',
    description: 'Registrar despesa da igreja',
    category: 'add'
  },
  {
    id: 'add-other-entry',
    label: 'Adicionar Outra Entrada',
    screen: Screens.ADD_OTHER_ENTRY,
    icon: 'Plus',
    description: 'Registrar outras entradas financeiras',
    category: 'add'
  },
  
  // Editar
  {
    id: 'edit-members',
    label: 'Editar Membros',
    screen: Screens.EDIT_MEMBERS,
    icon: 'Users',
    description: 'Gerenciar membros cadastrados',
    category: 'edit'
  },
  
  // Relatórios
  {
    id: 'general-report',
    label: 'Relatório Geral',
    screen: Screens.GENERAL_REPORT,
    icon: 'FileText',
    description: 'Gerar relatório financeiro completo',
    category: 'report'
  },
  
  // Configurações
  {
    id: 'church-config',
    label: 'Dados da Igreja',
    screen: Screens.CHURCH_CONFIG,
    icon: 'Settings',
    description: 'Configurar informações da igreja',
    category: 'config'
  }
]

// Funções auxiliares
export const getMenuOptionsByCategory = (category: MenuOption['category']): MenuOption[] => {
  return menuOptions.filter(option => option.category === category)
}

export const getMenuOptionById = (id: string): MenuOption | undefined => {
  return menuOptions.find(option => option.id === id)
}

export const getMenuOptionByScreen = (screen: Screens): MenuOption | undefined => {
  return menuOptions.find(option => option.screen === screen)
}
```

### Componente de Menu

```typescript
// src/renderer/src/components/Menu.tsx
import React from 'react'
import { useNavigation } from '../hooks/useNavigation'
import { menuOptions, getMenuOptionsByCategory } from '../utils/menuParams'
import { Screens } from '../@types/Screens.type'

interface MenuProps {
  onNavigate?: (screen: Screens) => void
}

const Menu: React.FC<MenuProps> = ({ onNavigate }) => {
  const { navigateTo, currentScreen } = useNavigation()

  const handleNavigation = (screen: Screens) => {
    navigateTo(screen)
    onNavigate?.(screen)
  }

  const renderMenuCategory = (category: string, title: string) => {
    const options = getMenuOptionsByCategory(category as any)
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {options.map(option => (
            <button
              key={option.id}
              onClick={() => handleNavigation(option.screen)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200
                hover:shadow-md hover:scale-105
                ${currentScreen === option.screen 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <div className="flex flex-col items-center text-center">
                {option.icon && (
                  <div className="mb-2">
                    {/* Ícone seria renderizado aqui */}
                    <span className="text-2xl">📋</span>
                  </div>
                )}
                <h4 className="font-medium mb-1">{option.label}</h4>
                {option.description && (
                  <p className="text-sm opacity-75">{option.description}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Menu Principal</h2>
        <p className="text-gray-600">Selecione uma opção para continuar</p>
      </div>

      {renderMenuCategory('add', '➕ Adicionar')}
      {renderMenuCategory('edit', '✏️ Editar')}
      {renderMenuCategory('report', '📊 Relatórios')}
      {renderMenuCategory('config', '⚙️ Configurações')}
    </div>
  )
}

export default Menu
```

## Navegação com Breadcrumbs

### Componente Breadcrumb

```typescript
// src/renderer/src/components/Breadcrumb.tsx
import React from 'react'
import { useNavigation } from '../hooks/useNavigation'
import { getMenuOptionByScreen } from '../utils/menuParams'
import { Screens } from '../@types/Screens.type'

const Breadcrumb: React.FC = () => {
  const { navigationHistory, navigateTo, currentScreen } = useNavigation()

  const getBreadcrumbItems = () => {
    return navigationHistory.map((screen, index) => {
      const menuOption = getMenuOptionByScreen(screen)
      const isLast = index === navigationHistory.length - 1
      const isHome = screen === Screens.HOME
      
      return {
        screen,
        label: isHome ? 'Início' : menuOption?.label || screen,
        isLast,
        isClickable: !isLast
      }
    })
  }

  const breadcrumbItems = getBreadcrumbItems()

  if (breadcrumbItems.length <= 1) {
    return null // Não mostrar breadcrumb na home ou com apenas um item
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4 px-6 py-3 bg-gray-50 border-b">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.screen}>
          {index > 0 && (
            <span className="text-gray-400">/</span>
          )}
          
          {item.isClickable ? (
            <button
              onClick={() => navigateTo(item.screen)}
              className="hover:text-blue-600 hover:underline transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="font-medium text-gray-900">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumb
```

## Navegação por Teclado

### Hook de Atalhos de Teclado

```typescript
// src/renderer/src/hooks/useKeyboardNavigation.ts
import { useEffect } from 'react'
import { useNavigation } from './useNavigation'
import { Screens } from '../@types/Screens.type'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  action: () => void
  description: string
}

export const useKeyboardNavigation = () => {
  const { navigateTo, goBack, canGoBack } = useNavigation()

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'h',
      ctrlKey: true,
      action: () => navigateTo(Screens.HOME),
      description: 'Ir para Home'
    },
    {
      key: 'Backspace',
      altKey: true,
      action: () => canGoBack && goBack(),
      description: 'Voltar'
    },
    {
      key: '1',
      ctrlKey: true,
      action: () => navigateTo(Screens.ADD_MEMBER),
      description: 'Adicionar Membro'
    },
    {
      key: '2',
      ctrlKey: true,
      action: () => navigateTo(Screens.ADD_TITHE),
      description: 'Adicionar Dízimo'
    },
    {
      key: '3',
      ctrlKey: true,
      action: () => navigateTo(Screens.ADD_OFFER),
      description: 'Adicionar Oferta'
    },
    {
      key: '4',
      ctrlKey: true,
      action: () => navigateTo(Screens.ADD_EXPENSE),
      description: 'Adicionar Despesa'
    },
    {
      key: 'r',
      ctrlKey: true,
      action: () => navigateTo(Screens.GENERAL_REPORT),
      description: 'Relatório Geral'
    },
    {
      key: 'e',
      ctrlKey: true,
      action: () => navigateTo(Screens.EDIT_MEMBERS),
      description: 'Editar Membros'
    }
  ]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(shortcut => {
        return (
          event.key === shortcut.key &&
          !!event.ctrlKey === !!shortcut.ctrlKey &&
          !!event.altKey === !!shortcut.altKey &&
          !!event.shiftKey === !!shortcut.shiftKey
        )
      })

      if (matchingShortcut) {
        event.preventDefault()
        matchingShortcut.action()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts, canGoBack])

  return { shortcuts }
}
```

### Componente de Ajuda de Atalhos

```typescript
// src/renderer/src/components/KeyboardShortcutsHelp.tsx
import React, { useState } from 'react'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'

const KeyboardShortcutsHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { shortcuts } = useKeyboardNavigation()

  const formatShortcut = (shortcut: any) => {
    const keys = []
    if (shortcut.ctrlKey) keys.push('Ctrl')
    if (shortcut.altKey) keys.push('Alt')
    if (shortcut.shiftKey) keys.push('Shift')
    keys.push(shortcut.key)
    
    return keys.join(' + ')
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Atalhos de Teclado (Ctrl + ?)"
      >
        ⌨️
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Atalhos de Teclado</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                    {formatShortcut(shortcut)}
                  </kbd>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              Pressione Esc para fechar esta janela
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default KeyboardShortcutsHelp
```

## Persistência de Estado de Navegação

### Hook de Persistência

```typescript
// src/renderer/src/hooks/useNavigationPersistence.ts
import { useEffect } from 'react'
import { useNavigation } from './useNavigation'
import { Screens } from '../@types/Screens.type'

const NAVIGATION_STORAGE_KEY = 'navigation-state'

interface NavigationState {
  currentScreen: Screens
  navigationHistory: Screens[]
}

export const useNavigationPersistence = () => {
  const { currentScreen, navigationHistory, navigateTo } = useNavigation()

  // Salvar estado no localStorage
  useEffect(() => {
    const navigationState: NavigationState = {
      currentScreen,
      navigationHistory
    }
    
    localStorage.setItem(NAVIGATION_STORAGE_KEY, JSON.stringify(navigationState))
  }, [currentScreen, navigationHistory])

  // Restaurar estado do localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(NAVIGATION_STORAGE_KEY)
    
    if (savedState) {
      try {
        const parsedState: NavigationState = JSON.parse(savedState)
        
        // Restaurar apenas se não estiver na home
        if (parsedState.currentScreen !== Screens.HOME) {
          navigateTo(parsedState.currentScreen)
        }
      } catch (error) {
        console.error('Erro ao restaurar estado de navegação:', error)
        // Limpar estado corrompido
        localStorage.removeItem(NAVIGATION_STORAGE_KEY)
      }
    }
  }, [])

  const clearNavigationState = () => {
    localStorage.removeItem(NAVIGATION_STORAGE_KEY)
  }

  return {
    clearNavigationState
  }
}
```

## Animações de Transição

### Hook de Transições

```typescript
// src/renderer/src/hooks/useScreenTransitions.ts
import { useState, useEffect } from 'react'
import { useNavigation } from './useNavigation'
import { Screens } from '../@types/Screens.type'

type TransitionDirection = 'slide-left' | 'slide-right' | 'fade' | 'none'

export const useScreenTransitions = () => {
  const { currentScreen, previousScreen } = useNavigation()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>('fade')

  useEffect(() => {
    if (previousScreen && previousScreen !== currentScreen) {
      setIsTransitioning(true)
      
      // Determinar direção da transição
      const direction = getTransitionDirection(previousScreen, currentScreen)
      setTransitionDirection(direction)
      
      // Finalizar transição após animação
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 300) // Duração da animação CSS
      
      return () => clearTimeout(timer)
    }
  }, [currentScreen, previousScreen])

  const getTransitionDirection = (from: Screens, to: Screens): TransitionDirection => {
    // Lógica para determinar direção baseada no fluxo da aplicação
    if (to === Screens.HOME) {
      return 'slide-right' // Voltando para home
    }
    
    if (from === Screens.HOME) {
      return 'slide-left' // Saindo da home
    }
    
    // Transições entre telas do mesmo nível
    return 'fade'
  }

  return {
    isTransitioning,
    transitionDirection
  }
}
```

### CSS para Transições

```css
/* src/renderer/src/styles/transitions.css */

.screen-transition {
  transition: all 0.3s ease-in-out;
}

.screen-enter {
  opacity: 0;
  transform: translateX(100%);
}

.screen-enter-active {
  opacity: 1;
  transform: translateX(0);
}

.screen-exit {
  opacity: 1;
  transform: translateX(0);
}

.screen-exit-active {
  opacity: 0;
  transform: translateX(-100%);
}

/* Transições específicas */
.slide-left-enter {
  transform: translateX(100%);
}

.slide-left-enter-active {
  transform: translateX(0);
}

.slide-right-enter {
  transform: translateX(-100%);
}

.slide-right-enter-active {
  transform: translateX(0);
}

.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  opacity: 1;
}

.fade-exit {
  opacity: 1;
}

.fade-exit-active {
  opacity: 0;
}
```

## Testes do Sistema de Roteamento

### Testes Unitários

```typescript
// src/renderer/src/__tests__/Router.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { NavigationProvider } from '../context/NavigationContext'
import Router from '../Router'
import { Screens } from '../@types/Screens.type'

// Mock dos componentes de tela
jest.mock('../Home', () => () => <div data-testid="home-screen">Home</div>)
jest.mock('../components/Add/AddMember', () => () => <div data-testid="add-member-screen">Add Member</div>)

const renderWithNavigation = (initialScreen = Screens.HOME) => {
  return render(
    <NavigationProvider>
      <Router />
    </NavigationProvider>
  )
}

describe('Router Component', () => {
  it('should render home screen by default', () => {
    renderWithNavigation()
    expect(screen.getByTestId('home-screen')).toBeInTheDocument()
  })

  it('should render correct screen based on navigation state', () => {
    // Este teste precisaria de um mock do contexto de navegação
    // para definir a tela atual
  })
})
```

### Testes de Integração

```typescript
// src/renderer/src/__tests__/navigation.integration.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { NavigationProvider } from '../context/NavigationContext'
import { useNavigation } from '../hooks/useNavigation'
import { Screens } from '../@types/Screens.type'

// Componente de teste
const TestNavigationComponent = () => {
  const { currentScreen, navigateTo, goBack, canGoBack } = useNavigation()
  
  return (
    <div>
      <div data-testid="current-screen">{currentScreen}</div>
      <button onClick={() => navigateTo(Screens.ADD_MEMBER)}>Go to Add Member</button>
      <button onClick={goBack} disabled={!canGoBack}>Go Back</button>
      <div data-testid="can-go-back">{canGoBack.toString()}</div>
    </div>
  )
}

const renderWithNavigation = () => {
  return render(
    <NavigationProvider>
      <TestNavigationComponent />
    </NavigationProvider>
  )
}

describe('Navigation Integration', () => {
  it('should navigate between screens', () => {
    renderWithNavigation()
    
    // Verificar tela inicial
    expect(screen.getByTestId('current-screen')).toHaveTextContent(Screens.HOME)
    expect(screen.getByTestId('can-go-back')).toHaveTextContent('false')
    
    // Navegar para outra tela
    fireEvent.click(screen.getByText('Go to Add Member'))
    expect(screen.getByTestId('current-screen')).toHaveTextContent(Screens.ADD_MEMBER)
    expect(screen.getByTestId('can-go-back')).toHaveTextContent('true')
    
    // Voltar
    fireEvent.click(screen.getByText('Go Back'))
    expect(screen.getByTestId('current-screen')).toHaveTextContent(Screens.HOME)
    expect(screen.getByTestId('can-go-back')).toHaveTextContent('false')
  })
})
```

## Considerações de Performance

### Lazy Loading de Componentes

```typescript
// src/renderer/src/Router.lazy.tsx
import React, { Suspense, lazy } from 'react'
import { useGlobalContext } from './hooks/useGlobalContext'
import { Screens } from './@types/Screens.type'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy loading dos componentes
const Home = lazy(() => import('./Home'))
const AddMember = lazy(() => import('./components/Add/AddMember'))
const AddTithe = lazy(() => import('./components/Add/AddTithe'))
const AddOffer = lazy(() => import('./components/Add/AddOffer'))
const AddExpense = lazy(() => import('./components/Add/AddExpense'))
const AddOtherEntry = lazy(() => import('./components/Add/AddOtherEntry'))
const EditMembers = lazy(() => import('./components/Edit/EditMembers'))
const GeneralReport = lazy(() => import('./components/Report/GeneralReport'))
const DataOfChurchForm = lazy(() => import('./components/Config/DataOfChurchForm'))

const LazyRouter: React.FC = () => {
  const { currentScreen } = useGlobalContext()

  const renderScreen = (): React.ReactElement => {
    switch (currentScreen) {
      case Screens.HOME:
        return <Home />
      case Screens.ADD_MEMBER:
        return <AddMember />
      case Screens.ADD_TITHE:
        return <AddTithe />
      case Screens.ADD_OFFER:
        return <AddOffer />
      case Screens.ADD_EXPENSE:
        return <AddExpense />
      case Screens.ADD_OTHER_ENTRY:
        return <AddOtherEntry />
      case Screens.EDIT_MEMBERS:
        return <EditMembers />
      case Screens.GENERAL_REPORT:
        return <GeneralReport />
      case Screens.CHURCH_CONFIG:
        return <DataOfChurchForm />
      default:
        return <Home />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        {renderScreen()}
      </Suspense>
    </div>
  )
}

export default LazyRouter
```

## Vantagens da Abordagem

### 1. **Simplicidade**
- Não requer configuração complexa de rotas
- Estado de navegação centralizado
- Fácil de entender e manter

### 2. **Performance**
- Não há parsing de URLs
- Transições mais rápidas
- Controle total sobre o carregamento de componentes

### 3. **Flexibilidade**
- Navegação programática simples
- Fácil implementação de fluxos condicionais
- Histórico de navegação customizável

### 4. **Adequação ao Electron**
- Não depende do navegador
- Integração natural com menus nativos
- Controle total sobre a experiência do usuário

## Limitações e Considerações

### 1. **Não há URLs**
- Não é possível compartilhar "links" específicos
- Não há suporte nativo a deep linking
- Histórico não é persistido pelo navegador

### 2. **SEO**
- Não aplicável (aplicação desktop)
- Não há indexação por motores de busca

### 3. **Debugging**
- Requer ferramentas customizadas para debug
- Estado deve ser inspecionado via DevTools

---

**Este sistema de roteamento baseado em estado oferece uma solução robusta e adequada para aplicações desktop Electron, priorizando simplicidade, performance e controle total sobre a experiência de navegação.**
