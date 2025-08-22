# Testes - 2ª Coríntios 9

[← Voltar ao Índice Principal](README.md)

## Visão Geral

Este documento detalha a estratégia de testes, configuração e implementação de testes para a aplicação **2ª Coríntios 9**. A aplicação utiliza uma abordagem abrangente de testes que inclui testes unitários, testes de integração e testes end-to-end.

## Estratégia de Testes

### Pirâmide de Testes

```
        /\     E2E Tests
       /  \    (Poucos, Lentos, Caros)
      /____\   
     /      \  Integration Tests
    /        \ (Alguns, Médios)
   /__________\
  /            \ Unit Tests
 /              \ (Muitos, Rápidos, Baratos)
/________________\
```

### Cobertura de Testes

- **Testes Unitários**: 80%+ de cobertura
- **Testes de Integração**: Fluxos críticos
- **Testes E2E**: Cenários principais do usuário

## Configuração do Ambiente de Testes

### Dependências

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.5.1",
    "@types/jest": "^29.5.8",
    "electron": "^27.1.3",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "spectron": "^19.0.0",
    "ts-jest": "^29.1.1",
    "@jest/globals": "^29.7.0"
  }
}
```

### Configuração do Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapping: {
    '^@renderer/(.*)$': '<rootDir>/src/renderer/src/$1',
    '^@main/(.*)$': '<rootDir>/src/main/$1',
    '^@preload/(.*)$': '<rootDir>/src/preload/$1',
    '^@/(.*)$': '<rootDir>/src/renderer/src/$1'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx)'
  ],
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.d.ts',
    '!src/main/index.ts',
    '!src/preload/index.ts',
    '!src/renderer/src/main.tsx'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testTimeout: 10000,
  clearMocks: true,
  restoreMocks: true
}
```

### Setup de Testes

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'

// Configurar Testing Library
configure({ testIdAttribute: 'data-testid' })

// Mock do Electron API
const mockElectronAPI = {
  // Members
  getMembers: jest.fn(),
  addMember: jest.fn(),
  updateMember: jest.fn(),
  deleteMember: jest.fn(),
  
  // Tithes
  getTithes: jest.fn(),
  addTithe: jest.fn(),
  updateTithe: jest.fn(),
  deleteTithe: jest.fn(),
  
  // Offers
  getOffers: jest.fn(),
  addOffer: jest.fn(),
  updateOffer: jest.fn(),
  deleteOffer: jest.fn(),
  
  // Expenses
  getExpenses: jest.fn(),
  addExpense: jest.fn(),
  updateExpense: jest.fn(),
  deleteExpense: jest.fn(),
  
  // Reports
  generateReport: jest.fn(),
  exportToPDF: jest.fn(),
  
  // Church Data
  getChurchData: jest.fn(),
  updateChurchData: jest.fn()
}

// Disponibilizar globalmente
;(global as any).electronAPI = mockElectronAPI

// Mock do window.electronAPI
Object.defineProperty(window, 'electronAPI', {
  value: mockElectronAPI,
  writable: true
})

// Mock de funções do DOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

// Mock do ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

// Mock do IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))
```

## Testes Unitários

### Testes de Componentes React

```typescript
// src/renderer/src/components/__tests__/AddForm.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddForm } from '../Add/AddForm'
import { GlobalContextProvider } from '../context/GlobalContextProvider'

// Mock do contexto
const mockContextValue = {
  churchData: {
    id: 1,
    name: 'Igreja Teste',
    pastor: 'Pastor Teste',
    address: 'Endereço Teste',
    phone: '(11) 99999-9999',
    email: 'teste@igreja.com',
    logo: null
  },
  setChurchData: jest.fn(),
  partialBalance: {
    totalTithes: 1000,
    totalOffers: 500,
    totalExpenses: 300,
    totalOtherEntries: 200,
    balance: 1400
  },
  setPartialBalance: jest.fn()
}

const renderWithContext = (component: React.ReactElement) => {
  return render(
    <GlobalContextProvider value={mockContextValue}>
      {component}
    </GlobalContextProvider>
  )
}

describe('AddForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render form fields correctly', () => {
    renderWithContext(<AddForm />)
    
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /adicionar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    const user = userEvent.setup()
    renderWithContext(<AddForm />)
    
    const submitButton = screen.getByRole('button', { name: /adicionar/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument()
    })
  })

  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    const mockAddMember = jest.fn().mockResolvedValue({ success: true })
    window.electronAPI.addMember = mockAddMember
    
    renderWithContext(<AddForm />)
    
    await user.type(screen.getByLabelText(/nome/i), 'João Silva')
    await user.type(screen.getByLabelText(/email/i), 'joao@email.com')
    await user.type(screen.getByLabelText(/telefone/i), '(11) 99999-9999')
    
    await user.click(screen.getByRole('button', { name: /adicionar/i }))
    
    await waitFor(() => {
      expect(mockAddMember).toHaveBeenCalledWith({
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 99999-9999'
      })
    })
  })

  it('should clear form when reset button is clicked', async () => {
    const user = userEvent.setup()
    renderWithContext(<AddForm />)
    
    const nameInput = screen.getByLabelText(/nome/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    
    await user.type(nameInput, 'João Silva')
    await user.type(emailInput, 'joao@email.com')
    
    expect(nameInput.value).toBe('João Silva')
    expect(emailInput.value).toBe('joao@email.com')
    
    await user.click(screen.getByRole('button', { name: /limpar/i }))
    
    expect(nameInput.value).toBe('')
    expect(emailInput.value).toBe('')
  })

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup()
    const mockAddMember = jest.fn().mockRejectedValue(new Error('API Error'))
    window.electronAPI.addMember = mockAddMember
    
    renderWithContext(<AddForm />)
    
    await user.type(screen.getByLabelText(/nome/i), 'João Silva')
    await user.click(screen.getByRole('button', { name: /adicionar/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/erro ao adicionar/i)).toBeInTheDocument()
    })
  })
})
```

### Testes de Hooks Customizados

```typescript
// src/renderer/src/hooks/__tests__/useGlobalContext.test.tsx
import React from 'react'
import { renderHook } from '@testing-library/react'
import { useGlobalContext } from '../useGlobalContext'
import { GlobalContextProvider } from '../context/GlobalContextProvider'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GlobalContextProvider>{children}</GlobalContextProvider>
)

describe('useGlobalContext Hook', () => {
  it('should provide context values', () => {
    const { result } = renderHook(() => useGlobalContext(), { wrapper })
    
    expect(result.current.churchData).toBeDefined()
    expect(result.current.setChurchData).toBeDefined()
    expect(result.current.partialBalance).toBeDefined()
    expect(result.current.setPartialBalance).toBeDefined()
  })

  it('should throw error when used outside provider', () => {
    const { result } = renderHook(() => useGlobalContext())
    
    expect(result.error).toBeDefined()
    expect(result.error?.message).toContain('GlobalContext')
  })
})
```

### Testes de Utilitários

```typescript
// src/renderer/src/utils/__tests__/capitalize.test.ts
import { capitalize } from '../capitalize'

describe('capitalize utility', () => {
  it('should capitalize first letter of a word', () => {
    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('world')).toBe('World')
  })

  it('should handle empty strings', () => {
    expect(capitalize('')).toBe('')
  })

  it('should handle single characters', () => {
    expect(capitalize('a')).toBe('A')
    expect(capitalize('z')).toBe('Z')
  })

  it('should not change already capitalized words', () => {
    expect(capitalize('Hello')).toBe('Hello')
    expect(capitalize('WORLD')).toBe('WORLD')
  })

  it('should handle special characters', () => {
    expect(capitalize('123abc')).toBe('123abc')
    expect(capitalize('!hello')).toBe('!hello')
  })
})
```

```typescript
// src/renderer/src/utils/__tests__/months.test.ts
import { months, getMonthName, getMonthNumber } from '../months'

describe('months utility', () => {
  it('should return correct month names', () => {
    expect(getMonthName(1)).toBe('Janeiro')
    expect(getMonthName(6)).toBe('Junho')
    expect(getMonthName(12)).toBe('Dezembro')
  })

  it('should return correct month numbers', () => {
    expect(getMonthNumber('Janeiro')).toBe(1)
    expect(getMonthNumber('Junho')).toBe(6)
    expect(getMonthNumber('Dezembro')).toBe(12)
  })

  it('should handle invalid inputs', () => {
    expect(getMonthName(0)).toBeUndefined()
    expect(getMonthName(13)).toBeUndefined()
    expect(getMonthNumber('InvalidMonth')).toBeUndefined()
  })

  it('should have all 12 months', () => {
    expect(Object.keys(months)).toHaveLength(12)
    expect(months[1]).toBe('Janeiro')
    expect(months[12]).toBe('Dezembro')
  })
})
```

## Testes de Integração

### Testes do Backend (Main Process)

```typescript
// src/main/__tests__/repositories/MemberRepository.test.ts
import Database from 'better-sqlite3'
import { MemberRepository } from '../repositories/MemberRepository'
import { Member } from '../types/Member'

describe('MemberRepository Integration Tests', () => {
  let db: Database.Database
  let memberRepository: MemberRepository

  beforeEach(() => {
    // Criar banco em memória para testes
    db = new Database(':memory:')
    
    // Criar tabela de membros
    db.exec(`
      CREATE TABLE members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT,
        birthDate TEXT,
        baptismDate TEXT,
        isActive INTEGER DEFAULT 1,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    memberRepository = new MemberRepository(db)
  })

  afterEach(() => {
    db.close()
  })

  describe('create', () => {
    it('should create a new member', async () => {
      const memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 99999-9999',
        address: 'Rua A, 123',
        birthDate: '1990-01-01',
        baptismDate: '2020-01-01',
        isActive: true
      }

      const result = await memberRepository.create(memberData)

      expect(result.success).toBe(true)
      expect(result.data).toMatchObject({
        id: expect.any(Number),
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 99999-9999'
      })
    })

    it('should handle database errors', async () => {
      // Fechar o banco para simular erro
      db.close()

      const memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 99999-9999',
        address: 'Rua A, 123',
        birthDate: '1990-01-01',
        baptismDate: '2020-01-01',
        isActive: true
      }

      const result = await memberRepository.create(memberData)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('findAll', () => {
    it('should return all members', async () => {
      // Inserir dados de teste
      const stmt = db.prepare(`
        INSERT INTO members (name, email, phone) 
        VALUES (?, ?, ?)
      `)
      
      stmt.run('João Silva', 'joao@email.com', '(11) 99999-9999')
      stmt.run('Maria Santos', 'maria@email.com', '(11) 88888-8888')

      const result = await memberRepository.findAll()

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      expect(result.data[0]).toMatchObject({
        name: 'João Silva',
        email: 'joao@email.com'
      })
    })

    it('should return empty array when no members exist', async () => {
      const result = await memberRepository.findAll()

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(0)
    })
  })

  describe('update', () => {
    it('should update existing member', async () => {
      // Criar membro
      const stmt = db.prepare(`
        INSERT INTO members (name, email, phone) 
        VALUES (?, ?, ?)
      `)
      const info = stmt.run('João Silva', 'joao@email.com', '(11) 99999-9999')
      const memberId = info.lastInsertRowid as number

      // Atualizar membro
      const updateData = {
        id: memberId,
        name: 'João Santos Silva',
        email: 'joao.santos@email.com',
        phone: '(11) 99999-9999'
      }

      const result = await memberRepository.update(memberId, updateData)

      expect(result.success).toBe(true)
      expect(result.data).toMatchObject({
        id: memberId,
        name: 'João Santos Silva',
        email: 'joao.santos@email.com'
      })
    })

    it('should return error for non-existent member', async () => {
      const result = await memberRepository.update(999, {
        name: 'Nome Atualizado'
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('não encontrado')
    })
  })

  describe('delete', () => {
    it('should delete existing member', async () => {
      // Criar membro
      const stmt = db.prepare(`
        INSERT INTO members (name, email, phone) 
        VALUES (?, ?, ?)
      `)
      const info = stmt.run('João Silva', 'joao@email.com', '(11) 99999-9999')
      const memberId = info.lastInsertRowid as number

      // Deletar membro
      const result = await memberRepository.delete(memberId)

      expect(result.success).toBe(true)

      // Verificar se foi deletado
      const findResult = await memberRepository.findById(memberId)
      expect(findResult.success).toBe(false)
    })

    it('should return error for non-existent member', async () => {
      const result = await memberRepository.delete(999)

      expect(result.success).toBe(false)
      expect(result.error).toContain('não encontrado')
    })
  })
})
```

### Testes de IPC (Inter-Process Communication)

```typescript
// src/test/integration/ipc.test.ts
import { ipcMain, ipcRenderer } from 'electron'
import { setupIpcHandlers } from '../main/ipc/handlers'

// Mock do Electron IPC
jest.mock('electron', () => ({
  ipcMain: {
    handle: jest.fn(),
    removeHandler: jest.fn()
  },
  ipcRenderer: {
    invoke: jest.fn()
  }
}))

describe('IPC Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setupIpcHandlers()
  })

  it('should register all IPC handlers', () => {
    const expectedHandlers = [
      'members:getAll',
      'members:create',
      'members:update',
      'members:delete',
      'tithes:getAll',
      'tithes:create',
      'offers:getAll',
      'offers:create',
      'expenses:getAll',
      'expenses:create',
      'reports:generate',
      'church:getData',
      'church:updateData'
    ]

    expectedHandlers.forEach(handler => {
      expect(ipcMain.handle).toHaveBeenCalledWith(
        handler,
        expect.any(Function)
      )
    })
  })

  it('should handle member creation via IPC', async () => {
    const mockHandler = jest.fn().mockResolvedValue({
      success: true,
      data: { id: 1, name: 'João Silva' }
    })

    // Simular registro do handler
    ;(ipcMain.handle as jest.Mock).mockImplementation((channel, handler) => {
      if (channel === 'members:create') {
        return mockHandler
      }
    })

    // Simular chamada do renderer
    const memberData = {
      name: 'João Silva',
      email: 'joao@email.com'
    }

    ;(ipcRenderer.invoke as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 1, ...memberData }
    })

    const result = await ipcRenderer.invoke('members:create', memberData)

    expect(result.success).toBe(true)
    expect(result.data).toMatchObject(memberData)
  })
})
```

## Testes End-to-End (E2E)

### Configuração do Spectron

```typescript
// src/test/e2e/setup.ts
import { Application } from 'spectron'
import * as path from 'path'

export class TestApp {
  public app: Application

  constructor() {
    this.app = new Application({
      path: path.join(__dirname, '../../dist/electron/main.js'),
      args: ['--test-mode'],
      env: {
        NODE_ENV: 'test',
        ELECTRON_IS_DEV: 'false'
      },
      startTimeout: 10000,
      waitTimeout: 5000
    })
  }

  async start(): Promise<void> {
    await this.app.start()
    await this.app.client.waitUntilWindowLoaded()
  }

  async stop(): Promise<void> {
    if (this.app && this.app.isRunning()) {
      await this.app.stop()
    }
  }

  async restart(): Promise<void> {
    await this.stop()
    await this.start()
  }

  async getWindowCount(): Promise<number> {
    return await this.app.client.getWindowCount()
  }

  async getTitle(): Promise<string> {
    return await this.app.client.getTitle()
  }
}
```

### Testes E2E de Fluxos Principais

```typescript
// src/test/e2e/member-management.e2e.test.ts
import { TestApp } from './setup'

describe('Member Management E2E Tests', () => {
  let testApp: TestApp

  beforeAll(async () => {
    testApp = new TestApp()
    await testApp.start()
  }, 30000)

  afterAll(async () => {
    await testApp.stop()
  }, 10000)

  it('should open application window', async () => {
    const windowCount = await testApp.getWindowCount()
    expect(windowCount).toBe(1)

    const title = await testApp.getTitle()
    expect(title).toBe('2ª Coríntios 9')
  })

  it('should navigate to add member page', async () => {
    const { client } = testApp.app

    // Clicar no menu "Adicionar"
    await client.click('[data-testid="menu-add"]')
    
    // Clicar em "Adicionar Membro"
    await client.click('[data-testid="add-member-button"]')
    
    // Verificar se a página foi carregada
    await client.waitForExist('[data-testid="add-member-form"]')
    
    const formExists = await client.isExisting('[data-testid="add-member-form"]')
    expect(formExists).toBe(true)
  })

  it('should add a new member', async () => {
    const { client } = testApp.app

    // Preencher formulário
    await client.setValue('[data-testid="member-name-input"]', 'João Silva')
    await client.setValue('[data-testid="member-email-input"]', 'joao@email.com')
    await client.setValue('[data-testid="member-phone-input"]', '(11) 99999-9999')
    
    // Submeter formulário
    await client.click('[data-testid="submit-button"]')
    
    // Aguardar confirmação
    await client.waitForExist('[data-testid="success-message"]', 5000)
    
    const successMessage = await client.getText('[data-testid="success-message"]')
    expect(successMessage).toContain('Membro adicionado com sucesso')
  })

  it('should display member in list', async () => {
    const { client } = testApp.app

    // Navegar para lista de membros
    await client.click('[data-testid="menu-edit"]')
    await client.click('[data-testid="edit-members-button"]')
    
    // Aguardar carregamento da lista
    await client.waitForExist('[data-testid="members-list"]')
    
    // Verificar se o membro aparece na lista
    const memberExists = await client.isExisting('[data-testid="member-João Silva"]')
    expect(memberExists).toBe(true)
  })

  it('should edit member information', async () => {
    const { client } = testApp.app

    // Clicar no botão de editar
    await client.click('[data-testid="edit-member-João Silva"]')
    
    // Aguardar modal de edição
    await client.waitForExist('[data-testid="edit-member-modal"]')
    
    // Alterar nome
    await client.clearElement('[data-testid="edit-member-name-input"]')
    await client.setValue('[data-testid="edit-member-name-input"]', 'João Santos Silva')
    
    // Salvar alterações
    await client.click('[data-testid="save-changes-button"]')
    
    // Aguardar confirmação
    await client.waitForExist('[data-testid="success-message"]', 5000)
    
    // Verificar se o nome foi atualizado na lista
    const updatedMemberExists = await client.isExisting('[data-testid="member-João Santos Silva"]')
    expect(updatedMemberExists).toBe(true)
  })

  it('should delete member', async () => {
    const { client } = testApp.app

    // Clicar no botão de deletar
    await client.click('[data-testid="delete-member-João Santos Silva"]')
    
    // Aguardar modal de confirmação
    await client.waitForExist('[data-testid="delete-confirmation-modal"]')
    
    // Confirmar deleção
    await client.click('[data-testid="confirm-delete-button"]')
    
    // Aguardar confirmação
    await client.waitForExist('[data-testid="success-message"]', 5000)
    
    // Verificar se o membro foi removido da lista
    const memberExists = await client.isExisting('[data-testid="member-João Santos Silva"]')
    expect(memberExists).toBe(false)
  })
})
```

### Testes E2E de Relatórios

```typescript
// src/test/e2e/reports.e2e.test.ts
import { TestApp } from './setup'
import * as fs from 'fs'
import * as path from 'path'

describe('Reports E2E Tests', () => {
  let testApp: TestApp

  beforeAll(async () => {
    testApp = new TestApp()
    await testApp.start()
    
    // Adicionar dados de teste
    await seedTestData()
  }, 30000)

  afterAll(async () => {
    await testApp.stop()
  }, 10000)

  async function seedTestData() {
    const { client } = testApp.app

    // Adicionar alguns dízimos e ofertas para o relatório
    await client.click('[data-testid="menu-add"]')
    
    // Adicionar dízimo
    await client.click('[data-testid="add-tithe-button"]')
    await client.setValue('[data-testid="tithe-member-select"]', 'João Silva')
    await client.setValue('[data-testid="tithe-amount-input"]', '100.00')
    await client.click('[data-testid="submit-button"]')
    
    // Adicionar oferta
    await client.click('[data-testid="add-offer-button"]')
    await client.setValue('[data-testid="offer-description-input"]', 'Oferta de Gratidão')
    await client.setValue('[data-testid="offer-amount-input"]', '50.00')
    await client.click('[data-testid="submit-button"]')
  }

  it('should generate general report', async () => {
    const { client } = testApp.app

    // Navegar para relatórios
    await client.click('[data-testid="menu-report"]')
    await client.click('[data-testid="general-report-button"]')
    
    // Selecionar período
    await client.selectByValue('[data-testid="report-month-select"]', '1')
    await client.selectByValue('[data-testid="report-year-select"]', '2024')
    
    // Gerar relatório
    await client.click('[data-testid="generate-report-button"]')
    
    // Aguardar carregamento do relatório
    await client.waitForExist('[data-testid="report-content"]', 10000)
    
    // Verificar se o relatório contém dados
    const reportContent = await client.getText('[data-testid="report-content"]')
    expect(reportContent).toContain('Relatório Geral')
    expect(reportContent).toContain('Dízimos')
    expect(reportContent).toContain('Ofertas')
  })

  it('should export report to PDF', async () => {
    const { client } = testApp.app

    // Clicar no botão de exportar PDF
    await client.click('[data-testid="export-pdf-button"]')
    
    // Aguardar processamento
    await client.waitForExist('[data-testid="export-success-message"]', 15000)
    
    const successMessage = await client.getText('[data-testid="export-success-message"]')
    expect(successMessage).toContain('PDF gerado com sucesso')
    
    // Verificar se o arquivo foi criado (em ambiente de teste)
    // Nota: Em produção, o usuário escolheria o local do arquivo
    const downloadsPath = path.join(process.env.HOME || process.env.USERPROFILE || '', 'Downloads')
    const pdfFiles = fs.readdirSync(downloadsPath).filter(file => file.endsWith('.pdf'))
    expect(pdfFiles.length).toBeGreaterThan(0)
  })

  it('should filter report by date range', async () => {
    const { client } = testApp.app

    // Alterar filtros de data
    await client.selectByValue('[data-testid="report-month-select"]', '12')
    await client.selectByValue('[data-testid="report-year-select"]', '2023')
    
    // Gerar relatório
    await client.click('[data-testid="generate-report-button"]')
    
    // Aguardar carregamento
    await client.waitForExist('[data-testid="report-content"]', 10000)
    
    // Verificar se o relatório reflete o período selecionado
    const reportContent = await client.getText('[data-testid="report-content"]')
    expect(reportContent).toContain('Dezembro 2023')
  })
})
```

## Testes de Performance

### Benchmark de Operações do Banco

```typescript
// src/test/performance/database.perf.test.ts
import Database from 'better-sqlite3'
import { MemberRepository } from '../main/repositories/MemberRepository'
import { performance } from 'perf_hooks'

describe('Database Performance Tests', () => {
  let db: Database.Database
  let memberRepository: MemberRepository

  beforeAll(() => {
    db = new Database(':memory:')
    
    // Criar tabela
    db.exec(`
      CREATE TABLE members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT,
        birthDate TEXT,
        baptismDate TEXT,
        isActive INTEGER DEFAULT 1,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    memberRepository = new MemberRepository(db)
  })

  afterAll(() => {
    db.close()
  })

  it('should insert 1000 members in less than 1 second', async () => {
    const startTime = performance.now()
    
    const promises = []
    for (let i = 0; i < 1000; i++) {
      promises.push(memberRepository.create({
        name: `Membro ${i}`,
        email: `membro${i}@email.com`,
        phone: `(11) 9999-${i.toString().padStart(4, '0')}`,
        address: `Rua ${i}, 123`,
        birthDate: '1990-01-01',
        baptismDate: '2020-01-01',
        isActive: true
      }))
    }
    
    await Promise.all(promises)
    
    const endTime = performance.now()
    const duration = endTime - startTime
    
    console.log(`Inserção de 1000 membros levou ${duration.toFixed(2)}ms`)
    expect(duration).toBeLessThan(1000) // Menos de 1 segundo
  })

  it('should query 1000 members in less than 100ms', async () => {
    const startTime = performance.now()
    
    const result = await memberRepository.findAll()
    
    const endTime = performance.now()
    const duration = endTime - startTime
    
    console.log(`Consulta de ${result.data.length} membros levou ${duration.toFixed(2)}ms`)
    expect(duration).toBeLessThan(100) // Menos de 100ms
    expect(result.data.length).toBe(1000)
  })
})
```

### Testes de Memória

```typescript
// src/test/performance/memory.perf.test.ts
import { performance, PerformanceObserver } from 'perf_hooks'

describe('Memory Performance Tests', () => {
  it('should not have memory leaks in component mounting/unmounting', async () => {
    const initialMemory = process.memoryUsage().heapUsed
    
    // Simular múltiplas montagens e desmontagens de componentes
    for (let i = 0; i < 100; i++) {
      // Aqui você montaria e desmontaria componentes
      // Em um teste real, você usaria Testing Library
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    
    // Forçar garbage collection
    if (global.gc) {
      global.gc()
    }
    
    const finalMemory = process.memoryUsage().heapUsed
    const memoryIncrease = finalMemory - initialMemory
    
    console.log(`Aumento de memória: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`)
    
    // Permitir até 10MB de aumento (ajustar conforme necessário)
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
  })
})
```

## Scripts de Teste

### package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:unit": "jest --testPathPattern=__tests__",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "jest --testPathPattern=e2e --runInBand",
    "test:performance": "jest --testPathPattern=performance",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "test:update-snapshots": "jest --updateSnapshot"
  }
}
```

### Configuração de CI/CD

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [18.x, 20.x]
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CI: true
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
```

## Mocks e Fixtures

### Mock Data

```typescript
// src/test/fixtures/mockData.ts
export const mockMembers = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    address: 'Rua A, 123',
    birthDate: '1990-01-01',
    baptismDate: '2020-01-01',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(11) 88888-8888',
    address: 'Rua B, 456',
    birthDate: '1985-05-15',
    baptismDate: '2019-03-10',
    isActive: true,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  }
]

export const mockTithes = [
  {
    id: 1,
    memberId: 1,
    amount: 100.00,
    date: '2024-01-01',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    memberId: 2,
    amount: 150.00,
    date: '2024-01-01',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
]

export const mockOffers = [
  {
    id: 1,
    description: 'Oferta de Gratidão',
    amount: 50.00,
    date: '2024-01-01',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
]

export const mockChurchData = {
  id: 1,
  name: 'Igreja Teste',
  pastor: 'Pastor Teste',
  address: 'Endereço da Igreja',
  phone: '(11) 99999-9999',
  email: 'contato@igreja.com',
  logo: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
}
```

### Test Utilities

```typescript
// src/test/utils/testUtils.tsx
import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { GlobalContextProvider } from '../renderer/src/context/GlobalContextProvider'
import { mockChurchData } from './fixtures/mockData'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  contextValue?: any
}

const AllTheProviders = ({ children, contextValue }: { children: React.ReactNode, contextValue?: any }) => {
  const defaultContextValue = {
    churchData: mockChurchData,
    setChurchData: jest.fn(),
    partialBalance: {
      totalTithes: 1000,
      totalOffers: 500,
      totalExpenses: 300,
      totalOtherEntries: 200,
      balance: 1400
    },
    setPartialBalance: jest.fn(),
    ...contextValue
  }

  return (
    <GlobalContextProvider value={defaultContextValue}>
      {children}
    </GlobalContextProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  { contextValue, ...options }: CustomRenderOptions = {}
) => {
  return render(ui, {
    wrapper: (props) => <AllTheProviders {...props} contextValue={contextValue} />,
    ...options
  })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Helper functions
export const createMockElectronAPI = (overrides = {}) => {
  return {
    getMembers: jest.fn().mockResolvedValue({ success: true, data: [] }),
    addMember: jest.fn().mockResolvedValue({ success: true, data: {} }),
    updateMember: jest.fn().mockResolvedValue({ success: true, data: {} }),
    deleteMember: jest.fn().mockResolvedValue({ success: true }),
    getTithes: jest.fn().mockResolvedValue({ success: true, data: [] }),
    addTithe: jest.fn().mockResolvedValue({ success: true, data: {} }),
    getOffers: jest.fn().mockResolvedValue({ success: true, data: [] }),
    addOffer: jest.fn().mockResolvedValue({ success: true, data: {} }),
    getExpenses: jest.fn().mockResolvedValue({ success: true, data: [] }),
    addExpense: jest.fn().mockResolvedValue({ success: true, data: {} }),
    generateReport: jest.fn().mockResolvedValue({ success: true, data: {} }),
    getChurchData: jest.fn().mockResolvedValue({ success: true, data: mockChurchData }),
    updateChurchData: jest.fn().mockResolvedValue({ success: true, data: mockChurchData }),
    ...overrides
  }
}

export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0))
}
```

## Relatórios de Cobertura

### Configuração de Cobertura

```javascript
// jest.config.js (seção de cobertura)
module.exports = {
  // ... outras configurações
  
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.d.ts',
    '!src/main/index.ts',
    '!src/preload/index.ts',
    '!src/renderer/src/main.tsx',
    '!src/**/__tests__/**',
    '!src/**/*.test.(ts|tsx)',
    '!src/**/*.spec.(ts|tsx)'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/renderer/src/components/': {
      branches: 75,
      functions: 85,
      lines: 85,
      statements: 85
    },
    './src/main/repositories/': {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
}
```

### Script de Relatório

```bash
#!/bin/bash
# scripts/test-report.sh

echo "🧪 Executando testes e gerando relatórios..."

# Limpar cobertura anterior
rm -rf coverage/

# Executar testes com cobertura
npm run test:coverage

# Gerar relatório HTML
echo "📊 Relatório de cobertura gerado em: coverage/lcov-report/index.html"

# Abrir relatório no navegador (opcional)
if command -v open &> /dev/null; then
    open coverage/lcov-report/index.html
elif command -v xdg-open &> /dev/null; then
    xdg-open coverage/lcov-report/index.html
fi

echo "✅ Testes concluídos!"
```

## Debugging de Testes

### Configuração do VS Code

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": [
        "--runInBand",
        "--no-cache",
        "--no-coverage",
        "${fileBasenameNoExtension}"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "env": {
        "NODE_ENV": "test"
      },
      "windows": {
        "program": "${workspaceFolder}/node_modules/jest/bin/jest"
      }
    },
    {
      "name": "Debug Current Test File",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": [
        "--runInBand",
        "--no-cache",
        "${relativeFile}"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Debugging de Testes E2E

```typescript
// src/test/e2e/debug.ts
export const debugE2E = {
  async takeScreenshot(app: Application, name: string) {
    const screenshot = await app.browserWindow.capturePage()
    const fs = require('fs')
    const path = require('path')
    
    const screenshotPath = path.join(__dirname, 'screenshots', `${name}.png`)
    fs.writeFileSync(screenshotPath, screenshot)
    
    console.log(`📸 Screenshot salvo: ${screenshotPath}`)
  },
  
  async logConsole(app: Application) {
    const logs = await app.client.getRenderProcessLogs()
    console.log('🖥️ Console logs:')
    logs.forEach(log => {
      console.log(`${log.level}: ${log.message}`)
    })
  },
  
  async waitAndLog(app: Application, selector: string, timeout = 5000) {
    try {
      await app.client.waitForExist(selector, timeout)
      console.log(`✅ Elemento encontrado: ${selector}`)
    } catch (error) {
      console.log(`❌ Elemento não encontrado: ${selector}`)
      await this.takeScreenshot(app, `error-${Date.now()}`)
      throw error
    }
  }
}
```

## Boas Práticas

### 1. Organização de Testes

- **Estrutura espelhada**: Mantenha a estrutura de testes espelhando a estrutura do código
- **Nomes descritivos**: Use nomes que descrevam claramente o que está sendo testado
- **Agrupamento lógico**: Use `describe` para agrupar testes relacionados

### 2. Isolamento de Testes

- **Independência**: Cada teste deve ser independente dos outros
- **Cleanup**: Sempre limpe recursos após os testes
- **Mocks**: Use mocks para isolar unidades de teste

### 3. Dados de Teste

- **Fixtures**: Use fixtures para dados de teste consistentes
- **Factories**: Crie factories para gerar dados de teste
- **Cleanup**: Limpe dados de teste após cada execução

### 4. Performance

- **Paralelização**: Execute testes em paralelo quando possível
- **Otimização**: Otimize testes lentos
- **Timeouts**: Configure timeouts apropriados

### 5. Manutenibilidade

- **DRY**: Evite duplicação em testes
- **Helpers**: Crie funções auxiliares para operações comuns
- **Documentação**: Documente testes complexos

---

**Esta documentação de testes fornece uma base sólida para garantir a qualidade e confiabilidade da aplicação 2ª Coríntios 9 através de uma estratégia abrangente de testes automatizados.**
