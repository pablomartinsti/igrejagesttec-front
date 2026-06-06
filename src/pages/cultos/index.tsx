import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout';
import { CultosService, CreateCultoData } from '../../services/cultos.service';
import { Culto, CultoCategory } from '../../services/api-types';
import { useAuth } from '../../contexts/auth.context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import {
  formatDate,
  formatDateDisplay,
  formatDateInput,
} from '../../utils/format-date';
import {
  PageHeader,
  HeaderActions,
  AddButton,
  SecondaryButton,
  CultosGrid,
  CultoCard,
  CultoDate,
  CultoType,
  CultoPreacher,
  CultoStats,
  StatItem,
  StatValue,
  StatLabel,
  CardActions,
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
  DetailButton,
  CategoryList,
  CategoryItem,
  CategoryTitle,
  DeleteCategoryButton,
} from './styles';

const cultoSchema = z.object({
  date: z.string().min(1, 'Data obrigatória'),
  categoryId: z.string().min(1, 'Categoria obrigatória'),
  preacher: z.string().optional(),
});

const cultoCategorySchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
});

type CultoFormData = z.infer<typeof cultoSchema>;
type CultoCategoryFormData = z.infer<typeof cultoCategorySchema>;

export function CultosPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = user?.role === 'ADMIN' || user?.role === 'TREASURER';
  const canDelete = user?.role === 'ADMIN';

  const [cultos, setCultos] = useState<Culto[]>([]);
  const [categories, setCategories] = useState<CultoCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editing, setEditing] = useState<Culto | null>(null);
  const [editingCategory, setEditingCategory] = useState<CultoCategory | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CultoFormData>({
    resolver: zodResolver(cultoSchema),
  });

  const {
    register: registerCat,
    handleSubmit: handleSubmitCat,
    reset: resetCat,
    setValue: setCategoryValue,
    formState: { errors: errorsCat },
  } = useForm<CultoCategoryFormData>({
    resolver: zodResolver(cultoCategorySchema),
  });

  const fetchCultos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await CultosService.index();
      setCultos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await CultosService.getCultoCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchCultos();
    fetchCategories();
  }, [fetchCultos, fetchCategories]);

  const openCreate = () => {
    setEditing(null);
    reset({ date: dayjs().format('YYYY-MM-DD'), categoryId: '', preacher: '' });
    setModalOpen(true);
  };

  const openEdit = (culto: Culto) => {
    setEditing(culto);
    setValue('date', formatDateInput(culto.date));
    setValue('categoryId', culto.categoryId);
    setValue('preacher', culto.preacher || '');
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm('Deletar este culto? Todos os dados vinculados serão removidos.')
    )
      return;
    try {
      await CultosService.delete(id);
      await fetchCultos();
    } catch {
      alert('Erro ao deletar culto.');
    }
  };

  const onSubmit = async (data: CultoFormData) => {
    try {
      const payload: CreateCultoData = {
        date: formatDate(data.date),
        categoryId: data.categoryId,
        preacher: data.preacher,
      };
      if (editing) {
        await CultosService.update(editing.id, payload);
      } else {
        await CultosService.create(payload);
      }
      setModalOpen(false);
      await fetchCultos();
    } catch {
      alert('Erro ao salvar culto.');
    }
  };

  const onSubmitCategory = async (data: CultoCategoryFormData) => {
    try {
      if (editingCategory) {
        await CultosService.updateCultoCategory(editingCategory.id, data.title);
      } else {
        await CultosService.createCultoCategory(data.title);
      }
      setEditingCategory(null);
      resetCat();
      await fetchCategories();
    } catch {
      alert('Erro ao salvar categoria.');
    }
  };

  const handleEditCategory = (category: CultoCategory) => {
    setEditingCategory(category);
    setCategoryValue('title', category.title);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Deletar esta categoria?')) return;
    try {
      await CultosService.deleteCultoCategory(id);
      await fetchCategories();
    } catch {
      alert('Erro ao deletar categoria.');
    }
  };

  return (
    <Layout title="Cultos">
      {canManage && (
        <PageHeader>
          <HeaderActions>
            <SecondaryButton onClick={() => setCategoryModalOpen(true)}>
              ⚙️ Categorias
            </SecondaryButton>
            <AddButton onClick={openCreate}>+ Novo culto</AddButton>
          </HeaderActions>
        </PageHeader>
      )}

      {loading ? (
        <LoadingState>Carregando...</LoadingState>
      ) : cultos.length === 0 ? (
        <EmptyState>Nenhum culto cadastrado.</EmptyState>
      ) : (
        <CultosGrid>
          {cultos.map(culto => (
            <CultoCard key={culto.id}>
              <CultoDate>{formatDateDisplay(culto.date)}</CultoDate>
              <CultoType>{culto.category.title}</CultoType>
              {culto.preacher && (
                <CultoPreacher>Pregador: {culto.preacher}</CultoPreacher>
              )}
              <CultoStats>
                <StatItem>
                  <StatValue>{culto.spiritualRecords.length}</StatValue>
                  <StatLabel>Registros</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{culto.transactions.length}</StatValue>
                  <StatLabel>Transações</StatLabel>
                </StatItem>
              </CultoStats>
              <CardActions>
                <DetailButton onClick={() => navigate(`/cultos/${culto.id}`)}>
                  Ver detalhes
                </DetailButton>
                {canManage && (
                  <>
                    <ActionButton
                      $variant="edit"
                      onClick={() => openEdit(culto)}
                    >
                      ✏️
                    </ActionButton>
                    {canDelete && (
                      <ActionButton
                        $variant="delete"
                        onClick={() => handleDelete(culto.id)}
                      >
                      🗑️
                      </ActionButton>
                    )}
                  </>
                )}
              </CardActions>
            </CultoCard>
          ))}
        </CultosGrid>
      )}

      {/* Modal criar/editar culto */}
      {modalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <Modal onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <ModalTitle>{editing ? 'Editar culto' : 'Novo culto'}</ModalTitle>
            <Form onSubmit={handleSubmit(onSubmit)}>
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
                <Label>Tipo de culto</Label>
                <Select {...register('categoryId')}>
                  <option value="">Selecione...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
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
              <InputGroup>
                <Label>Pregador</Label>
                <Input
                  placeholder="Nome do pregador"
                  {...register('preacher')}
                />
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

      {/* Modal gerenciar categorias */}
      {categoryModalOpen && (
        <ModalOverlay onClick={() => setCategoryModalOpen(false)}>
          <Modal onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <ModalTitle>Categorias de culto</ModalTitle>
            <Form onSubmit={handleSubmitCat(onSubmitCategory)}>
              <InputGroup>
                <Label>Nova categoria</Label>
                <Input
                  placeholder="Ex: Culto de Jovens"
                  {...registerCat('title')}
                  $hasError={!!errorsCat.title}
                />
                {errorsCat.title && (
                  <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>
                    {errorsCat.title.message}
                  </span>
                )}
              </InputGroup>
              <ModalButtons>
                {editingCategory && (
                  <CancelButton
                    type="button"
                    onClick={() => {
                      setEditingCategory(null);
                      resetCat();
                    }}
                  >
                    Cancelar edicao
                  </CancelButton>
                )}
                <SubmitButton type="submit">
                  {editingCategory ? 'Salvar alteracao' : '+ Adicionar'}
                </SubmitButton>
              </ModalButtons>
            </Form>
            <CategoryList>
              {categories.map(cat => (
                <CategoryItem key={cat.id}>
                  <CategoryTitle>{cat.title}</CategoryTitle>
                  <ActionButton
                    type="button"
                    $variant="edit"
                    onClick={() => handleEditCategory(cat)}
                  >
                    Editar
                  </ActionButton>
                  {canDelete && (
                    <DeleteCategoryButton
                      onClick={() => handleDeleteCategory(cat.id)}
                    >
                      🗑️
                    </DeleteCategoryButton>
                  )}
                </CategoryItem>
              ))}
            </CategoryList>
            <ModalButtons>
              <SubmitButton
                type="button"
                onClick={() => setCategoryModalOpen(false)}
              >
                Fechar
              </SubmitButton>
            </ModalButtons>
          </Modal>
        </ModalOverlay>
      )}
    </Layout>
  );
}
