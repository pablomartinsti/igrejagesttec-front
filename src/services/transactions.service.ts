import { api } from './api';
import { Transaction } from './api-types';

export type CreateTransactionData = {
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  categoryId: string;
  cultoId?: string;
};

export type TransactionsFilters = {
  title?: string;
  categoryId?: string;
  beginDate?: string;
  endDate?: string;
};

export const TransactionsService = {
  async index(filters?: TransactionsFilters): Promise<Transaction[]> {
    const { data } = await api.get<Transaction[]>('/transactions', {
      params: filters,
    });
    return data;
  },

  async create(payload: CreateTransactionData): Promise<Transaction> {
    const { data } = await api.post<Transaction>('/transactions', payload);
    return data;
  },

  async update(
    id: string,
    payload: Partial<CreateTransactionData>,
  ): Promise<Transaction> {
    const { data } = await api.put<Transaction>(`/transactions/${id}`, payload);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },
};
