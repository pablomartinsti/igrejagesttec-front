export type Category = {
  _id: string;
  title: string;
  color: string;
};

export type Transaction = {
  _id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: Category;
  cultoId?: string;
};

export type Balance = {
  _id: string | null;
  incomes: number;
  expenses: number;
  balance: number;
};

export type Expense = {
  _id: string;
  title: string;
  amount: number;
  color: string;
};

export type Dashboard = {
  balance: Balance;
  cashBalance: Balance;
  expenses: Expense[];
};

export type FinancialEvolution = {
  _id: [number, number];
  incomes: number;
  expenses: number;
  balance: number;
};

export type CultoCategory = {
  id: string;
  title: string;
  churchId: string;
};

export type Culto = {
  id: string;
  date: string;
  categoryId: string;
  category: CultoCategory;
  preacher?: string;
  churchId: string;
  createdAt: string;
  dizimistas: Dizimista[];
  spiritualRecords: SpiritualRecord[];
  transactions: Transaction[];
};

export type Dizimista = {
  id: string;
  name?: string;
  amount: number;
  contributionType?: string;
  cultoId: string;
};

export type SpiritualCategory = {
  id: string;
  title: string;
  churchId: string;
};

export type SpiritualRecord = {
  id: string;
  value: number;
  cultoId: string;
  categoryId: string;
  category: SpiritualCategory;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TREASURER' | 'PASTOR';
  createdAt?: string;
};

export type Church = {
  id: string;
  name: string;
  cnpj?: string | null;
  street?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  phone?: string | null;
  email?: string | null;
  responsibleName?: string | null;
};
