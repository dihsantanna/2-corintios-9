# Componentes React - 2ª Coríntios 9

[← Voltar ao Índice Principal](../README.md)

## Visão Geral

O frontend da aplicação é construído com **React 18** e **TypeScript**, seguindo uma arquitetura modular baseada em componentes funcionais. A estrutura é organizada por funcionalidade, facilitando a manutenção e escalabilidade do código.

## Estrutura de Componentes

### Organização por Diretórios

**Localização:** `src/renderer/components/`

```
components/
├── Add/                    # Componentes de adição
├── Config/                 # Componentes de configuração
├── Edit/                   # Componentes de edição
├── Report/                 # Componentes de relatórios
├── DeleteModal.tsx         # Modal de confirmação de exclusão
├── FilterByMonthAndYear.tsx # Filtro por período
├── LogoChurch.tsx          # Logo da igreja
├── Menu.tsx                # Menu de navegação
├── PartialBalance.tsx      # Saldo parcial
├── ResetButton.tsx         # Botão de reset
└── SubmitButton.tsx        # Botão de submissão
```

## Componentes Principais

### 1. **App.tsx** - Componente Raiz

**Localização:** `src/renderer/App.tsx`

```typescript
function App(): JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  
  return (
    <GlobalContextProvider>
      <div className="flex h-screen bg-gray-100">
        <Menu currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
        <main className="flex-1 overflow-auto">
          <Router currentScreen={currentScreen} />
        </main>
      </div>
      <ToastContainer />
    </GlobalContextProvider>
  );
}
```

**Responsabilidades:**
- Gerenciamento do estado da tela atual
- Renderização do layout principal (Menu + Conteúdo)
- Configuração do contexto global
- Configuração de notificações (ToastContainer)

### 2. **Router.tsx** - Roteamento

**Localização:** `src/renderer/Router.tsx`

```typescript
interface RouterProps {
  currentScreen: ScreenType;
}

function Router({ currentScreen }: RouterProps): JSX.Element {
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <Home />;
      case 'addMember': return <AddMember />;
      case 'addTithe': return <AddTithe />;
      // ... outros casos
      default: return <Home />;
    }
  };
  
  return <div className="p-6">{renderScreen()}</div>;
}
```

**Responsabilidades:**
- Renderização condicional baseada na tela atual
- Mapeamento de telas para componentes
- Layout padrão com padding

### 3. **Menu.tsx** - Navegação Principal

**Localização:** `src/renderer/components/Menu.tsx`

```typescript
interface MenuProps {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
}

function Menu({ currentScreen, setCurrentScreen }: MenuProps): JSX.Element {
  return (
    <nav className="w-64 bg-blue-800 text-white">
      <div className="p-4">
        <LogoChurch />
        <h1 className="text-xl font-bold">2ª Coríntios 9</h1>
      </div>
      
      <div className="mt-8">
        {menuParams.map((section) => (
          <MenuSection 
            key={section.title}
            section={section}
            currentScreen={currentScreen}
            setCurrentScreen={setCurrentScreen}
          />
        ))}
      </div>
    </nav>
  );
}
```

**Responsabilidades:**
- Exibição do logo e título da aplicação
- Renderização das seções do menu
- Navegação entre telas
- Indicação visual da tela ativa

## Componentes de Formulário

### 1. **AddForm.tsx** - Formulário Base

**Localização:** `src/renderer/components/AddForm.tsx`

```typescript
interface AddFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isSubmitting?: boolean;
}

function AddForm({ children, onSubmit, onReset, isSubmitting }: AddFormProps): JSX.Element {
  return (
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        {children}
        
        <div className="flex gap-4 mt-6">
          <SubmitButton isSubmitting={isSubmitting} />
          <ResetButton onClick={onReset} />
        </div>
      </div>
    </form>
  );
}
```

**Responsabilidades:**
- Layout padrão para formulários
- Gerenciamento de submissão e reset
- Estilização consistente
- Botões de ação padronizados

### 2. **SubmitButton.tsx** - Botão de Submissão

```typescript
interface SubmitButtonProps {
  isSubmitting?: boolean;
  text?: string;
}

function SubmitButton({ isSubmitting = false, text = 'Salvar' }: SubmitButtonProps): JSX.Element {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {isSubmitting ? 'Salvando...' : text}
    </button>
  );
}
```

### 3. **ResetButton.tsx** - Botão de Reset

```typescript
interface ResetButtonProps {
  onClick: () => void;
  text?: string;
}

function ResetButton({ onClick, text = 'Limpar' }: ResetButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
    >
      {text}
    </button>
  );
}
```

## Componentes de Adição

### Estrutura dos Componentes Add

**Localização:** `src/renderer/components/Add/`

```
Add/
├── AddExpense/
│   └── index.tsx
├── AddExpenseCategory/
│   └── index.tsx
├── AddMember/
│   └── index.tsx
├── AddOffer/
│   └── index.tsx
├── AddOtherEntry/
│   └── index.tsx
└── AddTithe/
    └── index.tsx
```

### 1. **AddMember** - Adicionar Membro

```typescript
function AddMember(): JSX.Element {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await window.electronAPI.createMember({ name });
      toast.success('Membro adicionado com sucesso!');
      setName('');
    } catch (error) {
      toast.error('Erro ao adicionar membro');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AddForm onSubmit={handleSubmit} onReset={() => setName('')} isSubmitting={isSubmitting}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Membro
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
    </AddForm>
  );
}
```

### 2. **AddTithe** - Adicionar Dízimo

```typescript
function AddTithe(): JSX.Element {
  const [formData, setFormData] = useState({
    memberId: '',
    value: '',
    referenceMonth: new Date().getMonth() + 1,
    referenceYear: new Date().getFullYear()
  });
  
  const { members } = useGlobalContext();
  
  // Lógica de submissão e renderização...
}
```

### 3. **AddOffer** - Adicionar Oferta

```typescript
function AddOffer(): JSX.Element {
  const [formData, setFormData] = useState({
    memberId: '', // Opcional
    value: '',
    type: 'loose' as 'loose' | 'special',
    description: '',
    referenceMonth: new Date().getMonth() + 1,
    referenceYear: new Date().getFullYear()
  });
  
  // Lógica específica para ofertas...
}
```

## Componentes de Edição

### Estrutura dos Componentes Edit

**Localização:** `src/renderer/components/Edit/`

```
Edit/
├── EditExpenses/
│   └── index.tsx
├── EditExpenseCategories/
│   └── index.tsx
├── EditMembers/
│   └── index.tsx
├── EditOffers/
│   └── index.tsx
├── EditOtherEntries/
│   └── index.tsx
├── EditTithes/
│   └── index.tsx
└── EditWithdrawsToTheBankAccount/
    └index.tsx
```

### Padrão dos Componentes de Edição

```typescript
function EditMembers(): JSX.Element {
  const [members, setMembers] = useState<IMemberState[]>([]);
  const [editingMember, setEditingMember] = useState<IMemberState | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    loadMembers();
  }, []);
  
  const loadMembers = async () => {
    try {
      const data = await window.electronAPI.getAllMembers();
      setMembers(data);
    } catch (error) {
      toast.error('Erro ao carregar membros');
    }
  };
  
  const handleEdit = (member: IMemberState) => {
    setEditingMember(member);
  };
  
  const handleDelete = async (id: number) => {
    try {
      await window.electronAPI.deleteMember(id);
      toast.success('Membro excluído com sucesso!');
      loadMembers();
    } catch (error) {
      toast.error('Erro ao excluir membro');
    }
  };
  
  return (
    <div className="space-y-6">
      <FilterByMonthAndYear onFilter={handleFilter} />
      
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showDeleteModal && (
        <DeleteModal
          onConfirm={() => handleDelete(selectedId)}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}
```

## Componentes de Relatório

### Estrutura dos Componentes Report

**Localização:** `src/renderer/components/Report/`

```
Report/
├── GeneralReport/
│   └── index.tsx
├── OutputReport/
│   └── index.tsx
├── ReportDocument.tsx
├── ReportView.tsx
└── reportStyles.ts
```

### 1. **GeneralReport** - Relatório Geral

```typescript
function GeneralReport(): JSX.Element {
  const [reportData, setReportData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const generateReport = async () => {
    try {
      const data = await window.electronAPI.getEntriesReport(selectedMonth, selectedYear);
      setReportData(data);
    } catch (error) {
      toast.error('Erro ao gerar relatório');
    }
  };
  
  return (
    <div className="space-y-6">
      <FilterByMonthAndYear 
        onFilter={(month, year) => {
          setSelectedMonth(month);
          setSelectedYear(year);
          generateReport();
        }}
      />
      
      {reportData && (
        <ReportView data={reportData} month={selectedMonth} year={selectedYear} />
      )}
    </div>
  );
}
```

### 2. **ReportDocument** - Documento PDF

```typescript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface ReportDocumentProps {
  data: IReportData;
  month: number;
  year: number;
}

function ReportDocument({ data, month, year }: ReportDocumentProps): JSX.Element {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Relatório Financeiro</Text>
          <Text style={styles.subtitle}>
            {months[month - 1]} de {year}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entradas</Text>
          {data.members.map((member) => (
            <View key={member.id} style={styles.memberRow}>
              <Text>{member.name}</Text>
              <Text>Dízimos: R$ {member.totalTithes.toFixed(2)}</Text>
              <Text>Ofertas: R$ {member.totalOffers.toFixed(2)}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <Text>Total de Entradas: R$ {data.totalEntries.toFixed(2)}</Text>
          <Text>Total de Saídas: R$ {data.totalExpenses.toFixed(2)}</Text>
          <Text>Saldo: R$ {(data.totalEntries - data.totalExpenses).toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  // ... outros estilos
});
```

## Componentes Utilitários

### 1. **FilterByMonthAndYear** - Filtro de Período

```typescript
interface FilterProps {
  onFilter: (month: number, year: number) => void;
  initialMonth?: number;
  initialYear?: number;
}

function FilterByMonthAndYear({ onFilter, initialMonth, initialYear }: FilterProps): JSX.Element {
  const [month, setMonth] = useState(initialMonth || new Date().getMonth() + 1);
  const [year, setYear] = useState(initialYear || new Date().getFullYear());
  
  useEffect(() => {
    onFilter(month, year);
  }, [month, year]);
  
  return (
    <div className="flex gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mês
        </label>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          {months.map((monthName, index) => (
            <option key={index} value={index + 1}>
              {monthName}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ano
        </label>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          {years.map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
```

### 2. **DeleteModal** - Modal de Confirmação

```typescript
interface DeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

function DeleteModal({ onConfirm, onCancel, title, message }: DeleteModalProps): JSX.Element {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {title || 'Confirmar Exclusão'}
        </h3>
        
        <p className="text-sm text-gray-500 mb-6">
          {message || 'Esta ação não pode ser desfeita. Deseja continuar?'}
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 3. **PartialBalance** - Saldo Parcial

```typescript
function PartialBalance(): JSX.Element {
  const { partialBalance } = useGlobalContext();
  
  if (!partialBalance) {
    return <div>Carregando saldo...</div>;
  }
  
  const totalEntries = partialBalance.totalTithes + 
                      partialBalance.totalSpecialOffers + 
                      partialBalance.totalLooseOffers + 
                      partialBalance.totalOtherEntries;
  
  const balance = totalEntries - partialBalance.totalExpenses;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Saldo Parcial</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Dízimos:</span>
          <span className="font-medium text-green-600">
            R$ {partialBalance.totalTithes.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Ofertas Especiais:</span>
          <span className="font-medium text-green-600">
            R$ {partialBalance.totalSpecialOffers.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Ofertas Avulsas:</span>
          <span className="font-medium text-green-600">
            R$ {partialBalance.totalLooseOffers.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Outras Entradas:</span>
          <span className="font-medium text-green-600">
            R$ {partialBalance.totalOtherEntries.toFixed(2)}
          </span>
        </div>
        
        <hr className="my-3" />
        
        <div className="flex justify-between">
          <span className="text-gray-600">Total de Entradas:</span>
          <span className="font-medium text-green-600">
            R$ {totalEntries.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Total de Despesas:</span>
          <span className="font-medium text-red-600">
            R$ {partialBalance.totalExpenses.toFixed(2)}
          </span>
        </div>
        
        <hr className="my-3" />
        
        <div className="flex justify-between text-lg font-bold">
          <span>Saldo Atual:</span>
          <span className={balance >= 0 ? 'text-green-600' : 'text-red-600'}>
            R$ {balance.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
```

## Componentes de Configuração

### 1. **DataOfChurchForm** - Dados da Igreja

```typescript
function DataOfChurchForm(): JSX.Element {
  const { churchData, setChurchData } = useGlobalContext();
  const [formData, setFormData] = useState(churchData || {});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let logoSrc = formData.logoSrc;
      
      if (logoFile) {
        // Redimensionar e salvar logo
        logoSrc = await window.electronAPI.saveChurchLogo(logoFile);
      }
      
      const dataToSave = { ...formData, logoSrc };
      await window.electronAPI.saveChurchData(dataToSave);
      setChurchData(dataToSave);
      
      toast.success('Dados da igreja salvos com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar dados da igreja');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* Campos do formulário */}
    </form>
  );
}
```

## Hooks Customizados

### 1. **useGlobalContext** - Contexto Global

```typescript
function useGlobalContext() {
  const context = useContext(GlobalContext);
  
  if (!context) {
    throw new Error('useGlobalContext deve ser usado dentro de GlobalContextProvider');
  }
  
  return context;
}
```

### 2. **useLocalStorage** - Armazenamento Local

```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  };
  
  return [storedValue, setValue] as const;
}
```

## Padrões de Desenvolvimento

### 1. **Estrutura de Componentes**

```typescript
// Padrão para componentes funcionais
interface ComponentProps {
  // Props tipadas
}

function Component({ prop1, prop2 }: ComponentProps): JSX.Element {
  // Estados locais
  const [state, setState] = useState(initialValue);
  
  // Contextos
  const { globalState } = useGlobalContext();
  
  // Effects
  useEffect(() => {
    // Lógica de efeito
  }, [dependencies]);
  
  // Handlers
  const handleAction = async () => {
    // Lógica do handler
  };
  
  // Render
  return (
    <div className="component-container">
      {/* JSX */}
    </div>
  );
}

export default Component;
```

### 2. **Gerenciamento de Estado**

```typescript
// Estado local para dados temporários
const [formData, setFormData] = useState(initialFormData);

// Contexto global para dados compartilhados
const { churchData, members } = useGlobalContext();

// Estado derivado
const totalValue = useMemo(() => {
  return items.reduce((sum, item) => sum + item.value, 0);
}, [items]);
```

### 3. **Tratamento de Erros**

```typescript
const handleAsyncAction = async () => {
  try {
    setLoading(true);
    const result = await window.electronAPI.someAction();
    toast.success('Ação realizada com sucesso!');
    return result;
  } catch (error) {
    console.error('Erro na ação:', error);
    toast.error('Erro ao realizar ação');
  } finally {
    setLoading(false);
  }
};
```

### 4. **Validação de Formulários**

```typescript
const validateForm = (data: FormData): string[] => {
  const errors: string[] = [];
  
  if (!data.name.trim()) {
    errors.push('Nome é obrigatório');
  }
  
  if (data.value <= 0) {
    errors.push('Valor deve ser maior que zero');
  }
  
  return errors;
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const errors = validateForm(formData);
  if (errors.length > 0) {
    errors.forEach(error => toast.error(error));
    return;
  }
  
  // Prosseguir com submissão
};
```

## Otimizações de Performance

### 1. **Memoização de Componentes**

```typescript
const MemberRow = React.memo(({ member, onEdit, onDelete }: MemberRowProps) => {
  return (
    <tr>
      <td>{member.name}</td>
      <td>
        <button onClick={() => onEdit(member)}>Editar</button>
        <button onClick={() => onDelete(member.id)}>Excluir</button>
      </td>
    </tr>
  );
});
```

### 2. **Callbacks Memoizados**

```typescript
const handleEdit = useCallback((member: IMemberState) => {
  setEditingMember(member);
}, []);

const handleDelete = useCallback(async (id: number) => {
  // Lógica de exclusão
}, []);
```

### 3. **Lazy Loading de Componentes**

```typescript
const ReportDocument = React.lazy(() => import('./ReportDocument'));

function ReportView() {
  return (
    <Suspense fallback={<div>Carregando relatório...</div>}>
      <ReportDocument data={reportData} />
    </Suspense>
  );
}
```

## Testes de Componentes

### 1. **Estrutura de Testes**

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GlobalContextProvider } from '../context/GlobalContextProvider';
import AddMember from '../components/Add/AddMember';

const renderWithContext = (component: React.ReactElement) => {
  return render(
    <GlobalContextProvider>
      {component}
    </GlobalContextProvider>
  );
};

describe('AddMember', () => {
  test('deve renderizar formulário de adição de membro', () => {
    renderWithContext(<AddMember />);
    
    expect(screen.getByLabelText('Nome do Membro')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });
  
  test('deve validar campos obrigatórios', async () => {
    renderWithContext(<AddMember />);
    
    const submitButton = screen.getByRole('button', { name: 'Salvar' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    });
  });
});
```

### 2. **Mocks para Electron API**

```typescript
// __mocks__/electronAPI.ts
export const mockElectronAPI = {
  createMember: jest.fn(),
  getAllMembers: jest.fn(),
  updateMember: jest.fn(),
  deleteMember: jest.fn(),
};

// Configuração global
Object.defineProperty(window, 'electronAPI', {
  value: mockElectronAPI,
});
```

## Acessibilidade

### 1. **Navegação por Teclado**

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleAction();
  }
};

<button
  onClick={handleAction}
  onKeyDown={handleKeyDown}
  aria-label="Adicionar membro"
>
  Adicionar
</button>
```

### 2. **Labels e ARIA**

```typescript
<input
  type="text"
  id="member-name"
  aria-describedby="member-name-help"
  aria-required="true"
/>
<div id="member-name-help" className="sr-only">
  Digite o nome completo do membro
</div>
```

### 3. **Indicadores de Estado**

```typescript
<button
  disabled={isSubmitting}
  aria-busy={isSubmitting}
  aria-describedby={isSubmitting ? 'loading-message' : undefined}
>
  {isSubmitting ? 'Salvando...' : 'Salvar'}
</button>

{isSubmitting && (
  <div id="loading-message" aria-live="polite">
    Processando solicitação...
  </div>
)}
```

## Considerações de Segurança

### 1. **Sanitização de Dados**

```typescript
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>"'&]/g, '');
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const sanitizedValue = sanitizeInput(e.target.value);
  setFormData(prev => ({ ...prev, [e.target.name]: sanitizedValue }));
};
```

### 2. **Validação de Tipos**

```typescript
const isValidMember = (data: any): data is IMember => {
  return (
    typeof data === 'object' &&
    typeof data.name === 'string' &&
    data.name.length > 0
  );
};
```

### 3. **Controle de Acesso**

```typescript
const ProtectedComponent = ({ children }: { children: React.ReactNode }) => {
  const { isConfigured } = useGlobalContext();
  
  if (!isConfigured) {
    return <div>Configure os dados da igreja primeiro</div>;
  }
  
  return <>{children}</>;
};
```

---

## Próximos Passos

### Melhorias Planejadas

1. **Performance**
   - Implementar virtualização para listas grandes
   - Otimizar re-renders com React.memo
   - Lazy loading de rotas

2. **UX/UI**
   - Implementar skeleton loading
   - Melhorar feedback visual
   - Adicionar animações suaves

3. **Funcionalidades**
   - Modo escuro
   - Exportação de dados
   - Backup automático
   - Relatórios avançados

4. **Testes**
   - Aumentar cobertura de testes
   - Testes de integração
   - Testes E2E com Playwright

### Contribuição

Para contribuir com o desenvolvimento dos componentes:

1. Siga os padrões estabelecidos
2. Implemente testes para novos componentes
3. Documente props e funcionalidades
4. Mantenha acessibilidade em mente
5. Otimize para performance

---

**Nota:** Esta documentação reflete a estrutura atual dos componentes React. Para informações sobre o contexto global e gerenciamento de estado, consulte a documentação específica do frontend.
