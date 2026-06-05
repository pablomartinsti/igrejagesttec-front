import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import { Layout } from '../../components/layout';
import { TransactionsService } from '../../services/transactions.service';
import { CategoriesService } from '../../services/categories.service';
import { Transaction, Category } from '../../services/api-types';
import { useAuth } from '../../contexts/auth.context';
import { formatCurrency } from '../../utils/format-currency';
import {
  formatDate,
  formatDateDisplay,
  formatDateInput,
} from '../../utils/format-date';
import {
  PageHeader,
  FiltersRow,
  FilterGroup,
  FilterLabel,
  FilterInput,
  FilterSelect,
  FilterButton,
  AddButton,
  Table,
  Th,
  Td,
  TypeBadge,
  CategoryBadge,
  ActionButton,
  ModalOverlay,
  Modal,
  ModalTitle,
  Form,
  InputGroup,
  Label,
  Input,
  Select,
  ModalButtons,
  CancelButton,
  SubmitButton,
  EmptyState,
  LoadingState,
  AmountCell,
} from './styles';

const transactionSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  amount: z.string().min(1, 'Valor obrigatório'),
  type: z.enum(['income', 'expense']),
  date: z.string().min(1, 'Data obrigatória'),
  categoryId: z.string().min(1, 'Categoria obrigatória'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export function TransacoesPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'ADMIN' || user?.role === 'TREASURER';
  const canDelete = user?.role === 'ADMIN';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const [filterTitle, setFilterTitle] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBegin, setFilterBegin] = useState(
    dayjs().startOf('month').format('YYYY-MM-DD'),
  );
  const [filterEnd, setFilterEnd] = useState(
    dayjs().endOf('month').format('YYYY-MM-DD'),
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: 'income' },
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await TransactionsService.index({
        title: filterTitle || undefined,
        categoryId: filterCategory || undefined,
        beginDate: formatDate(filterBegin),
        endDate: formatDate(filterEnd),
      });
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterTitle, filterCategory, filterBegin, filterEnd]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await CategoriesService.index();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [fetchTransactions, fetchCategories]);

  const openCreate = () => {
    setEditing(null);
    reset({
      title: '',
      amount: '',
      type: 'income',
      date: dayjs().format('YYYY-MM-DD'),
      categoryId: '',
    });
    setModalOpen(true);
  };

  const openEdit = (transaction: Transaction) => {
    setEditing(transaction);
    setValue('title', transaction.title);
    setValue('amount', (transaction.amount / 100).toFixed(2).replace('.', ','));
    setValue('type', transaction.type);
    setValue('date', formatDateInput(transaction.date));
    setValue('categoryId', transaction.category._id);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja deletar esta transação?')) return;
    try {
      await TransactionsService.delete(id);
      await fetchTransactions();
    } catch {
      alert('Erro ao deletar transação.');
    }
  };

  const onSubmit = async (data: TransactionFormData) => {
    try {
      const amount = Math.round(
        parseFloat(data.amount.replace(',', '.')) * 100,
      );
      const payload = {
        title: data.title,
        amount,
        type: data.type,
        date: formatDate(data.date),
        categoryId: data.categoryId,
      };

      if (editing) {
        await TransactionsService.update(editing._id, payload);
      } else {
        await TransactionsService.create(payload);
      }
      setModalOpen(false);
      await fetchTransactions();
    } catch {
      alert('Erro ao salvar transação.');
    }
  };

  return (
    <Layout title="Transações">
      <PageHeader>
        <FiltersRow>
          <FilterGroup>
            <FilterLabel>Início</FilterLabel>
            <FilterInput
              type="date"
              value={filterBegin}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilterBegin(e.target.value)
              }
            />
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Fim</FilterLabel>
            <FilterInput
              type="date"
              value={filterEnd}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilterEnd(e.target.value)
              }
            />
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Categoria</FilterLabel>
            <FilterSelect
              value={filterCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterCategory(e.target.value)
              }
            >
              <option value="">Todas</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Título</FilterLabel>
            <FilterInput
              value={filterTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilterTitle(e.target.value)
              }
              placeholder="Buscar..."
            />
          </FilterGroup>
          <FilterButton onClick={fetchTransactions}>🔍 Filtrar</FilterButton>
        </FiltersRow>
        {canManage && (
          <AddButton onClick={openCreate}>+ Nova transação</AddButton>
        )}
      </PageHeader>

      {loading ? (
        <LoadingState>Carregando...</LoadingState>
      ) : transactions.length === 0 ? (
        <EmptyState>Nenhuma transação encontrada.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Data</Th>
              <Th>Título</Th>
              <Th>Categoria</Th>
              <Th>Tipo</Th>
              <Th>Valor</Th>
              {(canManage || canDelete) && <Th>Ações</Th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t._id}>
                <Td>{formatDateDisplay(t.date)}</Td>
                <Td>{t.title}</Td>
                <Td>
                  <CategoryBadge $color={t.category.color}>
                    {t.category.title}
                  </CategoryBadge>
                </Td>
                <Td>
                  <TypeBadge $type={t.type}>
                    {t.type === 'income' ? 'Receita' : 'Despesa'}
                  </TypeBadge>
                </Td>
                <Td>
                  <AmountCell $type={t.type}>
                    {t.type === 'expense' ? '-' : '+'}
                    {formatCurrency(t.amount)}
                  </AmountCell>
                </Td>
                {(canManage || canDelete) && (
                  <Td>
                    {canManage && (
                      <ActionButton $variant="edit" onClick={() => openEdit(t)}>
                      ✏️
                      </ActionButton>
                    )}
                    {canDelete && (
                      <ActionButton
                        $variant="delete"
                        onClick={() => handleDelete(t._id)}
                      >
                      🗑️
                      </ActionButton>
                    )}
                  </Td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {modalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <Modal onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <ModalTitle>
              {editing ? 'Editar transação' : 'Nova transação'}
            </ModalTitle>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <InputGroup>
                <Label>Título</Label>
                <Input
                  placeholder="Ex: Dízimo João"
                  {...register('title')}
                  $hasError={!!errors.title}
                />
                {errors.title && (
                  <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>
                    {errors.title.message}
                  </span>
                )}
              </InputGroup>
              <InputGroup>
                <Label>Valor (R$)</Label>
                <Input
                  placeholder="0,00"
                  {...register('amount')}
                  $hasError={!!errors.amount}
                />
                {errors.amount && (
                  <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>
                    {errors.amount.message}
                  </span>
                )}
              </InputGroup>
              <InputGroup>
                <Label>Tipo</Label>
                <Select {...register('type')}>
                  <option value="income">Receita</option>
                  <option value="expense">Despesa</option>
                </Select>
              </InputGroup>
              <InputGroup>
                <Label>Data</Label>
                <Input
                  type="date"
                  {...register('date')}
                  $hasError={!!errors.date}
                />
                {errors.date && (
                  <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>
                    {errors.date.message}
                  </span>
                )}
              </InputGroup>
              <InputGroup>
                <Label>Categoria</Label>
                <Select {...register('categoryId')}>
                  <option value="">Selecione...</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </Select>
                {errors.categoryId && (
                  <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>
                    {errors.categoryId.message}
                  </span>
                )}
              </InputGroup>
              <ModalButtons>
                <CancelButton type="button" onClick={() => setModalOpen(false)}>
                  Cancelar
                </CancelButton>
                <SubmitButton type="submit">
                  {editing ? 'Salvar' : 'Criar'}
                </SubmitButton>
              </ModalButtons>
            </Form>
          </Modal>
        </ModalOverlay>
      )}
    </Layout>
  );
}
