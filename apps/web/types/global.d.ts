// Definiciones de tipos para módulos que no tienen declaraciones TypeScript
declare module 'bcryptjs' {
  export function hash(s: string, salt: number): Promise<string>;
  export function compare(s: string, hash: string): Promise<boolean>;
  export function genSalt(rounds?: number): Promise<string>;
}

declare module 'natural' {
  export namespace SentimentAnalyzer {
    function analyze(tokens: string[]): number;
  }
  export namespace PorterStemmer {
    function tokenizeAndStem(text: string): string[];
  }
  export namespace WordTokenizer {
    function tokenize(text: string): string[];
  }
}

declare module 'cheerio' {
  export function load(html: string): any;
}

declare module 'pino-http' {
  export default function(options?: any): any;
}

declare module 'express-pino-logger' {
  export default function(options?: any): any;
}

declare module 'supertest' {
  import { SuperTest, Test } from 'supertest';
  export default function(app: any): SuperTest<Test>;
}

// Declaración global para archivos CSS/SCSS
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

// Declaraciones para imágenes y assets
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

// Variables de entorno
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_APP_URL: string;
    OPENAI_API_KEY: string;
    NEWS_API_KEY: string;
    WEATHER_API_KEY: string;
    DATABASE_URL: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
  }
}