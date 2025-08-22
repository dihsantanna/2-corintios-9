# Banco de Dados - 2ª Coríntios 9

[← Voltar ao Índice Principal](../README.md)

## Visão Geral

O sistema utiliza **SQLite3** como banco de dados local, proporcionando uma solução leve e eficiente para armazenamento de dados da tesouraria eclesiástica. O banco é gerenciado através de uma arquitetura de repositories que encapsula toda a lógica de acesso aos dados.

## Configuração do Banco

### Localização e Conexão

**Arquivo:** `src/main/db/DatabaseConnection.ts`

```typescript
class DatabaseConnection {
  private db: Database;
  private dbPath = path.join(__dirname, '2corintios9.db');
  
  constructor() {
    this.db = new Database(this.dbPath);
    this.createTables();
  }
}
```

### Características

- **Arquivo:** `2corintios9.db` (SQLite3)
- **Localização:** Diretório `src/main/db/`
- **Inicialização:** Automática na primeira execução
- **Criação de tabelas:** Via script SQL centralizado

## Esquema do Banco de Dados

### Estrutura das Tabelas

#### 1. **members** - Membros da Igreja

```sql
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**
- `id` - Chave primária auto-incremento
- `name` - Nome do membro (obrigatório)
- `created_at` - Data de criação
- `updated_at` - Data da última atualização

#### 2. **tithes** - Dízimos

```sql
CREATE TABLE IF NOT EXISTS tithes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  value REAL NOT NULL,
  reference_month INTEGER NOT NULL,
  reference_year INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id)
);
```

**Campos:**
- `id` - Chave primária auto-incremento
- `member_id` - Referência ao membro (FK)
- `value` - Valor do dízimo
- `reference_month` - Mês de referência (1-12)
- `reference_year` - Ano de referência
- `created_at` - Data de criação
- `updated_at` - Data da última atualização

#### 3. **offers** - Ofertas

```sql
CREATE TABLE IF NOT EXISTS offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER,
  value REAL NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('special', 'loose')),
  description TEXT,
  reference_month INTEGER NOT NULL,
  reference_year INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id)
);
```

**Campos:**
- `id` - Chave primária auto-incremento
- `member_id` - Referência ao membro (FK, opcional)
- `value` - Valor da oferta
- `type` - Tipo: 'special' ou 'loose'
- `description` - Descrição opcional
- `reference_month` - Mês de referência (1-12)
- `reference_year` - Ano de referência
- `created_at` - Data de criação
- `updated_at` - Data da última atualização

#### 4. **expenseCategories** - Categorias de Despesas

```sql
CREATE TABLE IF NOT EXISTS expenseCategories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**
- `id` - Chave primária auto-incremento
- `name` - Nome da categoria (único, obrigatório)
- `created_at` - Data de criação
- `updated_at` - Data da última atualização

#### 5. **expenses** - Despesas

```sql
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  expense_category_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  value REAL NOT NULL,
  description TEXT,
  reference_month INTEGER NOT NULL,
  reference_year INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (expense_category_id) REFERENCES expenseCategories(id)
);
```

**Campos:**
- `id` - Chave primária auto-incremento
- `expense_category_id` - Referência à categoria (FK)
- `title` - Título da despesa
- `value` - Valor da despesa
- `description` - Descrição opcional
- `reference_month` - Mês de referência (1-12)
- `reference_year` - Ano de referência
- `created_at` - Data de criação
- `updated_at` - Data da última atualização

#### 6. **otherEntries** - Outras Entradas

```sql
CREATE TABLE IF NOT EXISTS otherEntries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  value REAL NOT NULL,
  description TEXT,
  reference_month INTEGER NOT NULL,
  reference_year INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**
- `id` - Chave primária auto-incremento
- `title` - Título da entrada
- `value` - Valor da entrada
- `description` - Descrição opcional
- `reference_month` - Mês de referência (1-12)
- `reference_year` - Ano de referência
- `created_at` - Data de criação
- `updated_at` - Data da última atualização

#### 7. **dataOfChurch** - Dados da Igreja

```sql
CREATE TABLE IF NOT EXISTS dataOfChurch (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  logo_src TEXT,
  name TEXT NOT NULL,
  foundation_date TEXT,
  cnpj TEXT,
  street TEXT,
  number TEXT,
  district TEXT,
  city TEXT,
  state TEXT,
  cep TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**
- `id` - Chave primária auto-incremento
- `logo_src` - Caminho do logo
- `name` - Nome da igreja (obrigatório)
- `foundation_date` - Data de fundação
- `cnpj` - CNPJ da igreja
- `street` - Logradouro
- `number` - Número
- `district` - Bairro
- `city` - Cidade
- `state` - Estado
- `cep` - CEP
- `created_at` - Data de criação
- `updated_at` - Data da última atualização

## Relacionamentos

### Diagrama de Relacionamentos

```
members (1) ←→ (N) tithes
members (1) ←→ (N) offers
expenseCategories (1) ←→ (N) expenses
```

### Chaves Estrangeiras

1. **tithes.member_id** → **members.id**
2. **offers.member_id** → **members.id** (opcional)
3. **expenses.expense_category_id** → **expenseCategories.id**

## Arquitetura de Repositories

### Padrão Repository

Cada entidade possui seu próprio repository que encapsula:
- Operações CRUD (Create, Read, Update, Delete)
- Queries específicas de negócio
- Validações de dados
- Tratamento de erros

### Estrutura dos Repositories

**Localização:** `src/main/db/repositories/`

#### 1. **Member Repository**

**Arquivo:** `Member.ts`

```typescript
class MemberRepository {
  constructor(private db: DatabaseConnection) {}
  
  async create(member: IMember): Promise<IMemberState>
  async findAll(): Promise<IMemberState[]>
  async update(id: number, member: IMember): Promise<void>
  async delete(id: number): Promise<void>
  async findById(id: number): Promise<IMemberState | undefined>
}
```

**Operações:**
- `create()` - Criar novo membro
- `findAll()` - Listar todos os membros
- `update()` - Atualizar membro existente
- `delete()` - Excluir membro
- `findById()` - Buscar membro por ID

#### 2. **Tithe Repository**

**Arquivo:** `Tithe.ts`

```typescript
class TitheRepository {
  constructor(private db: DatabaseConnection) {}
  
  async create(tithe: ITithe): Promise<ITitheState>
  async findAll(): Promise<ITitheStateWithMemberName[]>
  async findByMonthAndYear(month: number, year: number): Promise<ITitheStateWithMemberName[]>
  async update(id: number, tithe: ITithe): Promise<void>
  async delete(id: number): Promise<void>
}
```

**Operações Específicas:**
- `findByMonthAndYear()` - Filtrar por período
- Joins com tabela `members` para incluir nome

#### 3. **Offer Repository**

**Arquivo:** `Offer.ts`

```typescript
class OfferRepository {
  constructor(private db: DatabaseConnection) {}
  
  async create(offer: IOffer): Promise<IOfferState>
  async findAll(): Promise<IOfferStateWithMemberName[]>
  async findByMonthAndYear(month: number, year: number): Promise<IOfferStateWithMemberName[]>
  async findByType(type: 'special' | 'loose'): Promise<IOfferStateWithMemberName[]>
  async update(id: number, offer: IOffer): Promise<void>
  async delete(id: number): Promise<void>
}
```

**Operações Específicas:**
- `findByType()` - Filtrar por tipo de oferta
- Suporte a ofertas sem membro associado

#### 4. **Expense Repository**

**Arquivo:** `Expense.ts`

```typescript
class ExpenseRepository {
  constructor(private db: DatabaseConnection) {}
  
  async create(expense: IExpense): Promise<IExpenseState>
  async findAll(): Promise<IExpenseStateWithCategoryName[]>
  async findByMonthAndYear(month: number, year: number): Promise<IExpenseStateWithCategoryName[]>
  async findByCategory(categoryId: number): Promise<IExpenseStateWithCategoryName[]>
  async update(id: number, expense: IExpense): Promise<void>
  async delete(id: number): Promise<void>
}
```

**Operações Específicas:**
- `findByCategory()` - Filtrar por categoria
- Joins com `expenseCategories` para incluir nome da categoria

#### 5. **ExpenseCategory Repository**

**Arquivo:** `ExpenseCategory.ts`

```typescript
class ExpenseCategoryRepository {
  constructor(private db: DatabaseConnection) {}
  
  async create(category: IExpenseCategory): Promise<IExpenseCategoryState>
  async findAll(): Promise<IExpenseCategoryState[]>
  async update(id: number, category: IExpenseCategory): Promise<void>
  async delete(id: number): Promise<void>
  async findByName(name: string): Promise<IExpenseCategoryState | undefined>
}
```

**Operações Específicas:**
- `findByName()` - Buscar por nome (validação de unicidade)

#### 6. **Report Repository**

**Arquivo:** `Report.ts`

```typescript
class ReportRepository {
  constructor(private db: DatabaseConnection) {}
  
  async getEntriesReport(month: number, year: number): Promise<{
    members: IMemberWithTotalOffersAndTotalTithes[];
    otherEntries: IOtherEntryState[];
  }>
  
  async getTotalEntries(month: number, year: number): Promise<ITotalEntries>
  
  async getPartialBalance(): Promise<IPartialBalance>
}
```

**Operações Específicas:**
- `getEntriesReport()` - Relatório de entradas com totais
- `getTotalEntries()` - Totais consolidados
- `getPartialBalance()` - Saldo parcial atual

#### 7. **DataOfChurch Repository**

**Arquivo:** `DataOfChurch.ts`

```typescript
class DataOfChurchRepository {
  constructor(private db: DatabaseConnection) {}
  
  async create(data: IDataOfChurch): Promise<void>
  async get(): Promise<IDataOfChurch | undefined>
  async update(data: IDataOfChurch): Promise<void>
}
```

**Operações Específicas:**
- `get()` - Buscar dados únicos da igreja
- Singleton pattern (apenas um registro)

## Queries SQL Customizadas

### Estrutura de Queries

**Localização:** `src/main/db/repositories/queries/`

Cada repository possui um arquivo de queries correspondente:

- `member.ts` - Queries de membros
- `tithe.ts` - Queries de dízimos
- `offer.ts` - Queries de ofertas
- `expense.ts` - Queries de despesas
- `expenseCategory.ts` - Queries de categorias
- `dataOfChurch.ts` - Queries de dados da igreja

### Exemplos de Queries Complexas

#### 1. **Relatório de Entradas com Totais**

```sql
SELECT 
  m.id,
  m.name,
  COALESCE(SUM(t.value), 0) as totalTithes,
  COALESCE(SUM(o.value), 0) as totalOffers
FROM members m
LEFT JOIN tithes t ON m.id = t.member_id 
  AND t.reference_month = ? AND t.reference_year = ?
LEFT JOIN offers o ON m.id = o.member_id 
  AND o.reference_month = ? AND o.reference_year = ?
GROUP BY m.id, m.name
ORDER BY m.name;
```

#### 2. **Saldo Parcial Consolidado**

```sql
SELECT 
  COALESCE(SUM(t.value), 0) as totalTithes,
  COALESCE(SUM(CASE WHEN o.type = 'special' THEN o.value END), 0) as totalSpecialOffers,
  COALESCE(SUM(CASE WHEN o.type = 'loose' THEN o.value END), 0) as totalLooseOffers,
  COALESCE(SUM(e.value), 0) as totalExpenses
FROM tithes t
CROSS JOIN offers o
CROSS JOIN expenses e
WHERE t.reference_month <= ? AND t.reference_year <= ?
  AND o.reference_month <= ? AND o.reference_year <= ?
  AND e.reference_month <= ? AND e.reference_year <= ?;
```

## Validações e Constraints

### Validações de Negócio

1. **Membros**
   - Nome obrigatório e não vazio
   - Nome único (validação na aplicação)

2. **Dízimos**
   - Valor maior que zero
   - Mês entre 1 e 12
   - Ano válido
   - Membro deve existir

3. **Ofertas**
   - Valor maior que zero
   - Tipo deve ser 'special' ou 'loose'
   - Membro opcional (ofertas avulsas)

4. **Despesas**
   - Valor maior que zero
   - Categoria deve existir
   - Título obrigatório

5. **Categorias**
   - Nome único e obrigatório
   - Não pode ser excluída se possui despesas

### Constraints do Banco

```sql
-- Tipos de oferta
CHECK (type IN ('special', 'loose'))

-- Chaves estrangeiras
FOREIGN KEY (member_id) REFERENCES members(id)
FOREIGN KEY (expense_category_id) REFERENCES expenseCategories(id)

-- Campos únicos
UNIQUE (name) -- em expenseCategories
```

## Transações e Integridade

### Gerenciamento de Transações

```typescript
// Exemplo de transação
async deleteExpenseCategory(id: number): Promise<void> {
  const transaction = this.db.transaction(() => {
    // Verificar se existem despesas vinculadas
    const expenses = this.db.prepare(
      'SELECT COUNT(*) as count FROM expenses WHERE expense_category_id = ?'
    ).get(id);
    
    if (expenses.count > 0) {
      throw new Error('Categoria possui despesas vinculadas');
    }
    
    // Excluir categoria
    this.db.prepare('DELETE FROM expenseCategories WHERE id = ?').run(id);
  });
  
  transaction();
}
```

### Integridade Referencial

- **Cascata de exclusão** não implementada (proteção de dados)
- **Validação manual** antes de exclusões
- **Verificação de dependências** em operações críticas

## Performance e Otimização

### Índices

```sql
-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tithes_member_month_year 
  ON tithes(member_id, reference_month, reference_year);

CREATE INDEX IF NOT EXISTS idx_offers_member_month_year 
  ON offers(member_id, reference_month, reference_year);

CREATE INDEX IF NOT EXISTS idx_expenses_category_month_year 
  ON expenses(expense_category_id, reference_month, reference_year);
```

### Otimizações

1. **Prepared Statements** - Todas as queries utilizam
2. **Índices estratégicos** - Em campos de busca frequente
3. **Joins otimizados** - LEFT JOIN para preservar dados
4. **Agregações eficientes** - COALESCE para valores nulos

## Backup e Recuperação

### Estratégias de Backup

1. **Backup automático** - Cópia do arquivo `.db`
2. **Export SQL** - Dump completo do esquema e dados
3. **Backup incremental** - Baseado em timestamps

### Recuperação de Dados

```typescript
// Exemplo de recuperação
async backupDatabase(): Promise<void> {
  const backupPath = path.join(__dirname, `backup_${Date.now()}.db`);
  await fs.copyFile(this.dbPath, backupPath);
}

async restoreDatabase(backupPath: string): Promise<void> {
  await fs.copyFile(backupPath, this.dbPath);
  this.reconnect();
}
```

## Migração e Versionamento

### Controle de Versão do Schema

```sql
-- Tabela de controle de versão
CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER PRIMARY KEY,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Migração de Dados

```typescript
class DatabaseMigration {
  async migrate(): Promise<void> {
    const currentVersion = this.getCurrentVersion();
    const targetVersion = this.getTargetVersion();
    
    for (let v = currentVersion + 1; v <= targetVersion; v++) {
      await this.applyMigration(v);
    }
  }
}
```

## Monitoramento e Logs

### Logging de Operações

```typescript
// Exemplo de log
async create(data: any): Promise<any> {
  try {
    console.log(`Creating ${this.tableName}:`, data);
    const result = await this.executeQuery(query, params);
    console.log(`Created ${this.tableName} with ID:`, result.lastInsertRowid);
    return result;
  } catch (error) {
    console.error(`Error creating ${this.tableName}:`, error);
    throw error;
  }
}
```

### Métricas de Performance

- **Tempo de execução** de queries
- **Número de registros** processados
- **Uso de memória** do banco
- **Tamanho do arquivo** de banco

---

## Considerações de Segurança

### Proteção de Dados

1. **Validação de entrada** - Sanitização de dados
2. **Prepared statements** - Prevenção de SQL injection
3. **Controle de acesso** - Apenas via repositories
4. **Backup seguro** - Criptografia de backups

### Boas Práticas

- **Nunca** executar SQL dinâmico
- **Sempre** validar dados de entrada
- **Usar** transações para operações críticas
- **Implementar** logs de auditoria
- **Manter** backups regulares

## Troubleshooting

### Problemas Comuns

1. **Banco corrompido**
   - Verificar integridade: `PRAGMA integrity_check;`
   - Restaurar do backup mais recente

2. **Performance lenta**
   - Analisar planos de execução: `EXPLAIN QUERY PLAN`
   - Verificar índices necessários

3. **Erros de constraint**
   - Validar dados antes da inserção
   - Verificar relacionamentos

### Comandos Úteis

```sql
-- Verificar integridade
PRAGMA integrity_check;

-- Estatísticas da tabela
PRAGMA table_info(members);

-- Tamanho do banco
PRAGMA page_size;
PRAGMA page_count;

-- Vacuum (otimização)
VACUUM;
```
