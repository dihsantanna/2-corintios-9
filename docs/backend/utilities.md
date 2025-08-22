# Utilitários do Backend - Funções de Apoio

[← Voltar ao Índice Principal](../README.md)

## Visão Geral

Os **Utilitários do Backend** são funções e classes auxiliares que fornecem funcionalidades comuns e reutilizáveis em toda a aplicação. Eles incluem logging, validação, formatação, criptografia, manipulação de arquivos e outras operações de suporte.

## Sistema de Logging

### Logger Principal

```typescript
// src/main/utils/logger.ts
import { app } from 'electron'
import path from 'path'
import fs from 'fs/promises'
import { createWriteStream, WriteStream } from 'fs'

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  data?: any
  source?: string
  stack?: string
}

export interface LoggerConfig {
  level: LogLevel
  maxFileSize: number // bytes
  maxFiles: number
  logDirectory: string
  enableConsole: boolean
  enableFile: boolean
}

export class Logger {
  private config: LoggerConfig
  private fileStream: WriteStream | null = null
  private currentLogFile: string | null = null
  private logQueue: LogEntry[] = []
  private isWriting = false

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: LogLevel.INFO,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      logDirectory: path.join(app.getPath('userData'), 'logs'),
      enableConsole: true,
      enableFile: true,
      ...config
    }

    this.initializeLogger()
  }

  private async initializeLogger(): Promise<void> {
    try {
      // Criar diretório de logs se não existir
      await fs.mkdir(this.config.logDirectory, { recursive: true })
      
      // Configurar arquivo de log
      if (this.config.enableFile) {
        await this.setupLogFile()
      }
      
      // Limpar logs antigos
      await this.cleanupOldLogs()
    } catch (error) {
      console.error('Failed to initialize logger:', error)
    }
  }

  private async setupLogFile(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    this.currentLogFile = path.join(
      this.config.logDirectory,
      `app-${timestamp}.log`
    )

    this.fileStream = createWriteStream(this.currentLogFile, { flags: 'a' })
    
    this.fileStream.on('error', (error) => {
      console.error('Log file stream error:', error)
    })
  }

  private async cleanupOldLogs(): Promise<void> {
    try {
      const files = await fs.readdir(this.config.logDirectory)
      const logFiles = files
        .filter(file => file.startsWith('app-') && file.endsWith('.log'))
        .map(file => ({
          name: file,
          path: path.join(this.config.logDirectory, file)
        }))
        .sort((a, b) => b.name.localeCompare(a.name)) // Mais recente primeiro

      // Remover arquivos excedentes
      if (logFiles.length > this.config.maxFiles) {
        const filesToDelete = logFiles.slice(this.config.maxFiles)
        
        for (const file of filesToDelete) {
          await fs.unlink(file.path)
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old logs:', error)
    }
  }

  private async checkFileRotation(): Promise<void> {
    if (!this.currentLogFile || !this.fileStream) return

    try {
      const stats = await fs.stat(this.currentLogFile)
      
      if (stats.size >= this.config.maxFileSize) {
        // Fechar stream atual
        this.fileStream.end()
        
        // Criar novo arquivo
        await this.setupLogFile()
        
        // Limpar logs antigos
        await this.cleanupOldLogs()
      }
    } catch (error) {
      console.error('Failed to check file rotation:', error)
    }
  }

  private formatLogEntry(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString()
    const level = LogLevel[entry.level].padEnd(5)
    const source = entry.source ? `[${entry.source}]` : ''
    const message = entry.message
    const data = entry.data ? ` | Data: ${JSON.stringify(entry.data)}` : ''
    const stack = entry.stack ? `\n${entry.stack}` : ''

    return `${timestamp} ${level} ${source} ${message}${data}${stack}\n`
  }

  private async writeToFile(entry: LogEntry): Promise<void> {
    if (!this.config.enableFile || !this.fileStream) return

    const formatted = this.formatLogEntry(entry)
    
    return new Promise((resolve, reject) => {
      this.fileStream!.write(formatted, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  private writeToConsole(entry: LogEntry): void {
    if (!this.config.enableConsole) return

    const timestamp = entry.timestamp.toLocaleTimeString()
    const source = entry.source ? `[${entry.source}]` : ''
    const message = `${timestamp} ${source} ${entry.message}`

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message, entry.data || '')
        break
      case LogLevel.INFO:
        console.info(message, entry.data || '')
        break
      case LogLevel.WARN:
        console.warn(message, entry.data || '')
        break
      case LogLevel.ERROR:
        console.error(message, entry.data || '')
        if (entry.stack) {
          console.error(entry.stack)
        }
        break
    }
  }

  private async processLogQueue(): Promise<void> {
    if (this.isWriting || this.logQueue.length === 0) return

    this.isWriting = true

    try {
      while (this.logQueue.length > 0) {
        const entry = this.logQueue.shift()!
        
        // Escrever no console
        this.writeToConsole(entry)
        
        // Escrever no arquivo
        if (this.config.enableFile) {
          await this.writeToFile(entry)
          await this.checkFileRotation()
        }
      }
    } catch (error) {
      console.error('Error processing log queue:', error)
    } finally {
      this.isWriting = false
    }
  }

  private log(level: LogLevel, message: string, data?: any, source?: string): void {
    if (level < this.config.level) return

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
      source
    }

    // Capturar stack trace para erros
    if (level === LogLevel.ERROR) {
      const error = new Error()
      entry.stack = error.stack
    }

    this.logQueue.push(entry)
    
    // Processar queue de forma assíncrona
    setImmediate(() => this.processLogQueue())
  }

  debug(message: string, data?: any, source?: string): void {
    this.log(LogLevel.DEBUG, message, data, source)
  }

  info(message: string, data?: any, source?: string): void {
    this.log(LogLevel.INFO, message, data, source)
  }

  warn(message: string, data?: any, source?: string): void {
    this.log(LogLevel.WARN, message, data, source)
  }

  error(message: string, data?: any, source?: string): void {
    this.log(LogLevel.ERROR, message, data, source)
  }

  async getLogs(level?: LogLevel, limit?: number): Promise<LogEntry[]> {
    // Implementar leitura de logs dos arquivos
    // Esta é uma implementação simplificada
    return []
  }

  async clearLogs(): Promise<void> {
    try {
      const files = await fs.readdir(this.config.logDirectory)
      const logFiles = files.filter(file => file.endsWith('.log'))
      
      for (const file of logFiles) {
        await fs.unlink(path.join(this.config.logDirectory, file))
      }
      
      // Recriar arquivo de log atual
      if (this.config.enableFile) {
        if (this.fileStream) {
          this.fileStream.end()
        }
        await this.setupLogFile()
      }
    } catch (error) {
      this.error('Failed to clear logs', error)
    }
  }

  async exportLogs(filePath: string): Promise<boolean> {
    try {
      const files = await fs.readdir(this.config.logDirectory)
      const logFiles = files
        .filter(file => file.endsWith('.log'))
        .sort()

      const exportStream = createWriteStream(filePath)
      
      for (const file of logFiles) {
        const content = await fs.readFile(
          path.join(this.config.logDirectory, file),
          'utf-8'
        )
        exportStream.write(`\n=== ${file} ===\n`)
        exportStream.write(content)
      }
      
      exportStream.end()
      
      return true
    } catch (error) {
      this.error('Failed to export logs', error)
      return false
    }
  }

  setLevel(level: LogLevel): void {
    this.config.level = level
  }

  getLevel(): LogLevel {
    return this.config.level
  }

  async close(): Promise<void> {
    // Processar queue restante
    await this.processLogQueue()
    
    // Fechar stream de arquivo
    if (this.fileStream) {
      return new Promise((resolve) => {
        this.fileStream!.end(() => {
          resolve()
        })
      })
    }
  }
}

// Instância global do logger
export const logger = new Logger()
```

## Validação e Sanitização

### Validadores Comuns

```typescript
// src/main/utils/validators.ts
import { ValidationError } from '../types/errors'

export class Validators {
  // Validação de email
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validação de telefone brasileiro
  static isValidBrazilianPhone(phone: string): boolean {
    const phoneRegex = /^\(?\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4}$/
    return phoneRegex.test(phone)
  }

  // Validação de CPF
  static isValidCPF(cpf: string): boolean {
    const cleanCPF = cpf.replace(/[^\d]/g, '')
    
    if (cleanCPF.length !== 11) return false
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false
    
    // Validar dígitos verificadores
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF[i]) * (10 - i)
    }
    
    let digit1 = 11 - (sum % 11)
    if (digit1 > 9) digit1 = 0
    
    if (parseInt(cleanCPF[9]) !== digit1) return false
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF[i]) * (11 - i)
    }
    
    let digit2 = 11 - (sum % 11)
    if (digit2 > 9) digit2 = 0
    
    return parseInt(cleanCPF[10]) === digit2
  }

  // Validação de CNPJ
  static isValidCNPJ(cnpj: string): boolean {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '')
    
    if (cleanCNPJ.length !== 14) return false
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false
    
    // Validar primeiro dígito verificador
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    let sum = 0
    
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanCNPJ[i]) * weights1[i]
    }
    
    let digit1 = sum % 11
    digit1 = digit1 < 2 ? 0 : 11 - digit1
    
    if (parseInt(cleanCNPJ[12]) !== digit1) return false
    
    // Validar segundo dígito verificador
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    sum = 0
    
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanCNPJ[i]) * weights2[i]
    }
    
    let digit2 = sum % 11
    digit2 = digit2 < 2 ? 0 : 11 - digit2
    
    return parseInt(cleanCNPJ[13]) === digit2
  }

  // Validação de data
  static isValidDate(date: any): boolean {
    if (!date) return false
    
    const parsedDate = new Date(date)
    return !isNaN(parsedDate.getTime())
  }

  // Validação de range de datas
  static isValidDateRange(startDate: any, endDate: any): boolean {
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
      return false
    }
    
    return new Date(startDate) <= new Date(endDate)
  }

  // Validação de valor monetário
  static isValidMonetaryValue(value: any): boolean {
    const num = Number(value)
    return Number.isFinite(num) && num >= 0
  }

  // Validação de string não vazia
  static isNonEmptyString(value: any, minLength = 1): boolean {
    return typeof value === 'string' && value.trim().length >= minLength
  }

  // Validação de ID
  static isValidId(id: any): boolean {
    const num = Number(id)
    return Number.isInteger(num) && num > 0
  }

  // Validação de array não vazio
  static isNonEmptyArray(value: any): boolean {
    return Array.isArray(value) && value.length > 0
  }

  // Validação personalizada com regex
  static matchesPattern(value: string, pattern: RegExp): boolean {
    return pattern.test(value)
  }

  // Validação de comprimento de string
  static hasValidLength(value: string, min: number, max: number): boolean {
    const length = value.trim().length
    return length >= min && length <= max
  }
}

// Sanitizadores
export class Sanitizers {
  // Limpar string removendo caracteres especiais
  static cleanString(value: string): string {
    return value.trim().replace(/[<>"'&]/g, '')
  }

  // Limpar telefone mantendo apenas números
  static cleanPhone(phone: string): string {
    return phone.replace(/[^\d]/g, '')
  }

  // Limpar CPF/CNPJ mantendo apenas números
  static cleanDocument(document: string): string {
    return document.replace(/[^\d]/g, '')
  }

  // Limpar email
  static cleanEmail(email: string): string {
    return email.trim().toLowerCase()
  }

  // Limpar valor monetário
  static cleanMonetaryValue(value: string): number {
    const cleaned = value.replace(/[^\d.,]/g, '')
    const normalized = cleaned.replace(',', '.')
    return parseFloat(normalized) || 0
  }

  // Escapar HTML
  static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }
    
    return text.replace(/[&<>"']/g, (m) => map[m])
  }

  // Remover caracteres de controle
  static removeControlCharacters(text: string): string {
    return text.replace(/[\x00-\x1F\x7F]/g, '')
  }
}
```

## Formatadores

### Formatação de Dados

```typescript
// src/main/utils/formatters.ts
export class Formatters {
  // Formatar valor monetário para BRL
  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  // Formatar número com separadores
  static formatNumber(value: number, decimals = 2): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value)
  }

  // Formatar data para padrão brasileiro
  static formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR').format(date)
  }

  // Formatar data e hora
  static formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }

  // Formatar telefone brasileiro
  static formatPhone(phone: string): string {
    const cleaned = phone.replace(/[^\d]/g, '')
    
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    }
    
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
    
    return phone
  }

  // Formatar CPF
  static formatCPF(cpf: string): string {
    const cleaned = cpf.replace(/[^\d]/g, '')
    
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
    }
    
    return cpf
  }

  // Formatar CNPJ
  static formatCNPJ(cnpj: string): string {
    const cleaned = cnpj.replace(/[^\d]/g, '')
    
    if (cleaned.length === 14) {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`
    }
    
    return cnpj
  }

  // Formatar CEP
  static formatCEP(cep: string): string {
    const cleaned = cep.replace(/[^\d]/g, '')
    
    if (cleaned.length === 8) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
    }
    
    return cep
  }

  // Formatar nome próprio (primeira letra maiúscula)
  static formatProperName(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => {
        if (word.length <= 2 && ['de', 'da', 'do', 'das', 'dos', 'e'].includes(word)) {
          return word
        }
        return word.charAt(0).toUpperCase() + word.slice(1)
      })
      .join(' ')
  }

  // Formatar porcentagem
  static formatPercentage(value: number, decimals = 1): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value / 100)
  }

  // Truncar texto
  static truncateText(text: string, maxLength: number, suffix = '...'): string {
    if (text.length <= maxLength) return text
    
    return text.slice(0, maxLength - suffix.length) + suffix
  }

  // Formatar duração em milissegundos
  static formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`
    }
    
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    }
    
    return `${seconds}s`
  }

  // Formatar tamanho de arquivo
  static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }
}
```

## Utilitários de Arquivo

### File Utils

```typescript
// src/main/utils/file-utils.ts
import fs from 'fs/promises'
import path from 'path'
import { createReadStream, createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { app } from 'electron'

export class FileUtils {
  // Verificar se arquivo existe
  static async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }

  // Criar diretório recursivamente
  static async ensureDir(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true })
  }

  // Copiar arquivo
  static async copyFile(source: string, destination: string): Promise<void> {
    await this.ensureDir(path.dirname(destination))
    await fs.copyFile(source, destination)
  }

  // Mover arquivo
  static async moveFile(source: string, destination: string): Promise<void> {
    await this.ensureDir(path.dirname(destination))
    await fs.rename(source, destination)
  }

  // Deletar arquivo
  static async deleteFile(filePath: string): Promise<void> {
    if (await this.exists(filePath)) {
      await fs.unlink(filePath)
    }
  }

  // Deletar diretório recursivamente
  static async deleteDir(dirPath: string): Promise<void> {
    if (await this.exists(dirPath)) {
      await fs.rm(dirPath, { recursive: true, force: true })
    }
  }

  // Obter informações do arquivo
  static async getFileInfo(filePath: string): Promise<{
    size: number
    created: Date
    modified: Date
    isDirectory: boolean
    isFile: boolean
  }> {
    const stats = await fs.stat(filePath)
    
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile()
    }
  }

  // Listar arquivos em diretório
  static async listFiles(
    dirPath: string,
    options: {
      recursive?: boolean
      extensions?: string[]
      includeHidden?: boolean
    } = {}
  ): Promise<string[]> {
    const { recursive = false, extensions, includeHidden = false } = options
    const files: string[] = []
    
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      
      // Pular arquivos ocultos se não incluir
      if (!includeHidden && entry.name.startsWith('.')) {
        continue
      }
      
      if (entry.isDirectory() && recursive) {
        const subFiles = await this.listFiles(fullPath, options)
        files.push(...subFiles)
      } else if (entry.isFile()) {
        // Filtrar por extensões se especificado
        if (extensions) {
          const ext = path.extname(entry.name).toLowerCase()
          if (extensions.includes(ext)) {
            files.push(fullPath)
          }
        } else {
          files.push(fullPath)
        }
      }
    }
    
    return files
  }

  // Ler arquivo JSON
  static async readJSON<T = any>(filePath: string): Promise<T> {
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  }

  // Escrever arquivo JSON
  static async writeJSON(filePath: string, data: any, pretty = true): Promise<void> {
    await this.ensureDir(path.dirname(filePath))
    const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data)
    await fs.writeFile(filePath, content, 'utf-8')
  }

  // Fazer backup de arquivo
  static async backupFile(filePath: string, backupDir?: string): Promise<string> {
    const fileName = path.basename(filePath)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFileName = `${path.parse(fileName).name}-${timestamp}${path.extname(fileName)}`
    
    const backupPath = backupDir 
      ? path.join(backupDir, backupFileName)
      : path.join(path.dirname(filePath), 'backups', backupFileName)
    
    await this.copyFile(filePath, backupPath)
    return backupPath
  }

  // Compactar arquivo usando streams
  static async compressFile(source: string, destination: string): Promise<void> {
    const zlib = await import('zlib')
    
    await pipeline(
      createReadStream(source),
      zlib.createGzip(),
      createWriteStream(destination)
    )
  }

  // Descompactar arquivo
  static async decompressFile(source: string, destination: string): Promise<void> {
    const zlib = await import('zlib')
    
    await pipeline(
      createReadStream(source),
      zlib.createGunzip(),
      createWriteStream(destination)
    )
  }

  // Obter caminhos da aplicação
  static getAppPaths(): {
    userData: string
    documents: string
    downloads: string
    desktop: string
    temp: string
    logs: string
    database: string
    backups: string
  } {
    const userData = app.getPath('userData')
    
    return {
      userData,
      documents: app.getPath('documents'),
      downloads: app.getPath('downloads'),
      desktop: app.getPath('desktop'),
      temp: app.getPath('temp'),
      logs: path.join(userData, 'logs'),
      database: path.join(userData, 'database'),
      backups: path.join(userData, 'backups')
    }
  }

  // Gerar nome de arquivo único
  static generateUniqueFileName(baseName: string, extension: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `${baseName}-${timestamp}-${random}.${extension}`
  }

  // Validar caminho de arquivo
  static isValidPath(filePath: string): boolean {
    try {
      path.parse(filePath)
      return true
    } catch {
      return false
    }
  }

  // Obter extensão de arquivo
  static getFileExtension(filePath: string): string {
    return path.extname(filePath).toLowerCase().substring(1)
  }

  // Verificar se é arquivo de imagem
  static isImageFile(filePath: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
    return imageExtensions.includes(this.getFileExtension(filePath))
  }

  // Verificar se é arquivo de documento
  static isDocumentFile(filePath: string): boolean {
    const docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf']
    return docExtensions.includes(this.getFileExtension(filePath))
  }
}
```

## Utilitários de Data

### Date Utils

```typescript
// src/main/utils/date-utils.ts
export class DateUtils {
  // Obter início do dia
  static startOfDay(date: Date): Date {
    const result = new Date(date)
    result.setHours(0, 0, 0, 0)
    return result
  }

  // Obter fim do dia
  static endOfDay(date: Date): Date {
    const result = new Date(date)
    result.setHours(23, 59, 59, 999)
    return result
  }

  // Obter início do mês
  static startOfMonth(date: Date): Date {
    const result = new Date(date)
    result.setDate(1)
    result.setHours(0, 0, 0, 0)
    return result
  }

  // Obter fim do mês
  static endOfMonth(date: Date): Date {
    const result = new Date(date)
    result.setMonth(result.getMonth() + 1, 0)
    result.setHours(23, 59, 59, 999)
    return result
  }

  // Obter início do ano
  static startOfYear(date: Date): Date {
    const result = new Date(date)
    result.setMonth(0, 1)
    result.setHours(0, 0, 0, 0)
    return result
  }

  // Obter fim do ano
  static endOfYear(date: Date): Date {
    const result = new Date(date)
    result.setMonth(11, 31)
    result.setHours(23, 59, 59, 999)
    return result
  }

  // Adicionar dias
  static addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  // Adicionar meses
  static addMonths(date: Date, months: number): Date {
    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return result
  }

  // Adicionar anos
  static addYears(date: Date, years: number): Date {
    const result = new Date(date)
    result.setFullYear(result.getFullYear() + years)
    return result
  }

  // Diferença em dias
  static diffInDays(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Diferença em meses
  static diffInMonths(date1: Date, date2: Date): number {
    const yearDiff = date2.getFullYear() - date1.getFullYear()
    const monthDiff = date2.getMonth() - date1.getMonth()
    return yearDiff * 12 + monthDiff
  }

  // Verificar se é mesmo dia
  static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  // Verificar se é mesmo mês
  static isSameMonth(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth()
    )
  }

  // Verificar se é mesmo ano
  static isSameYear(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear()
  }

  // Verificar se data está no passado
  static isPast(date: Date): boolean {
    return date < new Date()
  }

  // Verificar se data está no futuro
  static isFuture(date: Date): boolean {
    return date > new Date()
  }

  // Verificar se é hoje
  static isToday(date: Date): boolean {
    return this.isSameDay(date, new Date())
  }

  // Verificar se é fim de semana
  static isWeekend(date: Date): boolean {
    const day = date.getDay()
    return day === 0 || day === 6 // Domingo ou Sábado
  }

  // Obter nome do mês
  static getMonthName(date: Date, locale = 'pt-BR'): string {
    return date.toLocaleDateString(locale, { month: 'long' })
  }

  // Obter nome do dia da semana
  static getDayName(date: Date, locale = 'pt-BR'): string {
    return date.toLocaleDateString(locale, { weekday: 'long' })
  }

  // Converter para ISO string sem timezone
  static toISOStringLocal(date: Date): string {
    const offset = date.getTimezoneOffset() * 60000
    const localDate = new Date(date.getTime() - offset)
    return localDate.toISOString().slice(0, -1)
  }

  // Parsear data brasileira (dd/mm/yyyy)
  static parseBrazilianDate(dateString: string): Date | null {
    const parts = dateString.split('/')
    if (parts.length !== 3) return null
    
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1 // Mês é 0-indexed
    const year = parseInt(parts[2], 10)
    
    const date = new Date(year, month, day)
    
    // Verificar se a data é válida
    if (
      date.getDate() === day &&
      date.getMonth() === month &&
      date.getFullYear() === year
    ) {
      return date
    }
    
    return null
  }

  // Obter range de datas do mês atual
  static getCurrentMonthRange(): { start: Date; end: Date } {
    const now = new Date()
    return {
      start: this.startOfMonth(now),
      end: this.endOfMonth(now)
    }
  }

  // Obter range de datas do ano atual
  static getCurrentYearRange(): { start: Date; end: Date } {
    const now = new Date()
    return {
      start: this.startOfYear(now),
      end: this.endOfYear(now)
    }
  }

  // Obter últimos N dias
  static getLastNDays(days: number): { start: Date; end: Date } {
    const end = new Date()
    const start = this.addDays(end, -days + 1)
    
    return {
      start: this.startOfDay(start),
      end: this.endOfDay(end)
    }
  }
}
```

## Utilitários de Criptografia

### Crypto Utils

```typescript
// src/main/utils/crypto-utils.ts
import crypto from 'crypto'

export class CryptoUtils {
  private static readonly ALGORITHM = 'aes-256-gcm'
  private static readonly KEY_LENGTH = 32
  private static readonly IV_LENGTH = 16
  private static readonly TAG_LENGTH = 16

  // Gerar chave aleatória
  static generateKey(): Buffer {
    return crypto.randomBytes(this.KEY_LENGTH)
  }

  // Gerar salt aleatório
  static generateSalt(): Buffer {
    return crypto.randomBytes(16)
  }

  // Derivar chave de senha usando PBKDF2
  static deriveKey(password: string, salt: Buffer, iterations = 100000): Buffer {
    return crypto.pbkdf2Sync(password, salt, iterations, this.KEY_LENGTH, 'sha256')
  }

  // Criptografar dados
  static encrypt(data: string, key: Buffer): {
    encrypted: string
    iv: string
    tag: string
  } {
    const iv = crypto.randomBytes(this.IV_LENGTH)
    const cipher = crypto.createCipher(this.ALGORITHM, key)
    cipher.setAAD(Buffer.from('additional-data'))
    
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const tag = cipher.getAuthTag()
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    }
  }

  // Descriptografar dados
  static decrypt(
    encryptedData: string,
    key: Buffer,
    iv: string,
    tag: string
  ): string {
    const decipher = crypto.createDecipher(this.ALGORITHM, key)
    decipher.setAAD(Buffer.from('additional-data'))
    decipher.setAuthTag(Buffer.from(tag, 'hex'))
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }

  // Hash de senha usando bcrypt-like
  static async hashPassword(password: string): Promise<string> {
    const salt = this.generateSalt()
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256')
    
    return `${salt.toString('hex')}:${hash.toString('hex')}`
  }

  // Verificar senha
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const [saltHex, hashHex] = hashedPassword.split(':')
    const salt = Buffer.from(saltHex, 'hex')
    const hash = Buffer.from(hashHex, 'hex')
    
    const computedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256')
    
    return crypto.timingSafeEqual(hash, computedHash)
  }

  // Gerar hash SHA-256
  static sha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex')
  }

  // Gerar hash MD5
  static md5(data: string): string {
    return crypto.createHash('md5').update(data).digest('hex')
  }

  // Gerar UUID v4
  static generateUUID(): string {
    return crypto.randomUUID()
  }

  // Gerar token aleatório
  static generateToken(length = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  // Gerar código numérico aleatório
  static generateNumericCode(length = 6): string {
    const max = Math.pow(10, length) - 1
    const min = Math.pow(10, length - 1)
    return Math.floor(Math.random() * (max - min + 1) + min).toString()
  }
}
```

---

**Os Utilitários do Backend fornecem um conjunto robusto de funções auxiliares que garantem consistência, segurança e eficiência em toda a aplicação.**
