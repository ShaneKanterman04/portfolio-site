import fs from 'fs';
import path from 'path';

// Log levels
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private logDir: string;
  private logFile: string;
  
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFile = path.join(this.logDir, 'app.log');
    
    // Ensure log directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }
  
  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | Data: ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level}] ${message}${dataStr}\n`;
  }
  
  private writeToFile(message: string): void {
    try {
      fs.appendFileSync(this.logFile, message);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }
  
  private log(level: LogLevel, message: string, data?: any): void {
    const formattedMessage = this.formatMessage(level, message, data);
    
    // Write to console
    console.log(formattedMessage);
    
    // Write to file
    this.writeToFile(formattedMessage);
  }
  
  public debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }
  
  public info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }
  
  public warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }
  
  public error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }
}

// Singleton instance
export const logger = new Logger();
