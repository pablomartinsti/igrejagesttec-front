import { api } from './api';
import { Category } from './api-types';

export type CreateCategoryData = {
  title: string;
  color: string;
};

export const CategoriesService = {
  async index(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/categories');
    return data;
  },

  async create(payload: CreateCategoryData): Promise<Category> {
    const { data } = await api.post<Category>('/categories', payload);
    return data;
  },

  async update(
    id: string,
    payload: Partial<CreateCategoryData>,
  ): Promise<Category> {
    const { data } = await api.put<Category>(`/categories/${id}`, payload);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
