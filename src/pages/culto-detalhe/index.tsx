import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
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

const dizimistaSchema = z.object({
  name: z.string().optional(),
  amount: amountSchema,
  contributionType: z.string().optional(),
});

const transactionSchema = z.object({
  title: z.string().min(1, 'Titulo obrigatorio'),
  amount: amountSchema,
  type: z.enum(['income', 'expense']),
  date: z.string().min(1, 'Data obrigatoria'),
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

type DizimistaFormData = z.infer<typeof dizimistaSchema>;
type TransactionFormData = z.infer<typeof transactionSchema>;
type SpiritualRecordFormData = z.infer<typeof spiritualRecordSchema>;
type SpiritualCategoryFormData = z.infer<typeof spiritualCategorySchema>;
type ModalType = 'dizimista' | 'transaction' | 'spiritual' | 'spiritualCategory';

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

  const {
    register: registerDizimista,
    handleSubmit: handleSubmitDizimista,
    reset: resetDizimista,
    formState: { errors: errorsDizimista },
  } = useForm<DizimistaFormData>({
    resolver: zodResolver(dizimistaSchema),
  });

  const {
    register: registerTransaction,
    handleSubmit: handleSubmitTransaction,
    reset: resetTransaction,
    formState: { errors: errorsTransaction },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'income',
      date: dayjs().format('YYYY-MM-DD'),
    },
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
    const totalDizimos =
      culto?.dizimistas.reduce((acc, item) => acc + item.amount, 0) || 0;
    const totalEntradas =
      culto?.transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((acc, transaction) => acc + transaction.amount, 0) || 0;
    const totalSaidas =
      culto?.transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((acc, transaction) => acc + transaction.amount, 0) || 0;

    return {
      totalDizimos,
      totalEntradas,
      totalSaidas,
      saldo: totalDizimos + totalEntradas - totalSaidas,
    };
  }, [culto]);

  const closeModal = () => {
    setActiveModal(null);
    setSaving(false);
  };

  const onSubmitDizimista = async (data: DizimistaFormData) => {
    if (!id) return;
    try {
      setSaving(true);
      await CultosService.addDizimista(id, {
        name: data.name || undefined,
        contributionType: data.contributionType || undefined,
        amount: parseAmountToCents(data.amount),
      });
      resetDizimista();
      closeModal();
      await fetchCulto();
    } catch {
      alert('Erro ao salvar dizimista.');
    } finally {
      setSaving(false);
    }
  };

  const onSubmitTransaction = async (data: TransactionFormData) => {
    if (!id) return;
    try {
      setSaving(true);
      await TransactionsService.create({
        title: data.title,
        amount: parseAmountToCents(data.amount),
        type: data.type,
        date: formatDate(data.date),
        categoryId: data.categoryId,
        cultoId: id,
      });
      resetTransaction({
        title: '',
        amount: '',
        type: 'income',
        date: dayjs().format('YYYY-MM-DD'),
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
      await CultosService.createSpiritualCategory(data.title);
      resetSpiritualCategory();
      await fetchSupportData();
      closeModal();
    } catch {
      alert('Erro ao criar categoria espiritual.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveDizimista = async (dizimistaId: string) => {
    if (!id || !confirm('Remover este lancamento de dizimo/oferta?')) return;
    await CultosService.removeDizimista(id, dizimistaId);
    await fetchCulto();
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
            <PrimaryButton onClick={() => setActiveModal('dizimista')}>
              Dizimo/oferta
            </PrimaryButton>
          </HeaderActions>
        )}
      </Header>

      {error && <ErrorState>{error}</ErrorState>}

      <SummaryGrid>
        <SummaryCard $variant="income">
          <SummaryLabel>Dizimos e ofertas</SummaryLabel>
          <SummaryValue $variant="income">
            {formatCurrency(totals.totalDizimos)}
          </SummaryValue>
        </SummaryCard>
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
              <SectionTitle>Dizimos e ofertas</SectionTitle>
              <SectionSubtitle>Contribuicoes registradas no culto</SectionSubtitle>
            </div>
          </SectionHeader>
          {culto.dizimistas.length === 0 ? (
            <EmptyState>Nenhum dizimo ou oferta registrado.</EmptyState>
          ) : (
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>Nome</Th>
                    <Th>Tipo</Th>
                    <Th>Valor</Th>
                    {canDelete && <Th>Acoes</Th>}
                  </tr>
                </thead>
                <tbody>
                  {culto.dizimistas.map(dizimista => (
                    <tr key={dizimista.id}>
                      <Td>{dizimista.name || 'Nao informado'}</Td>
                      <Td>{dizimista.contributionType || 'Geral'}</Td>
                      <Td>
                        <Amount $variant="income">
                          {formatCurrency(dizimista.amount)}
                        </Amount>
                      </Td>
                      {canDelete && (
                        <Td>
                          <DeleteButton
                            onClick={() => handleRemoveDizimista(dizimista.id)}
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

      {activeModal === 'dizimista' && (
        <ModalOverlay onClick={closeModal}>
          <Modal onClick={event => event.stopPropagation()}>
            <ModalTitle>Novo dizimo/oferta</ModalTitle>
            <Form onSubmit={handleSubmitDizimista(onSubmitDizimista)}>
              <InputGroup>
                <Label>Nome</Label>
                <Input
                  placeholder="Nome do contribuinte"
                  {...registerDizimista('name')}
                />
              </InputGroup>
              <InputGroup>
                <Label>Tipo</Label>
                <Input
                  placeholder="Ex: Dizimo, Oferta, Primicia"
                  {...registerDizimista('contributionType')}
                />
              </InputGroup>
              <InputGroup>
                <Label>Valor</Label>
                <Input
                  placeholder="0,00"
                  {...registerDizimista('amount')}
                  $hasError={!!errorsDizimista.amount}
                />
                {errorsDizimista.amount && (
                  <ErrorMessage>{errorsDizimista.amount.message}</ErrorMessage>
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
                <Label>Tipo</Label>
                <Select {...registerTransaction('type')}>
                  <option value="income">Entrada</option>
                  <option value="expense">Saida</option>
                </Select>
              </InputGroup>
              <InputGroup>
                <Label>Data</Label>
                <Input
                  type="date"
                  {...registerTransaction('date')}
                  $hasError={!!errorsTransaction.date}
                />
                {errorsTransaction.date && (
                  <ErrorMessage>{errorsTransaction.date.message}</ErrorMessage>
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
            <ModalTitle>Nova categoria espiritual</ModalTitle>
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
                <CancelButton type="button" onClick={closeModal}>
                  Cancelar
                </CancelButton>
                <PrimaryButton type="submit" disabled={saving}>
                  Criar
                </PrimaryButton>
              </ModalButtons>
            </Form>
          </Modal>
        </ModalOverlay>
      )}
    </Layout>
  );
}
