# Frontend - 2ª Coríntios 9

## Visão Geral

O frontend da aplicação **2ª Coríntios 9** é desenvolvido em React 18 com TypeScript, utilizando TailwindCSS para estilização. A aplicação segue uma arquitetura modular e componentizada, com gerenciamento de estado através de Context API e comunicação com o backend via IPC (Inter-Process Communication) do Electron.

## Tecnologias e Dependências

### Principais
- **React 18.2.0** - Biblioteca principal para UI
- **TypeScript 5.2.2** - Tipagem estática
- **TailwindCSS 3.3.3** - Framework CSS utilitário
- **React Router DOM 6.16.0** - Roteamento SPA
- **React Toastify 9.1.3** - Notificações toast
- **React Icons 4.11.0** - Biblioteca de ícones
- **@react-pdf/renderer 3.1.12** - Geração de PDFs
- **@headlessui/react 1.7.17** - Componentes acessíveis

### Desenvolvimento
- **Webpack 5** - Bundler e build
- **Jest + Testing Library** - Testes unitários
- **ESLint + Prettier** - Linting e formatação
- **Autoprefixer** - CSS vendor prefixes

## Estrutura de Arquivos

```
src/renderer/
├── @types/                    # Definições de tipos TypeScript
│   ├── ChurchData.type.ts     # Tipos para dados da igreja
│   ├── Screens.type.ts        # Tipos para telas/rotas
│   └── preload.d.ts          # Tipos para preload scripts
├── assets/                    # Recursos estáticos
│   ├── logo-empty.png        # Logo placeholder
│   └── logo.svg              # Logo da aplicação
├── components/               # Componentes React
│   ├── Add/                  # Componentes de adição
│   ├── Config/               # Componentes de configuração
│   ├── Edit/                 # Componentes de edição
│   ├── Report/               # Componentes de relatórios
│   └── [outros componentes]  # Componentes utilitários
├── context/                  # Contextos React
│   └── GlobalContext/        # Contexto global da aplicação
├── styles/                   # Estilos CSS
│   ├── global.css           # Estilos globais + TailwindCSS
│   └── reactToastify.css    # Customizações do toast
├── utils/                    # Funções utilitárias
├── App.tsx                   # Componente raiz
├── Router.tsx               # Configuração de rotas
├── Home.tsx                 # Tela inicial
└── index.tsx               # Ponto de entrada
```

## Arquitetura de Componentes

### Componentes Principais

#### 1. **App.tsx**
- Componente raiz da aplicação
- Gerencia layout principal (sidebar + main)
- Configura ToastContainer para notificações
- Implementa navegação automática para `/home`

#### 2. **Router.tsx**
- Configuração de todas as rotas da aplicação
- Envolvido pelo `GlobalContextProvider`
- Mapeia URLs para componentes específicos

#### 3. **Home.tsx**
- Tela inicial da aplicação
- Exibe saldo parcial e configurações
- Gerencia configuração inicial da igreja

### Estrutura de Componentes por Categoria

#### **Add/** - Componentes de Adição
- `AddForm.tsx` - Formulário base reutilizável
- `AddMember.tsx` - Cadastro de membros
- `AddTithe.tsx` - Cadastro de dízimos
- `AddOffer.tsx` - Cadastro de ofertas
- `AddExpense.tsx` - Cadastro de despesas
- `AddExpenseCategory.tsx` - Cadastro de categorias
- `AddOtherEntry.tsx` - Cadastro de outras entradas
- `AddWithdrawToTheBankAccount.tsx` - Cadastro de saques

#### **Edit/** - Componentes de Edição
- `EditForm.tsx` - Formulário base para edição
- `EditMembers.tsx` - Edição de membros
- `EditTithes.tsx` - Edição de dízimos
- `EditOffers.tsx` - Edição de ofertas
- `EditExpenses.tsx` - Edição de despesas
- `EditExpenseCategories.tsx` - Edição de categorias
- `EditOtherEntries.tsx` - Edição de outras entradas
- `EditWithdrawsToTheBankAccount.tsx` - Edição de saques

#### **Report/** - Componentes de Relatórios
- `ReportView.tsx` - Layout base para relatórios
- `EntriesReport/` - Relatório de entradas
- `GeneralReport/` - Relatório geral
- `OutputReport/` - Relatório de saídas
- `Document/` - Componentes para geração de PDF
- `Table.tsx` - Tabelas de dados
- `Infos.tsx` - Informações dos relatórios

#### **Config/** - Componentes de Configuração
- `InitialConfig.tsx` - Configuração inicial
- `DataOfChurchConfig.tsx` - Configuração da igreja
- `DataOfChurchForm.tsx` - Formulário de dados da igreja
- `BalanceConfig.tsx` - Configuração de saldo
- `BalanceConfigForm.tsx` - Formulário de saldo inicial

#### **Componentes Utilitários**
- `Menu.tsx` - Menu lateral de navegação
- `LogoChurch.tsx` - Exibição do logo da igreja
- `PartialBalance.tsx` - Exibição do saldo parcial
- `FilterByMonthAndYear.tsx` - Filtro por período
- `DeleteModal.tsx` - Modal de confirmação de exclusão
- `SubmitButton.tsx` - Botão de envio customizado
- `ResetButton.tsx` - Botão de reset customizado
- `ExpenseTitleSuggestions.tsx` - Sugestões de títulos

## Gerenciamento de Estado

### GlobalContext

**Localização:** `src/renderer/context/GlobalContext/GlobalContextProvider.tsx`

O contexto global gerencia:

```typescript
interface GlobalContextType {
  churchData: ChurchData;           // Dados da igreja
  setChurchData: (data: ChurchData) => void;
  partialBalance: IPartialBalance;  // Saldo parcial
  setPartialBalance: (balance: IPartialBalance) => void;
  refreshPartialBalance: boolean;   // Flag para atualização
  setRefreshPartialBalance: (refresh: boolean) => void;
  showInitialConfig: boolean;       // Exibir config inicial
  setShowInitialConfig: (show: boolean) => void;
}
```

#### Estados Gerenciados

1. **churchData** - Informações da igreja (nome, logo, endereço, etc.)
2. **partialBalance** - Saldo financeiro atual
3. **refreshPartialBalance** - Controle de atualização do saldo
4. **showInitialConfig** - Controle da tela de configuração inicial

### Hook Personalizado

```typescript
const { 
  churchData, 
  partialBalance, 
  refreshPartialBalance,
  setRefreshPartialBalance 
} = useGlobalContext();
```

## Sistema de Roteamento

### Configuração de Rotas

**Arquivo:** `src/renderer/Router.tsx`

```typescript
<Routes>
  <Route path="/home" element={<Home />} />
  
  {/* Rotas de Adição */}
  <Route path="/addMember" element={<AddMember />} />
  <Route path="/addTithe" element={<AddTithe />} />
  <Route path="/addOffer" element={<AddOffer />} />
  <Route path="/addExpense" element={<AddExpense />} />
  <Route path="/addExpenseCategory" element={<AddExpenseCategory />} />
  <Route path="/addOtherEntry" element={<AddOtherEntry />} />
  <Route path="/addWithdrawToTheBankAccount" element={<AddWithdrawToTheBankAccount />} />
  
  {/* Rotas de Edição */}
  <Route path="/editMembers" element={<EditMembers />} />
  <Route path="/editTithes" element={<EditTithes />} />
  <Route path="/editOffers" element={<EditOffers />} />
  <Route path="/editExpenses" element={<EditExpenses />} />
  <Route path="/editExpenseCategories" element={<EditExpenseCategories />} />
  <Route path="/editOtherEntries" element={<EditOtherEntries />} />
  <Route path="/editWithdrawsToTheBankAccount" element={<EditWithdrawsToTheBankAccount />} />
  
  {/* Rotas de Relatórios */}
  <Route path="/entriesReport" element={<EntriesReport />} />
  <Route path="/outputReport" element={<OutputReport />} />
  <Route path="/generalReport" element={<GeneralReport />} />
</Routes>
```

### Navegação

- **HashRouter** - Utilizado para compatibilidade com Electron
- **Redirecionamento automático** - `/` → `/home`
- **Menu lateral** - Navegação através do componente `Menu.tsx`
- **Botão home** - Ícone de igreja para retornar à tela inicial

## Comunicação IPC

### Handlers Disponíveis

A comunicação com o backend é feita através de handlers expostos via preload:

```typescript
// Exemplos de uso
const members = await window.member?.findAll();
const tithe = await window.tithe?.create(titheData);
const report = await window.report?.getEntriesReport(month, year);
```

#### Principais Handlers

- **member** - Operações com membros
- **tithe** - Operações com dízimos
- **offer** - Operações com ofertas
- **expense** - Operações com despesas
- **expenseCategory** - Operações com categorias
- **otherEntry** - Operações com outras entradas
- **withdrawToTheBankAccount** - Operações com saques
- **report** - Geração de relatórios
- **dataOfChurch** - Dados da igreja

## Utilitários

### Funções Auxiliares

**Localização:** `src/renderer/utils/`

#### 1. **months.ts**
```typescript
export const months = {
  1: 'Janeiro', 2: 'Fevereiro', 3: 'Março',
  4: 'Abril', 5: 'Maio', 6: 'Junho',
  7: 'Julho', 8: 'Agosto', 9: 'Setembro',
  10: 'Outubro', 11: 'Novembro', 12: 'Dezembro'
};
```

#### 2. **menuParams.ts**
Configurações do menu lateral com labels e IDs das rotas.

#### 3. **states.ts**
Lista de estados brasileiros para formulários.

#### 4. **years.ts**
Geração de anos para filtros e formulários.

#### 5. **capitalize.ts**
Função para capitalização de strings.

#### 6. **resizeImg.ts**
Redimensionamento de imagens para logos.

## Estilização

### TailwindCSS

**Configuração:** `tailwind.config.js`

- **Framework utilitário** para estilização rápida
- **Responsividade** built-in
- **Customizações** para cores e espaçamentos
- **Plugin scrollbar** para barras de rolagem customizadas

### Estilos Globais

**Arquivo:** `src/renderer/styles/global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Customizações globais */
```

### Temas

- **Tema principal** - Tons de zinc/cinza com acentos em teal
- **Tema escuro** - Para notificações toast
- **Cores personalizadas** - Amarelo para cabeçalhos de relatórios

## Geração de PDFs

### @react-pdf/renderer

Utilizado para geração de relatórios em PDF:

#### Componentes PDF

- **ReportDocument.tsx** - Layout base dos relatórios
- **EntriesReportDocument.tsx** - Relatório de entradas
- **GeneralReportDocument.tsx** - Relatório geral
- **OutputReportDocument.tsx** - Relatório de saídas
- **reportStyles.ts** - Estilos para PDFs

#### Funcionalidades

- **Download direto** via `PDFDownloadLink`
- **Estilos customizados** com StyleSheet
- **Dados dinâmicos** baseados em filtros
- **Logo da igreja** incorporado nos relatórios

## Notificações

### React Toastify

**Configuração no App.tsx:**

```typescript
<ToastContainer
  position="bottom-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="dark"
/>
```

#### Tipos de Notificação

- **toast.success()** - Operações bem-sucedidas
- **toast.error()** - Erros e falhas
- **toast.info()** - Informações gerais
- **toast.warning()** - Avisos

## Padrões de Desenvolvimento

### Estrutura de Componentes

1. **Imports** - Bibliotecas externas primeiro, depois locais
2. **Interfaces/Types** - Definições de tipos no topo
3. **Estados** - useState hooks
4. **Efeitos** - useEffect hooks
5. **Handlers** - Funções de manipulação
6. **Render** - JSX de retorno

### Convenções de Nomenclatura

- **Componentes** - PascalCase (`AddMember.tsx`)
- **Hooks** - camelCase com prefixo `use`
- **Utilitários** - camelCase (`menuParams.ts`)
- **Tipos** - PascalCase com sufixo `Type`
- **Interfaces** - PascalCase com prefixo `I`

### Validação e Tratamento de Erros

- **Try/catch** em operações IPC
- **Validação de formulários** antes do envio
- **Feedback visual** através de toasts
- **Estados de loading** durante operações

## Performance

### Otimizações Implementadas

1. **useCallback** - Memoização de funções
2. **Lazy loading** - Carregamento sob demanda
3. **Context otimizado** - Evita re-renders desnecessários
4. **Componentes reutilizáveis** - AddForm, EditForm, etc.

### Boas Práticas

- **Componentes pequenos** e focados
- **Props tipadas** com TypeScript
- **Estados locais** quando possível
- **Cleanup** de efeitos e listeners

## Testes

### Configuração

- **Jest** como test runner
- **Testing Library** para testes de componentes
- **jsdom** como ambiente de teste

### Estrutura de Testes

```bash
test/
├── unit/          # Testes unitários
└── E2E/           # Testes end-to-end
```

## Build e Deploy

### Scripts Disponíveis

```bash
# Desenvolvimento
npm start

# Build de produção
npm run build:renderer

# Testes
npm test

# Linting
npm run lint
```

### Configuração Webpack

- **Hot reload** em desenvolvimento
- **Code splitting** para otimização
- **Asset optimization** para produção
- **TypeScript compilation** integrada

---

## Próximos Passos

### Melhorias Planejadas

1. **Testes unitários** mais abrangentes
2. **Acessibilidade** aprimorada
3. **Performance** otimizada
4. **Documentação** de componentes individuais

### Contribuição

Para contribuir com o frontend:

1. Siga os padrões de código estabelecidos
2. Adicione testes para novos componentes
3. Mantenha a documentação atualizada
4. Use TypeScript strict mode
5. Implemente tratamento de erros adequado