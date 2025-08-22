# Regras do Projeto - 2ª Coríntios 9

## Documentação

### Manutenção Automática da Documentação

**REGRA CRÍTICA:** Sempre que qualquer alteração for feita no código que afete a estrutura, funcionalidade ou arquitetura da aplicação, a documentação correspondente DEVE ser atualizada imediatamente.

#### Gatilhos para Atualização da Documentação:

1. **Frontend (`src/renderer/`):**
   - Novos componentes → Atualizar `docs/frontend/components.md`
   - Mudanças em rotas → Atualizar `docs/frontend/routing.md`
   - Novos contextos/hooks → Atualizar `docs/frontend/contexts.md`
   - Alterações em estilos/tema → Atualizar `docs/frontend/styles.md`
   - Mudanças arquiteturais → Atualizar `docs/frontend/architecture.md`

2. **Backend (`src/main/`):**
   - Novos handlers IPC → Atualizar `docs/backend/ipc-handlers.md`
   - Mudanças no banco de dados → Atualizar `docs/backend/database.md`
   - Novos preload scripts → Atualizar `docs/backend/preload-scripts.md`
   - Novas utilidades → Atualizar `docs/backend/utilities.md`
   - Mudanças arquiteturais → Atualizar `docs/backend/architecture.md`

3. **Configurações e Deploy:**
   - Mudanças no build/deploy → Atualizar `docs/deployment.md`
   - Novos testes → Atualizar `docs/testing.md`

#### Processo de Atualização:

1. **Identificar Impacto:** Determine quais arquivos de documentação são afetados
2. **Atualizar Conteúdo:** Modifique a documentação para refletir as mudanças
3. **Verificar Consistência:** Garanta que todas as referências cruzadas estejam corretas
4. **Validar Exemplos:** Certifique-se de que exemplos de código ainda funcionam

### Importância da Documentação

A documentação em `docs/` é **ESSENCIAL** para:

- **Onboarding:** Novos desenvolvedores podem entender rapidamente a arquitetura
- **Manutenção:** Facilita correções e melhorias futuras
- **Evolução:** Permite implementações consistentes com a arquitetura existente
- **Debugging:** Ajuda na identificação rápida de problemas
- **Conhecimento:** Preserva decisões arquiteturais e padrões estabelecidos

### Padrões de Documentação

1. **Estrutura Consistente:** Todos os arquivos devem seguir o padrão estabelecido
2. **Diagramas:** Usar Mermaid para fluxos e arquiteturas complexas
3. **Links de Navegação:** Manter links para o índice principal em todos os arquivos
4. **Atualização de Data:** Incluir informações sobre quando foi atualizado

## Desenvolvimento

### Padrões de Código

1. **TypeScript:** Sempre usar TypeScript com tipagem estrita
2. **Modularização:** Arquivos não devem exceder 300 linhas
3. **Funções:** Máximo 50 linhas por função
4. **Nomenclatura:** Usar nomes auto-explicativos

### Estrutura de Arquivos

1. **Frontend:** Seguir estrutura em `src/renderer/`
2. **Backend:** Seguir estrutura em `src/main/`
3. **Testes:** Manter em `test/` com estrutura espelhada
4. **Documentação:** Manter em `docs/` organizada por área

---

**LEMBRETE:** Esta documentação é um ativo crítico do projeto. Mantê-la atualizada é responsabilidade de todos os desenvolvedores e essencial para o sucesso a longo prazo da aplicação.
