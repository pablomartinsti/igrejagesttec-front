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
  expenses: Expense[];
};

export type FinancialEvolution = {
  _id: [number, number];
  incomes: number;
  expenses: number;
  balance: number;
};

export type Culto = {
  id: string;
  date: string;
  type: 'FRIDAY_NIGHT' | 'SUNDAY_MORNING' | 'SUNDAY_NIGHT';
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
  role: 'ADMIN' | 'PASTOR';
};
