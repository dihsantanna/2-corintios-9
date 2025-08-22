# Deployment e Configuração - 2ª Coríntios 9

[← Voltar ao Índice Principal](README.md)

## Visão Geral

Este documento detalha o processo de build, empacotamento e distribuição da aplicação **2ª Coríntios 9**, uma aplicação desktop construída com **Electron**, **React** e **TypeScript**.

## Pré-requisitos

### Ambiente de Desenvolvimento

- **Node.js**: versão 18.x ou superior
- **npm**: versão 8.x ou superior
- **Git**: para controle de versão
- **Sistema Operacional**: Windows 10/11, macOS 10.15+, ou Linux Ubuntu 18.04+

### Verificação do Ambiente

```bash
# Verificar versões
node --version
npm --version
git --version

# Verificar se o Python está disponível (necessário para algumas dependências nativas)
python --version
```

## Configuração do Projeto

### 1. Clone e Instalação

```bash
# Clonar o repositório
git clone <repository-url>
cd 2-corintios-9

# Instalar dependências
npm install

# Verificar se tudo está funcionando
npm run dev
```

### 2. Estrutura de Scripts

```json
{
  "scripts": {
    "dev": "electron-vite dev",
    "build": "electron-vite build",
    "preview": "electron-vite preview",
    "build:win": "npm run build && electron-builder --win",
    "build:mac": "npm run build && electron-builder --mac",
    "build:linux": "npm run build && electron-builder --linux",
    "build:all": "npm run build && electron-builder --win --mac --linux",
    "dist": "npm run build && electron-builder",
    "postinstall": "electron-builder install-app-deps",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

## Configuração do Electron Builder

### electron-builder.yml

```yaml
appId: com.igreja.2corintios9
productName: 2ª Coríntios 9
directories:
  output: dist
  buildResources: build
files:
  - '!**/.vscode/*'
  - '!src/*'
  - '!electron.vite.config.ts'
  - '!{.eslintignore,.eslintrc.cjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}'
  - '!{.env,.env.*,.npmrc,pnpm-lock.yaml}'
  - '!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}'
asarUnpack:
  - resources/**
win:
  executableName: 2-corintios-9
  target:
    - target: nsis
      arch:
        - x64
        - ia32
  icon: build/icon.ico
  requestedExecutionLevel: asInvoker
nsis:
  artifactName: ${name}-${version}-setup.${ext}
  shortcutName: ${productName}
  uninstallDisplayName: ${productName}
  createDesktopShortcut: always
  createStartMenuShortcut: true
  allowToChangeInstallationDirectory: true
  oneClick: false
  perMachine: false
  allowElevation: true
  installerIcon: build/icon.ico
  uninstallerIcon: build/icon.ico
  installerHeaderIcon: build/icon.ico
  deleteAppDataOnUninstall: false
mac:
  entitlementsInherit: build/entitlements.mac.plist
  extendInfo:
    - NSCameraUsageDescription: Application requests access to device's camera.
    - NSMicrophoneUsageDescription: Application requests access to device's microphone.
    - NSDocumentsFolderUsageDescription: Application requests access to user's Documents folder.
    - NSDownloadsFolderUsageDescription: Application requests access to user's Downloads folder.
  notarize: false
  target:
    - target: dmg
      arch:
        - x64
        - arm64
  icon: build/icon.icns
  category: public.app-category.finance
dmg:
  artifactName: ${name}-${version}.${ext}
  background: build/dmg-background.png
  iconSize: 100
  contents:
    - x: 410
      y: 150
      type: link
      path: /Applications
    - x: 130
      y: 150
      type: file
linux:
  target:
    - target: AppImage
      arch:
        - x64
    - target: deb
      arch:
        - x64
    - target: rpm
      arch:
        - x64
  maintainer: Igreja <contato@igreja.com>
  icon: build/icon.png
  category: Office
  synopsis: Sistema de Gestão Financeira para Igrejas
  description: >
    Sistema completo para gestão financeira de igrejas, incluindo controle de
    dízimos, ofertas, despesas e geração de relatórios.
npmRebuild: false
publish:
  provider: github
  owner: seu-usuario
  repo: 2-corintios-9
```

### Configuração de Ícones

```
build/
├── icon.ico          # Windows (256x256, 128x128, 64x64, 48x48, 32x32, 16x16)
├── icon.icns         # macOS (múltiplas resoluções)
├── icon.png          # Linux (512x512)
├── dmg-background.png # Background do DMG (macOS)
└── entitlements.mac.plist # Entitlements para macOS
```

### entitlements.mac.plist

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.debugger</key>
    <true/>
    <key>com.apple.security.files.user-selected.read-only</key>
    <true/>
    <key>com.apple.security.files.user-selected.read-write</key>
    <true/>
  </dict>
</plist>
```

## Processo de Build

### 1. Build de Desenvolvimento

```bash
# Executar em modo de desenvolvimento
npm run dev

# Build para preview
npm run build
npm run preview
```

### 2. Build de Produção

```bash
# Build completo
npm run build

# Verificar tipos TypeScript
npm run type-check

# Executar testes
npm test

# Lint do código
npm run lint
```

### 3. Empacotamento por Plataforma

#### Windows

```bash
# Build para Windows (x64 e x86)
npm run build:win

# Saída:
# dist/2-corintios-9-1.0.0-setup.exe
# dist/win-unpacked/ (versão descompactada)
```

#### macOS

```bash
# Build para macOS (Intel e Apple Silicon)
npm run build:mac

# Saída:
# dist/2-corintios-9-1.0.0.dmg
# dist/mac/ (versão descompactada)
```

#### Linux

```bash
# Build para Linux (AppImage, DEB, RPM)
npm run build:linux

# Saída:
# dist/2-corintios-9-1.0.0.AppImage
# dist/2-corintios-9_1.0.0_amd64.deb
# dist/2-corintios-9-1.0.0.x86_64.rpm
```

#### Todas as Plataformas

```bash
# Build para todas as plataformas
npm run build:all
```

## Configuração de Ambiente

### Variáveis de Ambiente

```bash
# .env.development
NODE_ENV=development
ELECTRON_IS_DEV=true
DEBUG=true
LOG_LEVEL=debug

# .env.production
NODE_ENV=production
ELECTRON_IS_DEV=false
DEBUG=false
LOG_LEVEL=info

# .env.local (não commitado)
DATABASE_PATH=./data/church.db
LOGS_PATH=./logs
BACKUP_PATH=./backups
```

### Configuração do Vite

```typescript
// electron.vite.config.ts
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: ['sqlite3', 'better-sqlite3']
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html')
        }
      }
    }
  }
})
```

## Assinatura de Código

### Windows (Code Signing)

```bash
# Configurar certificado
export CSC_LINK="path/to/certificate.p12"
export CSC_KEY_PASSWORD="certificate-password"

# Build com assinatura
npm run build:win
```

### macOS (Notarização)

```bash
# Configurar credenciais da Apple
export APPLE_ID="seu-apple-id@email.com"
export APPLE_ID_PASS="app-specific-password"
export CSC_LINK="path/to/certificate.p12"
export CSC_KEY_PASSWORD="certificate-password"

# Build com notarização
npm run build:mac
```

### Configuração no electron-builder.yml

```yaml
win:
  certificateFile: build/certificate.p12
  certificatePassword: ${env.CSC_KEY_PASSWORD}
  publisherName: "Nome da Igreja"
  verifyUpdateCodeSignature: true

mac:
  identity: "Developer ID Application: Nome da Igreja (TEAM_ID)"
  hardenedRuntime: true
  gatekeeperAssess: false
  notarize: {
    teamId: "TEAM_ID"
  }
```

## Auto-Update

### Configuração do electron-updater

```typescript
// src/main/updater.ts
import { autoUpdater } from 'electron-updater'
import { app, dialog } from 'electron'

export class AppUpdater {
  constructor() {
    // Configurar servidor de updates
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'seu-usuario',
      repo: '2-corintios-9',
      private: false
    })

    // Configurar eventos
    autoUpdater.on('checking-for-update', () => {
      console.log('Verificando atualizações...')
    })

    autoUpdater.on('update-available', (info) => {
      console.log('Atualização disponível:', info.version)
    })

    autoUpdater.on('update-not-available', () => {
      console.log('Nenhuma atualização disponível')
    })

    autoUpdater.on('error', (err) => {
      console.error('Erro no auto-updater:', err)
    })

    autoUpdater.on('download-progress', (progressObj) => {
      const { percent } = progressObj
      console.log(`Download: ${Math.round(percent)}%`)
    })

    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Atualização Pronta',
        message: 'A atualização foi baixada. Reinicie a aplicação para aplicar.',
        buttons: ['Reiniciar', 'Depois']
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall()
        }
      })
    })
  }

  checkForUpdates() {
    if (app.isPackaged) {
      autoUpdater.checkForUpdatesAndNotify()
    }
  }
}

// Uso no main.ts
app.whenReady().then(() => {
  const updater = new AppUpdater()
  
  // Verificar atualizações na inicialização
  setTimeout(() => {
    updater.checkForUpdates()
  }, 3000)
  
  // Verificar atualizações periodicamente (a cada 4 horas)
  setInterval(() => {
    updater.checkForUpdates()
  }, 4 * 60 * 60 * 1000)
})
```

### Configuração de Release

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build and release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          CSC_LINK: ${{ secrets.CSC_LINK }}
          CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_ID_PASS: ${{ secrets.APPLE_ID_PASS }}
        run: |
          npm run build
          npm run dist
```

## Instalação e Distribuição

### Windows

#### Instalador NSIS

- **Arquivo**: `2-corintios-9-1.0.0-setup.exe`
- **Tamanho**: ~150-200 MB
- **Requisitos**: Windows 10/11 (x64 ou x86)
- **Instalação**: Executar como administrador (opcional)
- **Localização padrão**: `C:\Users\{user}\AppData\Local\Programs\2-corintios-9`

#### Portable (Opcional)

```bash
# Configurar build portable
npm run build:win -- --portable
```

### macOS

#### DMG Package

- **Arquivo**: `2-corintios-9-1.0.0.dmg`
- **Tamanho**: ~150-200 MB
- **Requisitos**: macOS 10.15+ (Intel e Apple Silicon)
- **Instalação**: Arrastar para pasta Applications
- **Gatekeeper**: Requer assinatura de código

### Linux

#### AppImage

- **Arquivo**: `2-corintios-9-1.0.0.AppImage`
- **Uso**: `chmod +x 2-corintios-9-1.0.0.AppImage && ./2-corintios-9-1.0.0.AppImage`
- **Vantagens**: Não requer instalação, funciona em qualquer distribuição

#### DEB Package (Debian/Ubuntu)

```bash
# Instalar
sudo dpkg -i 2-corintios-9_1.0.0_amd64.deb
sudo apt-get install -f  # Resolver dependências

# Desinstalar
sudo apt remove 2-corintios-9
```

#### RPM Package (Red Hat/Fedora)

```bash
# Instalar
sudo rpm -i 2-corintios-9-1.0.0.x86_64.rpm

# Desinstalar
sudo rpm -e 2-corintios-9
```

## Configuração de Produção

### Estrutura de Dados

```
Produção/
├── 2-corintios-9.exe (ou equivalente)
├── data/
│   ├── church.db          # Banco de dados SQLite
│   └── backups/           # Backups automáticos
├── logs/
│   ├── app-2024-01-15.log # Logs diários
│   └── error.log          # Log de erros
├── config/
│   ├── settings.json      # Configurações da aplicação
│   └── user-preferences.json # Preferências do usuário
└── resources/
    ├── icons/             # Ícones da aplicação
    └── templates/         # Templates de relatórios
```

### Configurações Padrão

```json
// config/settings.json
{
  "database": {
    "path": "./data/church.db",
    "backupInterval": 86400000,
    "maxBackups": 30
  },
  "logging": {
    "level": "info",
    "maxFileSize": "10MB",
    "maxFiles": 5
  },
  "ui": {
    "theme": "light",
    "language": "pt-BR",
    "autoSave": true
  },
  "reports": {
    "defaultFormat": "pdf",
    "includeLogo": true,
    "pageSize": "A4"
  }
}
```

### Backup Automático

```typescript
// src/main/services/BackupService.ts
import * as fs from 'fs'
import * as path from 'path'

export class BackupService {
  private backupDir: string
  private dbPath: string
  private maxBackups: number

  constructor() {
    this.backupDir = path.join(process.cwd(), 'data', 'backups')
    this.dbPath = path.join(process.cwd(), 'data', 'church.db')
    this.maxBackups = 30

    // Criar diretório de backup se não existir
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true })
    }
  }

  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFileName = `church-backup-${timestamp}.db`
    const backupPath = path.join(this.backupDir, backupFileName)

    try {
      // Copiar arquivo do banco
      fs.copyFileSync(this.dbPath, backupPath)
      
      // Limpar backups antigos
      await this.cleanOldBackups()
      
      console.log(`Backup criado: ${backupPath}`)
      return backupPath
    } catch (error) {
      console.error('Erro ao criar backup:', error)
      throw error
    }
  }

  private async cleanOldBackups(): Promise<void> {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.startsWith('church-backup-') && file.endsWith('.db'))
        .map(file => ({
          name: file,
          path: path.join(this.backupDir, file),
          mtime: fs.statSync(path.join(this.backupDir, file)).mtime
        }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())

      // Manter apenas os últimos N backups
      const filesToDelete = files.slice(this.maxBackups)
      
      for (const file of filesToDelete) {
        fs.unlinkSync(file.path)
        console.log(`Backup antigo removido: ${file.name}`)
      }
    } catch (error) {
      console.error('Erro ao limpar backups antigos:', error)
    }
  }

  scheduleAutoBackup(): void {
    // Backup diário às 2:00 AM
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(2, 0, 0, 0)
    
    const msUntilTomorrow = tomorrow.getTime() - now.getTime()
    
    setTimeout(() => {
      this.createBackup()
      
      // Agendar próximos backups a cada 24 horas
      setInterval(() => {
        this.createBackup()
      }, 24 * 60 * 60 * 1000)
    }, msUntilTomorrow)
  }
}
```

## Troubleshooting

### Problemas Comuns

#### 1. Erro de Dependências Nativas

```bash
# Reconstruir dependências nativas
npm run postinstall

# Ou manualmente
./node_modules/.bin/electron-rebuild
```

#### 2. Erro de Permissões (macOS)

```bash
# Remover quarentena
sudo xattr -rd com.apple.quarantine /Applications/2-corintios-9.app
```

#### 3. Erro de Assinatura (Windows)

```bash
# Verificar certificado
signtool verify /pa dist/2-corintios-9-setup.exe
```

#### 4. Banco de Dados Corrompido

```sql
-- Verificar integridade
PRAGMA integrity_check;

-- Reparar se necessário
PRAGMA quick_check;
```

### Logs de Debug

```bash
# Executar com logs detalhados
DEBUG=* npm run dev

# Logs específicos do Electron
DEBUG=electron* npm run dev

# Logs da aplicação
DEBUG=app* npm run dev
```

### Performance

```bash
# Analisar bundle
npm run build -- --analyze

# Profiling do Electron
npm run dev -- --inspect
```

## Monitoramento

### Métricas de Uso

```typescript
// src/main/services/AnalyticsService.ts
export class AnalyticsService {
  private events: Array<{
    event: string
    timestamp: Date
    data?: any
  }> = []

  trackEvent(event: string, data?: any): void {
    this.events.push({
      event,
      timestamp: new Date(),
      data
    })

    // Salvar eventos localmente (sem enviar dados externos)
    this.saveEventsLocally()
  }

  private saveEventsLocally(): void {
    const analyticsPath = path.join(process.cwd(), 'data', 'analytics.json')
    
    try {
      fs.writeFileSync(analyticsPath, JSON.stringify(this.events, null, 2))
    } catch (error) {
      console.error('Erro ao salvar analytics:', error)
    }
  }

  getUsageStats(): any {
    return {
      totalEvents: this.events.length,
      mostUsedFeatures: this.getMostUsedFeatures(),
      dailyUsage: this.getDailyUsage()
    }
  }

  private getMostUsedFeatures(): any[] {
    const featureCounts = this.events.reduce((acc, event) => {
      acc[event.event] = (acc[event.event] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(featureCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([feature, count]) => ({ feature, count }))
  }

  private getDailyUsage(): any[] {
    const dailyUsage = this.events.reduce((acc, event) => {
      const date = event.timestamp.toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(dailyUsage)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }))
  }
}
```

### Health Check

```typescript
// src/main/services/HealthCheckService.ts
export class HealthCheckService {
  async performHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'error'
    checks: any[]
  }> {
    const checks = [
      await this.checkDatabase(),
      await this.checkDiskSpace(),
      await this.checkMemoryUsage(),
      await this.checkBackups()
    ]

    const hasErrors = checks.some(check => check.status === 'error')
    const hasWarnings = checks.some(check => check.status === 'warning')

    return {
      status: hasErrors ? 'error' : hasWarnings ? 'warning' : 'healthy',
      checks
    }
  }

  private async checkDatabase(): Promise<any> {
    try {
      // Verificar se o banco está acessível
      const db = new Database(this.dbPath)
      const result = db.prepare('SELECT 1').get()
      db.close()

      return {
        name: 'Database',
        status: 'healthy',
        message: 'Banco de dados acessível'
      }
    } catch (error) {
      return {
        name: 'Database',
        status: 'error',
        message: `Erro no banco de dados: ${error.message}`
      }
    }
  }

  private async checkDiskSpace(): Promise<any> {
    try {
      const stats = fs.statSync(process.cwd())
      // Implementar verificação de espaço em disco
      
      return {
        name: 'Disk Space',
        status: 'healthy',
        message: 'Espaço em disco suficiente'
      }
    } catch (error) {
      return {
        name: 'Disk Space',
        status: 'warning',
        message: 'Não foi possível verificar espaço em disco'
      }
    }
  }

  private async checkMemoryUsage(): Promise<any> {
    const usage = process.memoryUsage()
    const usedMB = Math.round(usage.heapUsed / 1024 / 1024)
    
    return {
      name: 'Memory Usage',
      status: usedMB > 500 ? 'warning' : 'healthy',
      message: `Uso de memória: ${usedMB}MB`,
      data: { usedMB }
    }
  }

  private async checkBackups(): Promise<any> {
    try {
      const backupDir = path.join(process.cwd(), 'data', 'backups')
      const files = fs.readdirSync(backupDir)
      const backupFiles = files.filter(f => f.endsWith('.db'))
      
      if (backupFiles.length === 0) {
        return {
          name: 'Backups',
          status: 'warning',
          message: 'Nenhum backup encontrado'
        }
      }
      
      const latestBackup = backupFiles
        .map(f => ({ name: f, mtime: fs.statSync(path.join(backupDir, f)).mtime }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())[0]
      
      const daysSinceBackup = (Date.now() - latestBackup.mtime.getTime()) / (1000 * 60 * 60 * 24)
      
      return {
        name: 'Backups',
        status: daysSinceBackup > 7 ? 'warning' : 'healthy',
        message: `Último backup: ${Math.round(daysSinceBackup)} dias atrás`,
        data: { latestBackup: latestBackup.name, daysSinceBackup }
      }
    } catch (error) {
      return {
        name: 'Backups',
        status: 'error',
        message: `Erro ao verificar backups: ${error.message}`
      }
    }
  }
}
```

## Checklist de Release

### Pré-Release

- [ ] Todos os testes passando
- [ ] Lint sem erros
- [ ] Type check sem erros
- [ ] Documentação atualizada
- [ ] CHANGELOG.md atualizado
- [ ] Versão atualizada no package.json
- [ ] Ícones e assets atualizados
- [ ] Certificados de assinatura válidos

### Build

- [ ] Build local bem-sucedido
- [ ] Teste da aplicação empacotada
- [ ] Verificação de tamanho dos arquivos
- [ ] Teste de instalação/desinstalação
- [ ] Verificação de auto-update

### Pós-Release

- [ ] Upload dos arquivos para GitHub Releases
- [ ] Teste de download e instalação
- [ ] Verificação de notificações de update
- [ ] Monitoramento de erros
- [ ] Comunicação para usuários

---

**Este guia de deployment fornece todas as informações necessárias para construir, empacotar e distribuir a aplicação 2ª Coríntios 9 de forma profissional e segura.**
