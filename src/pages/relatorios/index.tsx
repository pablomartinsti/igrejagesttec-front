import { useCallback, useEffect, useMemo, useState } from 'react';
import { MagnifyingGlass, Printer } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { Layout } from '../../components/layout';
import { CultosService } from '../../services/cultos.service';
import { TransactionsService } from '../../services/transactions.service';
import { Culto, Transaction } from '../../services/api-types';
import { formatCurrency } from '../../utils/format-currency';
import { formatDate, formatDateDisplay } from '../../utils/format-date';
import {
  ButtonGroup,
  CategoryName,
  ContentGrid,
  EmptyState,
  ErrorState,
  FilterGroup,
  FilterInput,
  FilterLabel,
  FiltersRow,
  LoadingState,
  Money,
  PrimaryButton,
  ReportActions,
  ReportHeader,
  ReportSection,
  ReportSubtitle,
  ReportTitle,
  SecondaryButton,
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
  SummaryCard,
  SummaryGrid,
  SummaryLabel,
  SummaryValue,
  Table,
  TableWrapper,
  Td,
  Th,
} from './styles';

type CategoryRow = {
  title: string;
  color?: string;
  incomes: number;
  expenses: number;
};

function getTransactionId(transaction: Transaction) {
  return transaction._id || (transaction as unknown as { id?: string }).id || '';
}

function isBetween(date: string, beginDate: string, endDate: string) {
  const value = dayjs(formatDate(date)).valueOf();
  return (
    value >= dayjs(beginDate).startOf('day').valueOf() &&
    value <= dayjs(endDate).endOf('day').valueOf()
  );
}

function isBefore(date: string, beginDate: string) {
  return (
    dayjs(formatDate(date)).valueOf() < dayjs(beginDate).startOf('day').valueOf()
  );
}

function sumTransactions(transactions: Transaction[], type: 'income' | 'expense') {
  return transactions
    .filter(transaction => transaction.type === type)
    .reduce((acc, transaction) => acc + transaction.amount, 0);
}

function sumDizimos(cultos: Culto[]) {
  return cultos
    .flatMap(culto => culto.dizimistas)
    .reduce((acc, dizimista) => acc + dizimista.amount, 0);
}

export function RelatoriosPage() {
  const [beginDate, setBeginDate] = useState(
    dayjs().startOf('month').format('YYYY-MM-DD'),
  );
  const [endDate, setEndDate] = useState(
    dayjs().endOf('month').format('YYYY-MM-DD'),
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cultos, setCultos] = useState<Culto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [transactionsData, cultosData] = await Promise.all([
        TransactionsService.index(),
        CultosService.index(),
      ]);

      setTransactions(transactionsData);
      setCultos(cultosData);
    } catch (err) {
      console.error(err);
      setError('Nao foi possivel carregar o relatorio geral.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const report = useMemo(() => {
    const normalizedBeginDate = formatDate(beginDate);
    const normalizedEndDate = formatDate(endDate);

    const periodTransactions = transactions.filter(transaction =>
      isBetween(transaction.date, normalizedBeginDate, normalizedEndDate),
    );
    const previousTransactions = transactions.filter(transaction =>
      isBefore(transaction.date, normalizedBeginDate),
    );
    const periodCultos = cultos
      .filter(culto => isBetween(culto.date, normalizedBeginDate, normalizedEndDate))
      .sort(
        (a, b) =>
          dayjs(formatDate(a.date)).valueOf() -
          dayjs(formatDate(b.date)).valueOf(),
      );
    const previousCultos = cultos.filter(culto =>
      isBefore(culto.date, normalizedBeginDate),
    );

    const previousIncomes = sumTransactions(previousTransactions, 'income');
    const previousExpenses = sumTransactions(previousTransactions, 'expense');
    const previousDizimos = sumDizimos(previousCultos);
    const periodTransactionIncomes = sumTransactions(periodTransactions, 'income');
    const periodExpenses = sumTransactions(periodTransactions, 'expense');
    const periodDizimos = sumDizimos(periodCultos);
    const periodIncomes = periodTransactionIncomes + periodDizimos;
    const previousBalance = previousIncomes + previousDizimos - previousExpenses;
    const periodBalance = periodIncomes - periodExpenses;
    const finalBalance = previousBalance + periodBalance;

    const linkedTransactionIds = new Set(
      periodCultos
        .flatMap(culto => culto.transactions)
        .map(transaction => getTransactionId(transaction))
        .filter(Boolean),
    );
    const looseTransactions = periodTransactions.filter(
      transaction => !linkedTransactionIds.has(getTransactionId(transaction)),
    );

    const categoryMap = new Map<string, CategoryRow>();
    for (const transaction of periodTransactions) {
      const key = transaction.category?._id || transaction.category?.title;
      const current = categoryMap.get(key) || {
        title: transaction.category?.title || 'Sem categoria',
        color: transaction.category?.color,
        incomes: 0,
        expenses: 0,
      };

      if (transaction.type === 'income') {
        current.incomes += transaction.amount;
      } else {
        current.expenses += transaction.amount;
      }

      categoryMap.set(key, current);
    }

    if (periodDizimos > 0) {
      categoryMap.set('dizimos-cultos', {
        title: 'Dizimos e ofertas dos cultos',
        color: '#10B981',
        incomes: periodDizimos,
        expenses: 0,
      });
    }

    const spiritual = new Map<string, number>();
    for (const culto of periodCultos) {
      for (const record of culto.spiritualRecords) {
        spiritual.set(
          record.category.title,
          (spiritual.get(record.category.title) || 0) + record.value,
        );
      }
    }

    const cultoRows = periodCultos.map(culto => {
      const dizimos = culto.dizimistas.reduce(
        (acc, dizimista) => acc + dizimista.amount,
        0,
      );
      const entradas = sumTransactions(culto.transactions, 'income');

      return {
        id: culto.id,
        date: culto.date,
        title: culto.category.title,
        preacher: culto.preacher || 'Nao informado',
        dizimos,
        entradas,
        totalArrecadado: dizimos + entradas,
      };
    });

    return {
      previousBalance,
      periodIncomes,
      periodExpenses,
      periodBalance,
      finalBalance,
      periodDizimos,
      periodCultos,
      looseTransactions,
      categoryRows: Array.from(categoryMap.values()).sort(
        (a, b) => b.incomes + b.expenses - (a.incomes + a.expenses),
      ),
      spiritualRows: Array.from(spiritual.entries()).sort((a, b) =>
        a[0].localeCompare(b[0]),
      ),
      cultoRows,
    };
  }, [beginDate, endDate, transactions, cultos]);

  return (
    <Layout title="Relatorios">
      <ReportActions>
        <FiltersRow>
          <FilterGroup>
            <FilterLabel>Inicio</FilterLabel>
            <FilterInput
              type="date"
              value={beginDate}
              onChange={event => setBeginDate(event.target.value)}
            />
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Fim</FilterLabel>
            <FilterInput
              type="date"
              value={endDate}
              onChange={event => setEndDate(event.target.value)}
            />
          </FilterGroup>
          <PrimaryButton onClick={fetchReport} disabled={loading}>
            <MagnifyingGlass size={18} weight="bold" />
            {loading ? 'Gerando...' : 'Gerar relatorio'}
          </PrimaryButton>
        </FiltersRow>
        <ButtonGroup>
          <SecondaryButton onClick={() => window.print()}>
            <Printer size={18} weight="bold" />
            Imprimir
          </SecondaryButton>
        </ButtonGroup>
      </ReportActions>

      {error && <ErrorState>{error}</ErrorState>}

      <ReportHeader>
        <ReportTitle>Relatorio Geral</ReportTitle>
        <ReportSubtitle>
          Periodo de {formatDateDisplay(beginDate)} ate{' '}
          {formatDateDisplay(endDate)}
        </ReportSubtitle>
      </ReportHeader>

      {loading ? (
        <LoadingState>Carregando relatorio...</LoadingState>
      ) : (
        <>
          <SummaryGrid>
            <SummaryCard>
              <SummaryLabel>Saldo anterior</SummaryLabel>
              <SummaryValue>{formatCurrency(report.previousBalance)}</SummaryValue>
            </SummaryCard>
            <SummaryCard $variant="income">
              <SummaryLabel>Receitas do periodo</SummaryLabel>
              <SummaryValue $variant="income">
                {formatCurrency(report.periodIncomes)}
              </SummaryValue>
            </SummaryCard>
            <SummaryCard $variant="expense">
              <SummaryLabel>Despesas do periodo</SummaryLabel>
              <SummaryValue $variant="expense">
                {formatCurrency(report.periodExpenses)}
              </SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryLabel>Saldo do periodo</SummaryLabel>
              <SummaryValue>{formatCurrency(report.periodBalance)}</SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryLabel>Saldo final em caixa</SummaryLabel>
              <SummaryValue>{formatCurrency(report.finalBalance)}</SummaryValue>
            </SummaryCard>
          </SummaryGrid>

          <ContentGrid>
            <ReportSection>
              <SectionHeader>
                <SectionTitle>Resumo espiritual</SectionTitle>
                <SectionSubtitle>
                  Registros informados nos cultos do periodo
                </SectionSubtitle>
              </SectionHeader>
              {report.spiritualRows.length === 0 ? (
                <EmptyState>Nenhum registro espiritual no periodo.</EmptyState>
              ) : (
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Categoria</Th>
                        <Th>Total</Th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <Td>Cultos realizados</Td>
                        <Td $align="right">{report.periodCultos.length}</Td>
                      </tr>
                      {report.spiritualRows.map(([title, value]) => (
                        <tr key={title}>
                          <Td>{title}</Td>
                          <Td $align="right">{value}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>
              )}
            </ReportSection>

            <ReportSection>
              <SectionHeader>
                <SectionTitle>Resumo por categorias</SectionTitle>
                <SectionSubtitle>Receitas e despesas agrupadas</SectionSubtitle>
              </SectionHeader>
              {report.categoryRows.length === 0 ? (
                <EmptyState>Nenhuma movimentacao no periodo.</EmptyState>
              ) : (
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Categoria</Th>
                        <Th>Entradas</Th>
                        <Th>Saidas</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.categoryRows.map(category => (
                        <tr key={category.title}>
                          <Td>
                            <CategoryName $color={category.color}>
                              {category.title}
                            </CategoryName>
                          </Td>
                          <Td $align="right">
                            {category.incomes > 0 ? (
                              <Money $variant="income">
                                {formatCurrency(category.incomes)}
                              </Money>
                            ) : (
                              '-'
                            )}
                          </Td>
                          <Td $align="right">
                            {category.expenses > 0 ? (
                              <Money $variant="expense">
                                {formatCurrency(category.expenses)}
                              </Money>
                            ) : (
                              '-'
                            )}
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>
              )}
            </ReportSection>

            <ReportSection $wide>
              <SectionHeader>
                <SectionTitle>Cultos do periodo</SectionTitle>
                <SectionSubtitle>
                  Arrecadacao financeira resumida por culto
                </SectionSubtitle>
              </SectionHeader>
              {report.cultoRows.length === 0 ? (
                <EmptyState>Nenhum culto no periodo selecionado.</EmptyState>
              ) : (
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Data</Th>
                        <Th>Culto</Th>
                        <Th>Pregador</Th>
                        <Th>Dizimos/ofertas</Th>
                        <Th>Entradas</Th>
                        <Th>Total arrecadado</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.cultoRows.map(culto => (
                        <tr key={culto.id}>
                          <Td>{formatDateDisplay(culto.date)}</Td>
                          <Td>{culto.title}</Td>
                          <Td>{culto.preacher}</Td>
                          <Td $align="right">
                            <Money $variant="income">
                              {formatCurrency(culto.dizimos)}
                            </Money>
                          </Td>
                          <Td $align="right">
                            <Money $variant="income">
                              {formatCurrency(culto.entradas)}
                            </Money>
                          </Td>
                          <Td $align="right">
                            <Money $variant="income">
                              {formatCurrency(culto.totalArrecadado)}
                            </Money>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>
              )}
            </ReportSection>

            <ReportSection $wide>
              <SectionHeader>
                <SectionTitle>Transacoes soltas</SectionTitle>
                <SectionSubtitle>
                  Lancamentos financeiros que nao estao vinculados a um culto
                </SectionSubtitle>
              </SectionHeader>
              {report.looseTransactions.length === 0 ? (
                <EmptyState>Nenhuma transacao solta no periodo.</EmptyState>
              ) : (
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Data</Th>
                        <Th>Titulo</Th>
                        <Th>Categoria</Th>
                        <Th>Tipo</Th>
                        <Th>Valor</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.looseTransactions.map(transaction => (
                        <tr key={getTransactionId(transaction)}>
                          <Td>{formatDateDisplay(transaction.date)}</Td>
                          <Td>{transaction.title}</Td>
                          <Td>
                            <CategoryName $color={transaction.category.color}>
                              {transaction.category.title}
                            </CategoryName>
                          </Td>
                          <Td>
                            {transaction.type === 'income' ? 'Entrada' : 'Saida'}
                          </Td>
                          <Td $align="right">
                            <Money $variant={transaction.type}>
                              {formatCurrency(transaction.amount)}
                            </Money>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>
              )}
            </ReportSection>
          </ContentGrid>
        </>
      )}
    </Layout>
  );
}
