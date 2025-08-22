# 2ª Coríntios 9 - Documentação

## Visão Geral

**2ª Coríntios 9** é uma aplicação desktop desenvolvida com Electron para gerenciamento da tesouraria de igrejas. O sistema oferece uma solução completa para controle financeiro eclesiástico, incluindo gestão de dízimos, ofertas, despesas, membros e relatórios.

### Tecnologias Principais

- **Frontend**: React 18 + TypeScript + TailwindCSS
- **Backend**: Electron Main Process + SQLite3
- **Build**: Webpack + Electron Builder
- **Testes**: Jest + Testing Library
- **Linting**: ESLint + Prettier

### Funcionalidades Principais

- ✅ Cadastro e gestão de membros
- ✅ Controle de dízimos e ofertas
- ✅ Gestão de despesas por categoria
- ✅ Controle de saques bancários
- ✅ Relatórios financeiros em PDF
- ✅ Saldo inicial e controle de caixa
- ✅ Interface responsiva e moderna

## Estrutura do Projeto

```
2-corintios-9/
├── src/
│   ├── main/           # Backend (Electron Main Process)
│   └── renderer/       # Frontend (React)
├── assets/             # Recursos estáticos
├── .erb/              # Configurações Electron React Boilerplate
├── test/              # Testes unitários
├── release/           # Build de produção
└── docs/              # Documentação
    ├── frontend/      # Documentação do Frontend
    └── backend/       # Documentação do Backend
```

## Documentação Detalhada

### 📱 Frontend (React)
- [**Arquitetura Frontend**](./frontend/architecture.md) - Estrutura de componentes e organização
- [**Componentes**](./frontend/components.md) - Documentação dos componentes React
- [**Roteamento**](./frontend/routing.md) - Sistema de rotas e navegação
- [**Contextos**](./frontend/contexts.md) - Gerenciamento de estado global
- [**Estilos**](./frontend/styles.md) - TailwindCSS e customizações

### ⚙️ Backend (Electron)
- [**Arquitetura Backend**](./backend/architecture.md) - Estrutura do processo principal
- [**Banco de Dados**](./backend/database.md) - Esquema SQLite e repositories
- [**IPC Handlers**](./backend/ipc-handlers.md) - Comunicação entre processos
- [**Preload Scripts**](./backend/preload-scripts.md) - Scripts de pré-carregamento
- [**Utilitários**](./backend/utilities.md) - Funções auxiliares e helpers

## Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Comandos Principais

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm start

# Build de produção
npm run build

# Testes
npm test

# Linting
npm run lint
```

### Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Build completo (main + renderer)
- `npm run build:main` - Build apenas do processo principal
- `npm run build:renderer` - Build apenas do renderer
- `npm test` - Executa testes unitários
- `npm run test:dev` - Testes em modo watch
- `npm run lint` - Verificação de código

## Arquitetura Geral

### Comunicação IPC
A aplicação utiliza o sistema IPC (Inter-Process Communication) do Electron para comunicação segura entre o frontend (renderer) e backend (main process):

```
Renderer Process (React) ←→ Preload Scripts ←→ Main Process (Node.js)
```

### Fluxo de Dados
1. **Interface do usuário** (React) captura ações
2. **Preload handlers** fazem bridge segura via IPC
3. **Main process** processa lógica de negócio
4. **Repositories** interagem com SQLite
5. **Resposta** retorna via IPC para o frontend

### Segurança
- Context isolation habilitado
- Node integration desabilitado no renderer
- Preload scripts para exposição segura de APIs
- Validação de dados em ambos os processos

## Contribuição

### Padrões de Código
- TypeScript strict mode
- ESLint + Prettier para formatação
- Commits convencionais
- Testes unitários obrigatórios

### Estrutura de Commits
```
feat: nova funcionalidade
fix: correção de bug
refactor: refatoração
docs: documentação
test: testes
chore: manutenção
```

## Licença

MIT License - veja o arquivo [LICENSE](../LICENSE) para detalhes.

## Autor

**Diogo Sant'Anna**
- Email: diogosantanna08@gmail.com
- GitHub: [@dihsantanna](https://github.com/dihsantanna)

---

> "Cada um contribua segundo propôs no seu coração; não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria." - 2 Coríntios 9:7