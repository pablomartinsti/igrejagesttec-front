import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layout } from '../../components/layout';
import { useAuth } from '../../contexts/auth.context';
import { CultosService } from '../../services/cultos.service';
import { CategoriesService } from '../../services/categories.service';
import { TransactionsService } from '../../services/transactions.service';
import {
  Category,
  Culto,
  SpiritualCategory,
  Transaction,
} from '../../services/api-types';
import { formatCurrency } from '../../utils/format-currency';
import { formatDate, formatDateDisplay } from '../../utils/format-date';
import {
  Amount,
  BackButton,
  CancelButton,
  CategoryBadge,
  ContentGrid,
  CultoSubtitle,
  CultoTitle,
  DeleteButton,
  EmptyState,
  ErrorMessage,
  ErrorState,
  Form,
  Header,
  HeaderActions,
  HeaderInfo,
  Input,
  InputGroup,
  Label,
  LoadingState,
  Modal,
  ModalButtons,
  ModalOverlay,
  ModalTitle,
  PrimaryButton,
  SecondaryButton,
  SectionCard,
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
  Select,
  SummaryCard,
  SummaryGrid,
  SummaryLabel,
  SummaryValue,
  Table,
  TableWrapper,
  Td,
  Th,
  TypeBadge,
} from './styles';

const amountSchema = z
  .string()
  .min(1, 'Valor obrigatorio')
  .refine(value => Number.isFinite(parseAmountToCents(value)), {
    message: 'Valor invalido',
  });

const transactionSchema = z.object({
  title: z.string().min(1, 'Titulo obrigatorio'),
  amount: amountSchema,
  categoryId: z.string().min(1, 'Categoria obrigatoria'),
});

const spiritualRecordSchema = z.object({
  categoryId: z.string().min(1, 'Categoria obrigatoria'),
  value: z
    .string()
    .min(1, 'Valor obrigatorio')
    .refine(value => Number(value) > 0, { message: 'Valor invalido' }),
});

const spiritualCategorySchema = z.object({
  title: z.string().min(1, 'Titulo obrigatorio'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;
type SpiritualRecordFormData = z.infer<typeof spiritualRecordSchema>;
type SpiritualCategoryFormData = z.infer<typeof spiritualCategorySchema>;
type ModalType = 'transaction' | 'spiritual' | 'spiritualCategory';

function parseAmountToCents(value: string) {
  const normalized = value
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : Number.NaN;
}

function getTransactionId(transaction: Transaction) {
  return transaction._id || (transaction as unknown as { id?: string }).id || '';
}

function getCategoryId(category: Category) {
  return category._id || (category as unknown as { id?: string }).id || '';
}

export function CultoDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = user?.role === 'ADMIN' || user?.role === 'TREASURER';
  const canDelete = user?.role === 'ADMIN';

  const [culto, setCulto] = useState<Culto | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [spiritualCategories, setSpiritualCategories] = useState<
    SpiritualCategory[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [editingSpiritualCategory, setEditingSpiritualCategory] =
    useState<SpiritualCategory | null>(null);

  const {
    register: registerTransaction,
    handleSubmit: handleSubmitTransaction,
    reset: resetTransaction,
    formState: { errors: errorsTransaction },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
  });

  const {
    register: registerSpiritual,
    handleSubmit: handleSubmitSpiritual,
    reset: resetSpiritual,
    formState: { errors: errorsSpiritual },
  } = useForm<SpiritualRecordFormData>({
    resolver: zodResolver(spiritualRecordSchema),
  });

  const {
    register: registerSpiritualCategory,
    handleSubmit: handleSubmitSpiritualCategory,
    reset: resetSpiritualCategory,
    setValue: setSpiritualCategoryValue,
    formState: { errors: errorsSpiritualCategory },
  } = useForm<SpiritualCategoryFormData>({
    resolver: zodResolver(spiritualCategorySchema),
  });

  const fetchCulto = useCallback(async () => {
    if (!id) return;
    try {
      setError('');
      const data = await CultosService.findById(id);
      setCulto(data);
    } catch {
      setError('Nao foi possivel carregar este culto.');
    }
  }, [id]);

  const fetchSupportData = useCallback(async () => {
    const [categoriesData, spiritualCategoriesData] = await Promise.all([
      CategoriesService.index(),
      CultosService.getSpiritualCategories(),
    ]);
    setCategories(categoriesData);
    setSpiritualCategories(spiritualCategoriesData);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        await Promise.all([fetchCulto(), fetchSupportData()]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [fetchCulto, fetchSupportData]);

  const totals = useMemo(() => {
    const totalEntradas =
      culto?.transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((acc, transaction) => acc + transaction.amount, 0) || 0;
    const totalSaidas =
      culto?.transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((acc, transaction) => acc + transaction.amount, 0) || 0;

    return {
      totalEntradas,
      totalSaidas,
      saldo: totalEntradas - totalSaidas,
    };
  }, [culto]);

  const closeModal = () => {
    setActiveModal(null);
    setEditingSpiritualCategory(null);
    resetSpiritualCategory();
    setSaving(false);
  };

  const onSubmitTransaction = async (data: TransactionFormData) => {
    if (!id || !culto) return;
    try {
      setSaving(true);
      await TransactionsService.create({
        title: data.title,
        amount: parseAmountToCents(data.amount),
        type: 'income',
        date: formatDate(culto.date),
        categoryId: data.categoryId,
        cultoId: id,
      });
      resetTransaction({
        title: '',
        amount: '',
        categoryId: '',
      });
      closeModal();
      await fetchCulto();
    } catch {
      alert('Erro ao salvar lancamento.');
    } finally {
      setSaving(false);
    }
  };

  const onSubmitSpiritual = async (data: SpiritualRecordFormData) => {
    if (!id) return;
    try {
      setSaving(true);
      await CultosService.addSpiritualRecord(id, {
        categoryId: data.categoryId,
        value: Number(data.value),
      });
      resetSpiritual();
      closeModal();
      await fetchCulto();
    } catch {
      alert('Erro ao salvar registro espiritual.');
    } finally {
      setSaving(false);
    }
  };

  const onSubmitSpiritualCategory = async (
    data: SpiritualCategoryFormData,
  ) => {
    try {
      setSaving(true);
      if (editingSpiritualCategory) {
        await CultosService.updateSpiritualCategory(
          editingSpiritualCategory.id,
          data.title,
        );
      } else {
        await CultosService.createSpiritualCategory(data.title);
      }
      setEditingSpiritualCategory(null);
      resetSpiritualCategory();
      await fetchSupportData();
    } catch {
      alert('Erro ao salvar categoria espiritual.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSpiritualCategory = (category: SpiritualCategory) => {
    setEditingSpiritualCategory(category);
    setSpiritualCategoryValue('title', category.title);
  };

  const handleDeleteSpiritualCategory = async (categoryId: string) => {
    if (!confirm('Excluir esta categoria espiritual?')) return;
    try {
      await CultosService.deleteSpiritualCategory(categoryId);
      await fetchSupportData();
    } catch {
      alert('Nao foi possivel excluir. Verifique se existem registros vinculados.');
    }
  };

  const handleRemoveTransaction = async (transactionId: string) => {
    if (!transactionId || !confirm('Remover este lancamento financeiro?')) {
      return;
    }
    await TransactionsService.delete(transactionId);
    await fetchCulto();
  };

  const handleRemoveSpiritualRecord = async (recordId: string) => {
    if (!id || !confirm('Remover este registro espiritual?')) return;
    await CultosService.removeSpiritualRecord(id, recordId);
    await fetchCulto();
  };

  if (loading) {
    return (
      <Layout title="Culto">
        <LoadingState>Carregando culto...</LoadingState>
      </Layout>
    );
  }

  if (!culto) {
    return (
      <Layout title="Culto">
        {error && <ErrorState>{error}</ErrorState>}
        <SecondaryButton onClick={() => navigate('/cultos')}>
          Voltar para cultos
        </SecondaryButton>
      </Layout>
    );
  }

  return (
    <Layout title="Detalhes do culto">
      <Header>
        <HeaderInfo>
          <BackButton onClick={() => navigate('/cultos')}>
            Voltar para cultos
          </BackButton>
          <CultoTitle>{culto.category.title}</CultoTitle>
          <CultoSubtitle>
            {formatDateDisplay(culto.date)}
            {culto.preacher ? ` - Pregador: ${culto.preacher}` : ''}
          </CultoSubtitle>
        </HeaderInfo>
        {canManage && (
          <HeaderActions>
            <SecondaryButton onClick={() => setActiveModal('spiritualCategory')}>
              Categoria espiritual
            </SecondaryButton>
            <PrimaryButton onClick={() => setActiveModal('spiritual')}>
              Registro espiritual
            </PrimaryButton>
            <PrimaryButton onClick={() => setActiveModal('transaction')}>
              Lancamento
            </PrimaryButton>
          </HeaderActions>
        )}
      </Header>

      {error && <ErrorState>{error}</ErrorState>}

      <SummaryGrid>
        <SummaryCard $variant="income">
          <SummaryLabel>Entradas</SummaryLabel>
          <SummaryValue $variant="income">
            {formatCurrency(totals.totalEntradas)}
          </SummaryValue>
        </SummaryCard>
        <SummaryCard $variant="expense">
          <SummaryLabel>Saidas</SummaryLabel>
          <SummaryValue $variant="expense">
            {formatCurrency(totals.totalSaidas)}
          </SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Saldo do culto</SummaryLabel>
          <SummaryValue>{formatCurrency(totals.saldo)}</SummaryValue>
        </SummaryCard>
      </SummaryGrid>

      <ContentGrid>
        <SectionCard>
          <SectionHeader>
            <div>
              <SectionTitle>Registros espirituais</SectionTitle>
              <SectionSubtitle>Numeros acompanhados neste culto</SectionSubtitle>
            </div>
          </SectionHeader>
          {culto.spiritualRecords.length === 0 ? (
            <EmptyState>Nenhum registro espiritual informado.</EmptyState>
          ) : (
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>Categoria</Th>
                    <Th>Valor</Th>
                    {canDelete && <Th>Acoes</Th>}
                  </tr>
                </thead>
                <tbody>
                  {culto.spiritualRecords.map(record => (
                    <tr key={record.id}>
                      <Td>{record.category.title}</Td>
                      <Td>{record.value}</Td>
                      {canDelete && (
                        <Td>
                          <DeleteButton
                            onClick={() =>
                              handleRemoveSpiritualRecord(record.id)
                            }
                          >
                            Remover
                          </DeleteButton>
                        </Td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          )}
        </SectionCard>

        <SectionCard $wide>
          <SectionHeader>
            <div>
              <SectionTitle>Transacoes vinculadas ao culto</SectionTitle>
              <SectionSubtitle>Entradas e saidas lancadas neste culto</SectionSubtitle>
            </div>
          </SectionHeader>
          {culto.transactions.length === 0 ? (
            <EmptyState>Nenhuma transacao vinculada a este culto.</EmptyState>
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
                    {canDelete && <Th>Acoes</Th>}
                  </tr>
                </thead>
                <tbody>
                  {culto.transactions.map(transaction => (
                    <tr key={getTransactionId(transaction)}>
                      <Td>{formatDateDisplay(transaction.date)}</Td>
                      <Td>{transaction.title}</Td>
                      <Td>
                        <CategoryBadge $color={transaction.category.color}>
                          {transaction.category.title}
                        </CategoryBadge>
                      </Td>
                      <Td>
                        <TypeBadge $type={transaction.type}>
                          {transaction.type === 'income'
                            ? 'Entrada'
                            : 'Saida'}
                        </TypeBadge>
                      </Td>
                      <Td>
                        <Amount $variant={transaction.type}>
                          {formatCurrency(transaction.amount)}
                        </Amount>
                      </Td>
                      {canDelete && (
                        <Td>
                          <DeleteButton
                            onClick={() =>
                              handleRemoveTransaction(
                                getTransactionId(transaction),
                              )
                            }
                          >
                            Remover
                          </DeleteButton>
                        </Td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          )}
        </SectionCard>
      </ContentGrid>

      {activeModal === 'transaction' && (
        <ModalOverlay onClick={closeModal}>
          <Modal onClick={event => event.stopPropagation()}>
            <ModalTitle>Novo lancamento do culto</ModalTitle>
            <Form onSubmit={handleSubmitTransaction(onSubmitTransaction)}>
              <InputGroup>
                <Label>Titulo</Label>
                <Input
                  placeholder="Ex: Oferta missionaria"
                  {...registerTransaction('title')}
                  $hasError={!!errorsTransaction.title}
                />
                {errorsTransaction.title && (
                  <ErrorMessage>{errorsTransaction.title.message}</ErrorMessage>
                )}
              </InputGroup>
              <InputGroup>
                <Label>Valor</Label>
                <Input
                  placeholder="0,00"
                  {...registerTransaction('amount')}
                  $hasError={!!errorsTransaction.amount}
                />
                {errorsTransaction.amount && (
                  <ErrorMessage>{errorsTransaction.amount.message}</ErrorMessage>
                )}
              </InputGroup>
              <InputGroup>
                <Label>Categoria financeira</Label>
                <Select
                  {...registerTransaction('categoryId')}
                  disabled={categories.length === 0}
                >
                  <option value="">Selecione...</option>
                  {categories.map(category => (
                    <option
                      key={getCategoryId(category)}
                      value={getCategoryId(category)}
                    >
                      {category.title}
                    </option>
                  ))}
                </Select>
                {errorsTransaction.categoryId && (
                  <ErrorMessage>
                    {errorsTransaction.categoryId.message}
                  </ErrorMessage>
                )}
              </InputGroup>
              <ModalButtons>
                <CancelButton type="button" onClick={closeModal}>
                  Cancelar
                </CancelButton>
                <PrimaryButton type="submit" disabled={saving}>
                  Salvar
                </PrimaryButton>
              </ModalButtons>
            </Form>
          </Modal>
        </ModalOverlay>
      )}

      {activeModal === 'spiritual' && (
        <ModalOverlay onClick={closeModal}>
          <Modal onClick={event => event.stopPropagation()}>
            <ModalTitle>Novo registro espiritual</ModalTitle>
            <Form onSubmit={handleSubmitSpiritual(onSubmitSpiritual)}>
              <InputGroup>
                <Label>Categoria</Label>
                <Select
                  {...registerSpiritual('categoryId')}
                  disabled={spiritualCategories.length === 0}
                >
                  <option value="">Selecione...</option>
                  {spiritualCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </Select>
                {errorsSpiritual.categoryId && (
                  <ErrorMessage>
                    {errorsSpiritual.categoryId.message}
                  </ErrorMessage>
                )}
              </InputGroup>
              <InputGroup>
                <Label>Valor</Label>
                <Input
                  placeholder="Ex: 3"
                  {...registerSpiritual('value')}
                  $hasError={!!errorsSpiritual.value}
                />
                {errorsSpiritual.value && (
                  <ErrorMessage>{errorsSpiritual.value.message}</ErrorMessage>
                )}
              </InputGroup>
              <ModalButtons>
                <CancelButton type="button" onClick={closeModal}>
                  Cancelar
                </CancelButton>
                <PrimaryButton type="submit" disabled={saving}>
                  Salvar
                </PrimaryButton>
              </ModalButtons>
            </Form>
          </Modal>
        </ModalOverlay>
      )}

      {activeModal === 'spiritualCategory' && (
        <ModalOverlay onClick={closeModal}>
          <Modal onClick={event => event.stopPropagation()}>
            <ModalTitle>Categorias espirituais</ModalTitle>
            <Form
              onSubmit={handleSubmitSpiritualCategory(
                onSubmitSpiritualCategory,
              )}
            >
              <InputGroup>
                <Label>Titulo</Label>
                <Input
                  placeholder="Ex: Decisoes, Visitantes, Batismos"
                  {...registerSpiritualCategory('title')}
                  $hasError={!!errorsSpiritualCategory.title}
                />
                {errorsSpiritualCategory.title && (
                  <ErrorMessage>
                    {errorsSpiritualCategory.title.message}
                  </ErrorMessage>
                )}
              </InputGroup>
              <ModalButtons>
                {editingSpiritualCategory && (
                  <CancelButton
                    type="button"
                    onClick={() => {
                      setEditingSpiritualCategory(null);
                      resetSpiritualCategory();
                    }}
                  >
                    Cancelar edicao
                  </CancelButton>
                )}
                <PrimaryButton type="submit" disabled={saving}>
                  {editingSpiritualCategory ? 'Salvar alteracao' : 'Criar'}
                </PrimaryButton>
              </ModalButtons>
            </Form>
            <TableWrapper>
              <Table>
                <tbody>
                  {spiritualCategories.map(category => (
                    <tr key={category.id}>
                      <Td>{category.title}</Td>
                      <Td>
                        <SecondaryButton
                          type="button"
                          onClick={() => handleEditSpiritualCategory(category)}
                        >
                          Editar
                        </SecondaryButton>
                      </Td>
                      {canDelete && (
                        <Td>
                          <DeleteButton
                            type="button"
                            onClick={() =>
                              handleDeleteSpiritualCategory(category.id)
                            }
                          >
                            Excluir
                          </DeleteButton>
                        </Td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
            <ModalButtons>
              <CancelButton type="button" onClick={closeModal}>
                Fechar
              </CancelButton>
            </ModalButtons>
          </Modal>
        </ModalOverlay>
      )}
    </Layout>
  );
}
