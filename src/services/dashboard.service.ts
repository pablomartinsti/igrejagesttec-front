import { api } from './api';
import { Dashboard, FinancialEvolution } from './api-types';

export type DashboardFilters = {
  beginDate?: string;
  endDate?: string;
};

export type FinancialEvolutionFilters = {
  year: string;
};

export const DashboardService = {
  async getDashboard({
    beginDate,
    endDate,
  }: DashboardFilters): Promise<Dashboard> {
    const { data } = await api.get<Dashboard>('/transactions/dashboard', {
      params: { beginDate, endDate, _t: Date.now() },
      headers: { 'Cache-Control': 'no-cache' },
    });
    return data;
  },

  async getFinancialEvolution({
    year,
  }: FinancialEvolutionFilters): Promise<FinancialEvolution[]> {
    const { data } = await api.get<FinancialEvolution[]>(
      '/transactions/financial-evolution',
      {
        params: { year },
      },
    );
    return data;
  },
};
