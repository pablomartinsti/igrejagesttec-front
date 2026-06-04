import { api } from './api';
import { User } from './api-types';

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role: User['role'];
};

export const UsersService = {
  async index(): Promise<User[]> {
    const { data } = await api.get<User[]>('/users');
    return data;
  },

  async create(payload: CreateUserData): Promise<User> {
    const { data } = await api.post<User>('/users', payload);
    return data;
  },
};
