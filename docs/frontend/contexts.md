# Contextos React - Frontend

[← Voltar ao Índice Principal](../README.md)

## Visão Geral

O sistema de gerenciamento de estado da aplicação **2ª Coríntios 9** utiliza a Context API do React para compartilhar dados entre componentes. Esta abordagem foi escolhida por sua simplicidade e adequação ao escopo da aplicação, evitando a complexidade de bibliotecas externas como Redux.

## Arquitetura de Contextos

### GlobalContext - Contexto Principal

```typescript
// src/renderer/src/context/GlobalContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Screens } from '../@types/Screens.type'
import { Member } from '../@types/Member.type'
import { DataOfChurch } from '../@types/DataOfChurch.type'

interface GlobalContextType {
  // Estado de navegação
  currentScreen: Screens
  setCurrentScreen: (screen: Screens) => void
  
  // Dados da igreja
  dataOfChurch: DataOfChurch | null
  setDataOfChurch: (data: DataOfChurch) => void
  loadDataOfChurch: () => Promise<void>
  
  // Membros
  members: Member[]
  setMembers: (members: Member[]) => void
  loadMembers: () => Promise<void>
  addMember: (member: Omit<Member, 'id'>) => Promise<void>
  updateMember: (id: number, member: Partial<Member>) => Promise<void>
  deleteMember: (id: number) => Promise<void>
  
  // Estados de carregamento
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  
  // Estados de erro
  error: string | null
  setError: (error: string | null) => void
  
  // Configurações da aplicação
  appSettings: AppSettings
  updateAppSettings: (settings: Partial<AppSettings>) => void
}

interface AppSettings {
  theme: 'light' | 'dark'
  language: 'pt-BR' | 'en-US'
  autoSave: boolean
  notifications: boolean
}

const defaultAppSettings: AppSettings = {
  theme: 'light',
  language: 'pt-BR',
  autoSave: true,
  notifications: true
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

interface GlobalProviderProps {
  children: ReactNode
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  // Estados principais
  const [currentScreen, setCurrentScreen] = useState<Screens>(Screens.HOME)
  const [dataOfChurch, setDataOfChurch] = useState<DataOfChurch | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultAppSettings)

  // Carregar dados da igreja
  const loadDataOfChurch = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const data = await window.electronAPI.getDataOfChurch()
      setDataOfChurch(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados da igreja'
      setError(errorMessage)
      console.error('Erro ao carregar dados da igreja:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar membros
  const loadMembers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const membersList = await window.electronAPI.getAllMembers()
      setMembers(membersList)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar membros'
      setError(errorMessage)
      console.error('Erro ao carregar membros:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Adicionar membro
  const addMember = async (memberData: Omit<Member, 'id'>) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const newMember = await window.electronAPI.createMember(memberData)
      setMembers(prev => [...prev, newMember])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar membro'
      setError(errorMessage)
      console.error('Erro ao adicionar membro:', err)
      throw err // Re-throw para que o componente possa tratar
    } finally {
      setIsLoading(false)
    }
  }

  // Atualizar membro
  const updateMember = async (id: number, memberData: Partial<Member>) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const updatedMember = await window.electronAPI.updateMember(id, memberData)
      setMembers(prev => prev.map(member => 
        member.id === id ? updatedMember : member
      ))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar membro'
      setError(errorMessage)
      console.error('Erro ao atualizar membro:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Deletar membro
  const deleteMember = async (id: number) => {
    try {
      setIsLoading(true)
      setError(null)
      
      await window.electronAPI.deleteMember(id)
      setMembers(prev => prev.filter(member => member.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar membro'
      setError(errorMessage)
      console.error('Erro ao deletar membro:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Atualizar configurações
  const updateAppSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...appSettings, ...newSettings }
    setAppSettings(updatedSettings)
    
    // Persistir no localStorage
    localStorage.setItem('app-settings', JSON.stringify(updatedSettings))
  }

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('app-settings')
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setAppSettings({ ...defaultAppSettings, ...parsedSettings })
      } catch (err) {
        console.error('Erro ao carregar configurações:', err)
      }
    }
  }, [])

  // Carregar dados iniciais
  useEffect(() => {
    loadDataOfChurch()
    loadMembers()
  }, [])

  const contextValue: GlobalContextType = {
    // Navegação
    currentScreen,
    setCurrentScreen,
    
    // Dados da igreja
    dataOfChurch,
    setDataOfChurch,
    loadDataOfChurch,
    
    // Membros
    members,
    setMembers,
    loadMembers,
    addMember,
    updateMember,
    deleteMember,
    
    // Estados
    isLoading,
    setIsLoading,
    error,
    setError,
    
    // Configurações
    appSettings,
    updateAppSettings
  }

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error('useGlobalContext deve ser usado dentro de GlobalProvider')
  }
  return context
}
```

## Contextos Especializados

### FinancialContext - Gestão Financeira

```typescript
// src/renderer/src/context/FinancialContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Tithe } from '../@types/Tithe.type'
import { Offer } from '../@types/Offer.type'
import { Expense } from '../@types/Expense.type'
import { OtherEntry } from '../@types/OtherEntry.type'
import { ExpenseCategory } from '../@types/ExpenseCategory.type'

interface FinancialSummary {
  totalTithes: number
  totalOffers: number
  totalExpenses: number
  totalOtherEntries: number
  balance: number
  monthlyBalance: number
}

interface FinancialContextType {
  // Dízimos
  tithes: Tithe[]
  loadTithes: () => Promise<void>
  addTithe: (tithe: Omit<Tithe, 'id'>) => Promise<void>
  updateTithe: (id: number, tithe: Partial<Tithe>) => Promise<void>
  deleteTithe: (id: number) => Promise<void>
  
  // Ofertas
  offers: Offer[]
  loadOffers: () => Promise<void>
  addOffer: (offer: Omit<Offer, 'id'>) => Promise<void>
  updateOffer: (id: number, offer: Partial<Offer>) => Promise<void>
  deleteOffer: (id: number) => Promise<void>
  
  // Despesas
  expenses: Expense[]
  loadExpenses: () => Promise<void>
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>
  updateExpense: (id: number, expense: Partial<Expense>) => Promise<void>
  deleteExpense: (id: number) => Promise<void>
  
  // Categorias de despesas
  expenseCategories: ExpenseCategory[]
  loadExpenseCategories: () => Promise<void>
  addExpenseCategory: (category: Omit<ExpenseCategory, 'id'>) => Promise<void>
  updateExpenseCategory: (id: number, category: Partial<ExpenseCategory>) => Promise<void>
  deleteExpenseCategory: (id: number) => Promise<void>
  
  // Outras entradas
  otherEntries: OtherEntry[]
  loadOtherEntries: () => Promise<void>
  addOtherEntry: (entry: Omit<OtherEntry, 'id'>) => Promise<void>
  updateOtherEntry: (id: number, entry: Partial<OtherEntry>) => Promise<void>
  deleteOtherEntry: (id: number) => Promise<void>
  
  // Resumo financeiro
  financialSummary: FinancialSummary
  calculateSummary: (month?: number, year?: number) => FinancialSummary
  
  // Filtros
  selectedMonth: number
  selectedYear: number
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
  
  // Estados
  isLoadingFinancial: boolean
  financialError: string | null
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined)

interface FinancialProviderProps {
  children: ReactNode
}

export const FinancialProvider: React.FC<FinancialProviderProps> = ({ children }) => {
  // Estados
  const [tithes, setTithes] = useState<Tithe[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [otherEntries, setOtherEntries] = useState<OtherEntry[]>([])
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([])
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalTithes: 0,
    totalOffers: 0,
    totalExpenses: 0,
    totalOtherEntries: 0,
    balance: 0,
    monthlyBalance: 0
  })
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [isLoadingFinancial, setIsLoadingFinancial] = useState(false)
  const [financialError, setFinancialError] = useState<string | null>(null)

  // Funções de carregamento
  const loadTithes = async () => {
    try {
      setIsLoadingFinancial(true)
      const data = await window.electronAPI.getAllTithes()
      setTithes(data)
    } catch (err) {
      setFinancialError('Erro ao carregar dízimos')
      console.error('Erro ao carregar dízimos:', err)
    } finally {
      setIsLoadingFinancial(false)
    }
  }

  const loadOffers = async () => {
    try {
      setIsLoadingFinancial(true)
      const data = await window.electronAPI.getAllOffers()
      setOffers(data)
    } catch (err) {
      setFinancialError('Erro ao carregar ofertas')
      console.error('Erro ao carregar ofertas:', err)
    } finally {
      setIsLoadingFinancial(false)
    }
  }

  const loadExpenses = async () => {
    try {
      setIsLoadingFinancial(true)
      const data = await window.electronAPI.getAllExpenses()
      setExpenses(data)
    } catch (err) {
      setFinancialError('Erro ao carregar despesas')
      console.error('Erro ao carregar despesas:', err)
    } finally {
      setIsLoadingFinancial(false)
    }
  }

  const loadOtherEntries = async () => {
    try {
      setIsLoadingFinancial(true)
      const data = await window.electronAPI.getAllOtherEntries()
      setOtherEntries(data)
    } catch (err) {
      setFinancialError('Erro ao carregar outras entradas')
      console.error('Erro ao carregar outras entradas:', err)
    } finally {
      setIsLoadingFinancial(false)
    }
  }

  const loadExpenseCategories = async () => {
    try {
      setIsLoadingFinancial(true)
      const data = await window.electronAPI.getAllExpenseCategories()
      setExpenseCategories(data)
    } catch (err) {
      setFinancialError('Erro ao carregar categorias de despesas')
      console.error('Erro ao carregar categorias:', err)
    } finally {
      setIsLoadingFinancial(false)
    }
  }

  // Funções de adição
  const addTithe = async (titheData: Omit<Tithe, 'id'>) => {
    try {
      const newTithe = await window.electronAPI.createTithe(titheData)
      setTithes(prev => [...prev, newTithe])
      calculateAndUpdateSummary()
    } catch (err) {
      setFinancialError('Erro ao adicionar dízimo')
      throw err
    }
  }

  const addOffer = async (offerData: Omit<Offer, 'id'>) => {
    try {
      const newOffer = await window.electronAPI.createOffer(offerData)
      setOffers(prev => [...prev, newOffer])
      calculateAndUpdateSummary()
    } catch (err) {
      setFinancialError('Erro ao adicionar oferta')
      throw err
    }
  }

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      const newExpense = await window.electronAPI.createExpense(expenseData)
      setExpenses(prev => [...prev, newExpense])
      calculateAndUpdateSummary()
    } catch (err) {
      setFinancialError('Erro ao adicionar despesa')
      throw err
    }
  }

  const addOtherEntry = async (entryData: Omit<OtherEntry, 'id'>) => {
    try {
      const newEntry = await window.electronAPI.createOtherEntry(entryData)
      setOtherEntries(prev => [...prev, newEntry])
      calculateAndUpdateSummary()
    } catch (err) {
      setFinancialError('Erro ao adicionar entrada')
      throw err
    }
  }

  const addExpenseCategory = async (categoryData: Omit<ExpenseCategory, 'id'>) => {
    try {
      const newCategory = await window.electronAPI.createExpenseCategory(categoryData)
      setExpenseCategories(prev => [...prev, newCategory])
    } catch (err) {
      setFinancialError('Erro ao adicionar categoria')
      throw err
    }
  }

  // Funções de atualização (similares às de adição)
  const updateTithe = async (id: number, titheData: Partial<Tithe>) => {
    try {
      const updatedTithe = await window.electronAPI.updateTithe(id, titheData)
      setTithes(prev => prev.map(tithe => tithe.id === id ? updatedTithe : tithe))
      calculateAndUpdateSummary()
    } catch (err) {
      setFinancialError('Erro ao atualizar dízimo')
      throw err
    }
  }

  // ... outras funções de update similares

  // Funções de exclusão
  const deleteTithe = async (id: number) => {
    try {
      await window.electronAPI.deleteTithe(id)
      setTithes(prev => prev.filter(tithe => tithe.id !== id))
      calculateAndUpdateSummary()
    } catch (err) {
      setFinancialError('Erro ao deletar dízimo')
      throw err
    }
  }

  // ... outras funções de delete similares

  // Calcular resumo financeiro
  const calculateSummary = (month?: number, year?: number): FinancialSummary => {
    const filterMonth = month || selectedMonth
    const filterYear = year || selectedYear

    const filterByDate = (items: any[]) => {
      return items.filter(item => {
        const itemDate = new Date(item.date)
        return itemDate.getMonth() + 1 === filterMonth && itemDate.getFullYear() === filterYear
      })
    }

    const monthlyTithes = filterByDate(tithes)
    const monthlyOffers = filterByDate(offers)
    const monthlyExpenses = filterByDate(expenses)
    const monthlyOtherEntries = filterByDate(otherEntries)

    const totalTithes = monthlyTithes.reduce((sum, tithe) => sum + tithe.value, 0)
    const totalOffers = monthlyOffers.reduce((sum, offer) => sum + offer.value, 0)
    const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.value, 0)
    const totalOtherEntries = monthlyOtherEntries.reduce((sum, entry) => sum + entry.value, 0)

    const totalIncome = totalTithes + totalOffers + totalOtherEntries
    const balance = totalIncome - totalExpenses

    return {
      totalTithes,
      totalOffers,
      totalExpenses,
      totalOtherEntries,
      balance,
      monthlyBalance: balance
    }
  }

  const calculateAndUpdateSummary = () => {
    const summary = calculateSummary()
    setFinancialSummary(summary)
  }

  // Recalcular resumo quando dados ou filtros mudarem
  useEffect(() => {
    calculateAndUpdateSummary()
  }, [tithes, offers, expenses, otherEntries, selectedMonth, selectedYear])

  // Carregar dados iniciais
  useEffect(() => {
    Promise.all([
      loadTithes(),
      loadOffers(),
      loadExpenses(),
      loadOtherEntries(),
      loadExpenseCategories()
    ])
  }, [])

  const contextValue: FinancialContextType = {
    // Dízimos
    tithes,
    loadTithes,
    addTithe,
    updateTithe,
    deleteTithe,
    
    // Ofertas
    offers,
    loadOffers,
    addOffer,
    updateOffer: async () => {}, // Implementar
    deleteOffer: async () => {}, // Implementar
    
    // Despesas
    expenses,
    loadExpenses,
    addExpense,
    updateExpense: async () => {}, // Implementar
    deleteExpense: async () => {}, // Implementar
    
    // Categorias
    expenseCategories,
    loadExpenseCategories,
    addExpenseCategory,
    updateExpenseCategory: async () => {}, // Implementar
    deleteExpenseCategory: async () => {}, // Implementar
    
    // Outras entradas
    otherEntries,
    loadOtherEntries,
    addOtherEntry,
    updateOtherEntry: async () => {}, // Implementar
    deleteOtherEntry: async () => {}, // Implementar
    
    // Resumo
    financialSummary,
    calculateSummary,
    
    // Filtros
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    
    // Estados
    isLoadingFinancial,
    financialError
  }

  return (
    <FinancialContext.Provider value={contextValue}>
      {children}
    </FinancialContext.Provider>
  )
}

export const useFinancialContext = (): FinancialContextType => {
  const context = useContext(FinancialContext)
  if (!context) {
    throw new Error('useFinancialContext deve ser usado dentro de FinancialProvider')
  }
  return context
}
```

### NotificationContext - Sistema de Notificações

```typescript
// src/renderer/src/context/NotificationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { toast, ToastContainer, ToastOptions } from 'react-toastify'

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface NotificationContextType {
  // Notificações
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  
  // Toasts
  showToast: (message: string, type?: NotificationType, options?: ToastOptions) => void
  showSuccess: (message: string, options?: ToastOptions) => void
  showError: (message: string, options?: ToastOptions) => void
  showWarning: (message: string, options?: ToastOptions) => void
  showInfo: (message: string, options?: ToastOptions) => void
  
  // Estados
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Adicionar notificação
  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev])
  }

  // Marcar como lida
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  // Marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  // Remover notificação
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  // Limpar todas as notificações
  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Mostrar toast
  const showToast = (message: string, type: NotificationType = 'info', options?: ToastOptions) => {
    const toastOptions: ToastOptions = {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    }

    switch (type) {
      case 'success':
        toast.success(message, toastOptions)
        break
      case 'error':
        toast.error(message, toastOptions)
        break
      case 'warning':
        toast.warning(message, toastOptions)
        break
      case 'info':
      default:
        toast.info(message, toastOptions)
        break
    }
  }

  // Funções de conveniência
  const showSuccess = (message: string, options?: ToastOptions) => {
    showToast(message, 'success', options)
  }

  const showError = (message: string, options?: ToastOptions) => {
    showToast(message, 'error', options)
  }

  const showWarning = (message: string, options?: ToastOptions) => {
    showToast(message, 'warning', options)
  }

  const showInfo = (message: string, options?: ToastOptions) => {
    showToast(message, 'info', options)
  }

  // Contar notificações não lidas
  const unreadCount = notifications.filter(notification => !notification.read).length

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    unreadCount
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </NotificationContext.Provider>
  )
}

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de NotificationProvider')
  }
  return context
}
```

## Hooks Customizados para Contextos

### useLocalStorage - Persistência Local

```typescript
// src/renderer/src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

type SetValue<T> = (value: T | ((val: T) => T)) => void

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>] {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Obter do localStorage
      const item = window.localStorage.getItem(key)
      // Parse do JSON armazenado ou retornar valor inicial
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Se erro, retornar valor inicial
      console.error(`Erro ao ler localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Função para definir valor
  const setValue: SetValue<T> = (value) => {
    try {
      // Permitir que value seja uma função para que tenhamos a mesma API do useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Salvar no estado
      setStoredValue(valueToStore)
      
      // Salvar no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // Uma implementação mais avançada lidaria com o caso de localStorage estar cheio
      console.error(`Erro ao definir localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
```

### useDebounce - Otimização de Performance

```typescript
// src/renderer/src/hooks/useDebounce.ts
import { useState, useEffect } from 'react'

function useDebounce<T>(value: T, delay: number): T {
  // Estado e setter para valor com debounce
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Atualizar valor com debounce após delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cancelar timeout se value mudar (também na desmontagem do componente)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay]) // Executar novamente se value ou delay mudarem

  return debouncedValue
}

export default useDebounce
```

### useAsync - Gerenciamento de Estados Assíncronos

```typescript
// src/renderer/src/hooks/useAsync.ts
import { useState, useEffect, useCallback } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

type AsyncFunction<T> = () => Promise<T>

function useAsync<T>(
  asyncFunction: AsyncFunction<T>,
  immediate = true
): AsyncState<T> & { execute: () => Promise<void>; reset: () => void } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const data = await asyncFunction()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [asyncFunction])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { ...state, execute, reset }
}

export default useAsync
```

## Composição de Providers

### AppProviders - Composição Principal

```typescript
// src/renderer/src/providers/AppProviders.tsx
import React, { ReactNode } from 'react'
import { GlobalProvider } from '../context/GlobalContext'
import { FinancialProvider } from '../context/FinancialContext'
import { NotificationProvider } from '../context/NotificationContext'
import { NavigationProvider } from '../context/NavigationContext'

interface AppProvidersProps {
  children: ReactNode
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <NotificationProvider>
      <GlobalProvider>
        <FinancialProvider>
          <NavigationProvider>
            {children}
          </NavigationProvider>
        </FinancialProvider>
      </GlobalProvider>
    </NotificationProvider>
  )
}

export default AppProviders
```

### Uso no App Principal

```typescript
// src/renderer/src/App.tsx
import React from 'react'
import AppProviders from './providers/AppProviders'
import Router from './Router'
import ErrorBoundary from './components/ErrorBoundary'
import './styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProviders>
        <div className="app">
          <Router />
        </div>
      </AppProviders>
    </ErrorBoundary>
  )
}

export default App
```

## Padrões de Uso dos Contextos

### 1. **Separação de Responsabilidades**
```typescript
// ✅ Bom: Contextos específicos
const { members, addMember } = useGlobalContext()
const { tithes, addTithe } = useFinancialContext()
const { showSuccess } = useNotification()

// ❌ Evitar: Tudo em um contexto
const { members, tithes, notifications } = useGlobalContext()
```

### 2. **Tratamento de Erros**
```typescript
// ✅ Bom: Tratamento adequado
const handleAddMember = async (memberData) => {
  try {
    await addMember(memberData)
    showSuccess('Membro adicionado com sucesso!')
    navigateTo(Screens.HOME)
  } catch (error) {
    showError('Erro ao adicionar membro')
    console.error(error)
  }
}
```

### 3. **Otimização de Re-renders**
```typescript
// ✅ Bom: Memoização quando necessário
const MemberList = React.memo(() => {
  const { members } = useGlobalContext()
  
  return (
    <div>
      {members.map(member => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  )
})
```

### 4. **Carregamento Condicional**
```typescript
// ✅ Bom: Estados de carregamento
const MemberForm = () => {
  const { isLoading, addMember } = useGlobalContext()
  
  return (
    <form>
      {/* campos do formulário */}
      <button disabled={isLoading} type="submit">
        {isLoading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  )
}
```

## Testes dos Contextos

### Testes Unitários

```typescript
// src/renderer/src/__tests__/GlobalContext.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GlobalProvider, useGlobalContext } from '../context/GlobalContext'
import { Screens } from '../@types/Screens.type'

// Mock do Electron API
const mockElectronAPI = {
  getAllMembers: jest.fn(),
  createMember: jest.fn(),
  updateMember: jest.fn(),
  deleteMember: jest.fn(),
  getDataOfChurch: jest.fn()
}

;(global as any).window = {
  electronAPI: mockElectronAPI
}

// Componente de teste
const TestComponent = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    members, 
    addMember, 
    isLoading 
  } = useGlobalContext()
  
  return (
    <div>
      <div data-testid="current-screen">{currentScreen}</div>
      <div data-testid="members-count">{members.length}</div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <button onClick={() => setCurrentScreen(Screens.ADD_MEMBER)}>
        Go to Add Member
      </button>
      <button onClick={() => addMember({ name: 'Test Member', email: 'test@test.com' })}>
        Add Member
      </button>
    </div>
  )
}

const renderWithProvider = () => {
  return render(
    <GlobalProvider>
      <TestComponent />
    </GlobalProvider>
  )
}

describe('GlobalContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockElectronAPI.getAllMembers.mockResolvedValue([])
    mockElectronAPI.getDataOfChurch.mockResolvedValue(null)
  })

  it('should provide initial state', async () => {
    renderWithProvider()
    
    expect(screen.getByTestId('current-screen')).toHaveTextContent(Screens.HOME)
    expect(screen.getByTestId('members-count')).toHaveTextContent('0')
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })
  })

  it('should update current screen', () => {
    renderWithProvider()
    
    fireEvent.click(screen.getByText('Go to Add Member'))
    expect(screen.getByTestId('current-screen')).toHaveTextContent(Screens.ADD_MEMBER)
  })

  it('should add member', async () => {
    const newMember = { id: 1, name: 'Test Member', email: 'test@test.com' }
    mockElectronAPI.createMember.mockResolvedValue(newMember)
    
    renderWithProvider()
    
    fireEvent.click(screen.getByText('Add Member'))
    
    await waitFor(() => {
      expect(mockElectronAPI.createMember).toHaveBeenCalledWith({
        name: 'Test Member',
        email: 'test@test.com'
      })
    })
  })
})
```

### Testes de Integração

```typescript
// src/renderer/src/__tests__/contexts.integration.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AppProviders from '../providers/AppProviders'
import { useGlobalContext } from '../context/GlobalContext'
import { useFinancialContext } from '../context/FinancialContext'
import { useNotification } from '../context/NotificationContext'

const IntegrationTestComponent = () => {
  const { addMember } = useGlobalContext()
  const { addTithe } = useFinancialContext()
  const { showSuccess } = useNotification()
  
  const handleAddMemberAndTithe = async () => {
    try {
      await addMember({ name: 'Test Member', email: 'test@test.com' })
      await addTithe({ memberId: 1, value: 100, date: new Date() })
      showSuccess('Membro e dízimo adicionados!')
    } catch (error) {
      console.error(error)
    }
  }
  
  return (
    <button onClick={handleAddMemberAndTithe}>
      Add Member and Tithe
    </button>
  )
}

const renderWithAllProviders = () => {
  return render(
    <AppProviders>
      <IntegrationTestComponent />
    </AppProviders>
  )
}

describe('Contexts Integration', () => {
  it('should work together across multiple contexts', async () => {
    // Mock das APIs
    const mockElectronAPI = {
      getAllMembers: jest.fn().mockResolvedValue([]),
      createMember: jest.fn().mockResolvedValue({ id: 1, name: 'Test Member' }),
      getAllTithes: jest.fn().mockResolvedValue([]),
      createTithe: jest.fn().mockResolvedValue({ id: 1, memberId: 1, value: 100 }),
      getDataOfChurch: jest.fn().mockResolvedValue(null),
      getAllOffers: jest.fn().mockResolvedValue([]),
      getAllExpenses: jest.fn().mockResolvedValue([]),
      getAllOtherEntries: jest.fn().mockResolvedValue([]),
      getAllExpenseCategories: jest.fn().mockResolvedValue([])
    }
    
    ;(global as any).window = { electronAPI: mockElectronAPI }
    
    renderWithAllProviders()
    
    fireEvent.click(screen.getByText('Add Member and Tithe'))
    
    await waitFor(() => {
      expect(mockElectronAPI.createMember).toHaveBeenCalled()
      expect(mockElectronAPI.createTithe).toHaveBeenCalled()
    })
  })
})
```

## Considerações de Performance

### 1. **Divisão de Contextos**
- Separar contextos por domínio (Global, Financial, Navigation)
- Evitar re-renders desnecessários
- Usar múltiplos contextos pequenos ao invés de um grande

### 2. **Memoização**
- Usar `useMemo` para cálculos pesados
- Usar `useCallback` para funções que são passadas como props
- Memoizar componentes com `React.memo` quando apropriado

### 3. **Lazy Loading**
- Carregar dados apenas quando necessário
- Implementar paginação para listas grandes
- Usar Suspense para carregamento assíncrono

### 4. **Otimização de Estado**
- Normalizar estruturas de dados complexas
- Evitar objetos aninhados profundos
- Usar bibliotecas como Immer para atualizações imutáveis quando necessário

---

**O sistema de contextos fornece uma base sólida para o gerenciamento de estado da aplicação, mantendo a simplicidade enquanto oferece flexibilidade para crescimento futuro.**
