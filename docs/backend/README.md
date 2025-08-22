# Backend - 2ª Coríntios 9

Esta documentação detalha a arquitetura e componentes do backend da aplicação "2ª Coríntios 9", que é construído sobre o processo principal do Electron.

## Visão Geral

O backend é responsável por:
- Gerenciamento do banco de dados SQLite3
- Comunicação IPC (Inter-Process Communication) com o frontend
- Processamento de dados e lógica de negócio
- Geração de relatórios
- Persistência de dados da igreja

## Estrutura de Arquivos

```
src/main/
├── @types/           # Definições de tipos TypeScript
├── db/              # Camada de banco de dados
│   ├── repositories/    # Repositórios de dados
│   └── queries/        # Consultas SQL
├── helpers/         # Funções auxiliares
├── preloadHandlers/ # Handlers de comunicação IPC
├── utils/          # Utilitários gerais
├── main.ts         # Ponto de entrada da aplicação
└── preload.ts      # Script de pré-carregamento
```

## Banco de Dados

### Tecnologia
- **SQLite3**: Banco de dados local e leve
- **Localização**: 
  - Desenvolvimento: `src/main/2corintios9.db`
  - Produção: `process.resourcesPath/db/2corintios9.sqlite`

### Estrutura de Tabelas

#### 1. members
```sql
CREATE TABLE "members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "congregated" BOOLEAN NOT NULL DEFAULT false
);
```

#### 2. tithes
```sql
CREATE TABLE "tithes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL,
    CONSTRAINT "tithe_memberId_fkey" FOREIGN KEY ("memberId") 
        REFERENCES "members" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
```

#### 3. offers
```sql
CREATE TABLE "offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT DEFAULT '',
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL,
    CONSTRAINT "offer_memberId_fkey" FOREIGN KEY ("memberId") 
        REFERENCES "members" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
```

#### 4. expenseCategories
```sql
CREATE TABLE "expenseCategories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
```

#### 5. expenses
```sql
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expenseCategoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL,
    CONSTRAINT "expense_expenseCategoryId_fkey" FOREIGN KEY ("expenseCategoryId") 
        REFERENCES "expenseCategories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
```

#### 6. otherEntries
```sql
CREATE TABLE "otherEntries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL
);
```

#### 7. dataOfChurch
```sql
CREATE TABLE "dataOfChurch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logoSrc" TEXT,
    "name" TEXT,
    "foundationDate" TEXT,
    "cnpj" TEXT,
    "street" TEXT,
    "number" TEXT,
    "district" TEXT,
    "city" TEXT,
    "state" TEXT,
    "cep" TEXT
);
```

## Repositórios

Cada entidade possui um repositório que implementa operações CRUD:

### Member Repository
- **Arquivo**: `src/main/db/repositories/Member.ts`
- **Operações**: create, findAll, update, delete
- **Funcionalidades**: Gerenciamento de membros da igreja

### Tithe Repository
- **Arquivo**: `src/main/db/repositories/Tithe.ts`
- **Operações**: create, findAllByReferencesWithMemberName, update, delete
- **Funcionalidades**: Controle de dízimos por membro e período

### Offer Repository
- **Arquivo**: `src/main/db/repositories/Offer.ts`
- **Operações**: create, findAllByReferencesWithMemberName, update, delete
- **Funcionalidades**: Gerenciamento de ofertas especiais e avulsas

### ExpenseCategory Repository
- **Arquivo**: `src/main/db/repositories/ExpenseCategory.ts`
- **Operações**: create, findAll, update, delete
- **Funcionalidades**: Categorização de despesas

### Expense Repository
- **Arquivo**: `src/main/db/repositories/Expense.ts`
- **Operações**: create, findAllByReferencesWithCategoryName, update, delete
- **Funcionalidades**: Controle de despesas por categoria e período

### Report Repository
- **Arquivo**: `src/main/db/repositories/Report.ts`
- **Operações**: getOffersAndTithesFromMembers, getTotalEntries
- **Funcionalidades**: Geração de dados para relatórios financeiros

### DataOfChurch Repository
- **Arquivo**: `src/main/db/repositories/DataOfChurch.ts`
- **Operações**: get, createOrUpdate
- **Funcionalidades**: Dados institucionais da igreja

## Tipos TypeScript

### Member Types
```typescript
export interface IMember {
  name: string;
  congregated: boolean;
}

export interface IMemberState extends IMember {
  id: string;
}
```

### Tithe Types
```typescript
export interface ITithe {
  memberId: string;
  value: number;
  referenceMonth: number;
  referenceYear: number;
}

export interface ITitheState extends ITithe {
  id: string;
}

export interface ITitheStateWithMemberName extends ITitheState {
  memberName: string;
}
```

### Offer Types
```typescript
export interface IOffer {
  memberId: string | null;
  value: number;
  referenceMonth: number;
  referenceYear: number;
}

export interface IOfferState extends IOffer {
  id: string;
}

export interface IOfferStateWithMemberName extends IOfferState {
  memberName: string | null;
}
```

### Expense Types
```typescript
export interface IExpense {
  expenseCategoryId: string;
  title: string;
  value: number;
  referenceMonth: number;
  referenceYear: number;
}

export interface IExpenseState extends IExpense {
  id: string;
}

export interface IExpenseStateWithCategoryName extends IExpenseState {
  expenseCategoryName: string;
}
```

### ExpenseCategory Types
```typescript
export interface IExpenseCategory {
  name: string;
}

export interface IExpenseCategoryState extends IExpenseCategory {
  id: string;
}
```

### DataOfChurch Types
```typescript
export interface IDataOfChurch {
  logoSrc: string;
  name: string;
  foundationDate: Date;
  cnpj: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  cep: string;
}
```

### Report Types
```typescript
export interface IMemberWithTotalOffersAndTotalTithes {
  id: string;
  name: string;
  totalTithes: number;
  totalOffers: number;
}

export interface ITotalEntries {
  previousBalance: number;
  totalTithes: number;
  totalSpecialOffers: number;
  totalLooseOffers: number;
  totalOtherEntries: number;
  totalWithdrawalsBankAccount: number;
  totalEntries: number;
}

export interface IPartialBalance {
  previousBalance: number;
  totalTithes: number;
  totalSpecialOffers: number;
  totalLooseOffers: number;
  totalWithdraws: number;
  totalEntries: number;
  totalExpenses: number;
  totalBalance: number;
}
```

## Comunicação IPC

### Preload Handlers
O arquivo `src/main/preload.ts` expõe APIs para o processo de renderização:

- **memberHandler**: Operações CRUD de membros
- **titheHandler**: Gerenciamento de dízimos
- **offerHandler**: Controle de ofertas
- **expenseCategoryHandler**: Categorias de despesas
- **expenseHandler**: Operações de despesas
- **reportHandler**: Geração de relatórios
- **dataOfChurchHandler**: Dados da igreja
- **initialBalanceHandler**: Saldo inicial
- **withdrawToTheBankAccountHandler**: Saques bancários
- **otherEntryHandler**: Outras entradas

### Handlers de Comunicação
Localizados em `src/main/preloadHandlers/`, cada handler gerencia:
- Recebimento de chamadas IPC do frontend
- Validação de dados
- Execução de operações nos repositórios
- Retorno de respostas para o frontend

## Utilitários

### Helpers
- **idGenerator**: Geração de IDs únicos
- **ValueTransform**: Conversão de tipos (toFloat, toInteger)

### DatabaseConnection
- **Arquivo**: `src/main/db/DatabaseConnection.ts`
- **Funcionalidades**:
  - Conexão com SQLite3
  - Criação automática de tabelas
  - Gerenciamento de paths de desenvolvimento e produção

## Arquivos Principais

### main.ts
- Ponto de entrada da aplicação Electron
- Inicialização da janela principal
- Configuração de handlers IPC
- Conexão com banco de dados

### preload.ts
- Script executado no contexto do renderer
- Exposição de APIs seguras via contextBridge
- Definição de tipos para comunicação IPC

## Padrões de Desenvolvimento

1. **Repository Pattern**: Cada entidade possui seu repositório
2. **Promise-based**: Todas as operações são assíncronas
3. **Type Safety**: Uso extensivo de TypeScript
4. **Error Handling**: Tratamento consistente de erros
5. **Resource Management**: Fechamento automático de conexões

## Testes

Os testes estão localizados em `test/unit/` e cobrem:
- Repositórios individuais
- Conexão com banco de dados
- Operações CRUD
- Tratamento de erros

### Estrutura de Testes
- **Mocks**: Simulação de conexões de banco
- **Unit Tests**: Testes isolados de cada repositório
- **Integration Tests**: Testes de integração com banco real