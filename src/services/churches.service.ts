import { api } from './api';
import { Church } from './api-types';

export type UpdateChurchData = Partial<
  Pick<
    Church,
    | 'name'
    | 'cnpj'
    | 'street'
    | 'neighborhood'
    | 'city'
    | 'state'
    | 'zipCode'
    | 'phone'
    | 'email'
    | 'responsibleName'
  >
>;

export const ChurchesService = {
  async show(): Promise<Church> {
    const { data } = await api.get<Church>('/church');
    return data;
  },

  async update(payload: UpdateChurchData): Promise<Church> {
    const { data } = await api.put<Church>('/church', payload);
    return data;
  },
};
