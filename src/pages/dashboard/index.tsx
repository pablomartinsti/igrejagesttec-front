import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Layout } from '../../components/layout';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard, FinancialEvolution } from '../../services/api-types';
import { formatCurrency } from '../../utils/format-currency';
import { formatDate } from '../../utils/format-date';
import {
  CardsGrid,
  Card,
  CardTitle,
  CardValue,
  CardIcon,
  SectionTitle,
  SectionSubtitle,
  FiltersRow,
  FilterGroup,
  FilterLabel,
  FilterInput,
  FilterButton,
  ChartCard,
  ChartHeader,
  EmptyState,
  YearFilterRow,
} from './styles';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const MONTHS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

export function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard>({
    balance: { _id: null, incomes: 0, expenses: 0, balance: 0 },
    expenses: [],
  });
  const [financialEvolution, setFinancialEvolution] = useState<
    FinancialEvolution[]
  >([]);
  const [beginDate, setBeginDate] = useState(
    dayjs().startOf('month').format('DD/MM/YYYY'),
  );
  const [endDate, setEndDate] = useState(
    dayjs().endOf('month').format('DD/MM/YYYY'),
  );
  const [year, setYear] = useState(dayjs().year().toString());
  const [loading, setLoading] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const data = await DashboardService.getDashboard({
        beginDate: formatDate(beginDate),
        endDate: formatDate(endDate),
      });
      setDashboard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [beginDate, endDate]);

  const fetchFinancialEvolution = useCallback(async () => {
    try {
      const data = await DashboardService.getFinancialEvolution({ year });
      setFinancialEvolution(data);
    } catch (err) {
      console.error(err);
    }
  }, [year]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    fetchFinancialEvolution();
  }, [fetchFinancialEvolution]);

  const evolutionData = Array.from({ length: 12 }, (_, i) => {
    const found = financialEvolution.find(e => e._id[1] === i + 1);
    return {
      name: MONTHS[i],
      Receitas: found ? found.incomes / 100 : 0,
      Gastos: found ? found.expenses / 100 : 0,
      Saldo: found ? found.balance / 100 : 0,
    };
  });

  const pieData = dashboard.expenses.map(e => ({
    name: e.title,
    value: e.amount,
    color: e.color,
  }));

  return (
    <Layout title="Dashboard">
      <FiltersRow>
        <FilterGroup>
          <FilterLabel>Início</FilterLabel>
          <FilterInput
            type="text"
            placeholder="dd/mm/aaaa"
            value={beginDate}
            onChange={e => setBeginDate(e.target.value)}
          />
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>Fim</FilterLabel>
          <FilterInput
            type="text"
            placeholder="dd/mm/aaaa"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </FilterGroup>
        <FilterButton onClick={fetchDashboard} disabled={loading}>
          {loading ? '...' : '🔍 Filtrar'}
        </FilterButton>
      </FiltersRow>

      <CardsGrid>
        <Card $variant="default">
          <CardIcon>💰</CardIcon>
          <div>
            <CardTitle>Saldo</CardTitle>
            <CardValue $variant="default">
              {formatCurrency(dashboard.balance.balance)}
            </CardValue>
          </div>
        </Card>
        <Card $variant="income">
          <CardIcon>📈</CardIcon>
          <div>
            <CardTitle>Receitas</CardTitle>
            <CardValue $variant="income">
              {formatCurrency(dashboard.balance.incomes)}
            </CardValue>
          </div>
        </Card>
        <Card $variant="expense">
          <CardIcon>📉</CardIcon>
          <div>
            <CardTitle>Gastos</CardTitle>
            <CardValue $variant="expense">
              {formatCurrency(dashboard.balance.expenses)}
            </CardValue>
          </div>
        </Card>
      </CardsGrid>

      <ChartCard>
        <ChartHeader>
          <div>
            <SectionTitle>Gastos por categoria</SectionTitle>
            <SectionSubtitle>Despesas no período selecionado</SectionSubtitle>
          </div>
        </ChartHeader>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={value => formatCurrency(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState>Nenhum gasto no período selecionado</EmptyState>
        )}
      </ChartCard>

      <ChartCard>
        <ChartHeader>
          <div>
            <SectionTitle>Evolução Financeira</SectionTitle>
            <SectionSubtitle>Saldo, Receitas e Gastos no ano</SectionSubtitle>
          </div>
          <YearFilterRow>
            <FilterInput
              type="text"
              placeholder="aaaa"
              value={year}
              onChange={e => setYear(e.target.value)}
              style={{ width: '100px' }}
            />
            <FilterButton onClick={fetchFinancialEvolution}>🔍</FilterButton>
          </YearFilterRow>
        </ChartHeader>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={evolutionData}>
            <XAxis dataKey="name" />
            <YAxis tickFormatter={v => `R$${v}`} />
            <Tooltip formatter={value => `R$ ${Number(value).toFixed(2)}`} />
            <Legend />
            <Bar dataKey="Receitas" fill="#10B981" />
            <Bar dataKey="Gastos" fill="#EF4444" />
            <Bar dataKey="Saldo" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </Layout>
  );
}
