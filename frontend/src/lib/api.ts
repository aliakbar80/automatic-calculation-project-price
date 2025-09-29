import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
});

export type ConfigResponse = {
  coefficients: Record<string, Array<{ id: string; group: string; key: string; label?: string; value: number }>>;
  basePrices: Array<{ id: string; projectType: string; scale: string; baseUsd: number }>;
};

export async function getConfig(projectType?: string) {
  const { data } = await api.get<ConfigResponse>('/config', { params: projectType ? { projectType } : undefined });
  return data;
}

export type CalculateRequest = {
  projectType: 'webapp' | 'shop' | 'erp' | 'landing' | 'cms' | 'crm' | 'mobile' | 'saas';
  scale: 'small' | 'medium' | 'large';
  technologies: string[];
  pagesOrModules: number;
  specialFeatures: string[];
  delivery: 'normal' | 'fast' | 'urgent';
  complexity: number;
  risk: number;
  usdRate?: number;
  // inflation removed
  profitMargin: number;
};

export type CalculateResponse = {
  baseUsd: number;
  baseIrr: number;
  inflationApplied: number;
  deliveryMultiplier: number;
  complexityMultiplier: number;
  riskMultiplier: number;
  technologiesMultiplier: number;
  featuresMultiplier: number;
  modulesMultiplier: number;
  subtotal: number;
  profitAmount: number;
  total: number;
};

export async function calculate(body: CalculateRequest) {
  const { data } = await api.post<CalculateResponse>('/calculate', body);
  return data;
}


