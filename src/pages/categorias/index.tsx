import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layout } from '../../components/layout';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../services/api-types';
import { useAuth } from '../../contexts/auth.context';
import {
  PageHeader,
  AddButton,
  Table,
  Th,
  Td,
  ColorBadge,
  ActionButton,
  Modal,
  ModalOverlay,
  ModalTitle,
  Form,
  InputGroup,
  Label,
  Input,
  ColorInput,
  ModalButtons,
  CancelButton,
  SubmitButton,
  EmptyState,
  LoadingState,
} from './styles';

const categorySchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  color: z.string().regex(/^#[A-Fa-f0-9]{6}$/, 'Cor inválida'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export function CategoriasPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { color: '#4CAF50' },
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await CategoriesService.index();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreate = () => {
    setEditing(null);
    reset({ title: '', color: '#4CAF50' });
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setValue('title', category.title);
    setValue('color', category.color);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja deletar esta categoria?')) return;
    try {
      setDeleting(id);
      await CategoriesService.delete(id);
      await fetchCategories();
    } catch {
      alert('Erro ao deletar categoria.');
    } finally {
      setDeleting(null);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editing) {
        await CategoriesService.update(editing._id, data);
      } else {
        await CategoriesService.create(data);
      }
      setModalOpen(false);
      await fetchCategories();
    } catch {
      alert('Erro ao salvar categoria.');
    }
  };

  return (
    <Layout title="Categorias">
      {isAdmin && (
        <PageHeader>
          <AddButton onClick={openCreate}>+ Nova categoria</AddButton>
        </PageHeader>
      )}

      {loading ? (
        <LoadingState>Carregando...</LoadingState>
      ) : categories.length === 0 ? (
        <EmptyState>Nenhuma categoria cadastrada.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Cor</Th>
              <Th>Título</Th>
              {isAdmin && <Th>Ações</Th>}
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category._id}>
                <Td>
                  <ColorBadge $color={category.color} />
                </Td>
                <Td>{category.title}</Td>
                {isAdmin && (
                  <Td>
                    <ActionButton
                      $variant="edit"
                      onClick={() => openEdit(category)}
                    >
                      ✏️ Editar
                    </ActionButton>
                    <ActionButton
                      $variant="delete"
                      onClick={() => handleDelete(category._id)}
                      disabled={deleting === category._id}
                    >
                      🗑️ Deletar
                    </ActionButton>
                  </Td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {modalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalTitle>
              {editing ? 'Editar categoria' : 'Nova categoria'}
            </ModalTitle>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <InputGroup>
                <Label>Título</Label>
                <Input
                  placeholder="Ex: Dízimos"
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
                <Label>Cor</Label>
                <ColorInput type="color" {...register('color')} />
                {errors.color && (
                  <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>
                    {errors.color.message}
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
