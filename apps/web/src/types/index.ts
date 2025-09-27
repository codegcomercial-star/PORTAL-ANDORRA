export interface Company {
  id: string;
  name: string;
  nrt?: string;
  sector: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
  uvIndex?: number;
}

export interface WeatherForecast {
  date: string;
  temperature: { min: number; max: number };
  description: string;
  icon: string;
  precipitation?: number;
}

export interface UserAlert {
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}