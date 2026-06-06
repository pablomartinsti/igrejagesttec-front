import { api } from './api';
import { Culto, CultoCategory, SpiritualCategory } from './api-types';

export type CreateCultoData = {
  date: string;
  categoryId: string;
  preacher?: string;
};

export type CreateDizimistaData = {
  name?: string;
  amount: number;
  contributionType?: string;
};

export type CreateSpiritualRecordData = {
  categoryId: string;
  value: number;
};

export const CultosService = {
  async index(): Promise<Culto[]> {
    const { data } = await api.get<Culto[]>('/cultos');
    return data;
  },

  async findById(id: string): Promise<Culto> {
    const { data } = await api.get<Culto>(`/cultos/${id}`);
    return data;
  },

  async create(payload: CreateCultoData): Promise<Culto> {
    const { data } = await api.post<Culto>('/cultos', payload);
    return data;
  },

  async update(id: string, payload: Partial<CreateCultoData>): Promise<Culto> {
    const { data } = await api.put<Culto>(`/cultos/${id}`, payload);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/cultos/${id}`);
  },

  async addDizimista(cultoId: string, payload: CreateDizimistaData) {
    const { data } = await api.post(`/cultos/${cultoId}/dizimistas`, payload);
    return data;
  },

  async removeDizimista(cultoId: string, dizimistaId: string): Promise<void> {
    await api.delete(`/cultos/${cultoId}/dizimistas/${dizimistaId}`);
  },

  async addSpiritualRecord(
    cultoId: string,
    payload: CreateSpiritualRecordData,
  ) {
    const { data } = await api.post(`/cultos/${cultoId}/espiritual`, payload);
    return data;
  },

  async removeSpiritualRecord(
    cultoId: string,
    recordId: string,
  ): Promise<void> {
    await api.delete(`/cultos/${cultoId}/espiritual/${recordId}`);
  },

  async getSpiritualCategories(): Promise<SpiritualCategory[]> {
    const { data } = await api.get<SpiritualCategory[]>(
      '/cultos/categorias-espirituais',
    );
    return data;
  },

  async createSpiritualCategory(title: string): Promise<SpiritualCategory> {
    const { data } = await api.post<SpiritualCategory>(
      '/cultos/categorias-espirituais',
      { title },
    );
    return data;
  },

  async updateSpiritualCategory(
    id: string,
    title: string,
  ): Promise<SpiritualCategory> {
    const { data } = await api.put<SpiritualCategory>(
      `/cultos/categorias-espirituais/${id}`,
      { title },
    );
    return data;
  },

  async deleteSpiritualCategory(id: string): Promise<void> {
    await api.delete(`/cultos/categorias-espirituais/${id}`);
  },

  async getCultoCategories(): Promise<CultoCategory[]> {
    const { data } = await api.get<CultoCategory[]>('/cultos/categorias');
    return data;
  },

  async createCultoCategory(title: string): Promise<CultoCategory> {
    const { data } = await api.post<CultoCategory>('/cultos/categorias', {
      title,
    });
    return data;
  },

  async updateCultoCategory(id: string, title: string): Promise<CultoCategory> {
    const { data } = await api.put<CultoCategory>(`/cultos/categorias/${id}`, {
      title,
    });
    return data;
  },

  async deleteCultoCategory(id: string): Promise<void> {
    await api.delete(`/cultos/categorias/${id}`);
  },
};
