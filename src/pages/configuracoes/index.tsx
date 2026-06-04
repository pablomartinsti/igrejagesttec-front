import { FormEvent, useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Layout } from '../../components/layout';
import { useAuth } from '../../contexts/auth.context';
import { Church, User } from '../../services/api-types';
import { ChurchesService, UpdateChurchData } from '../../services/churches.service';
import { CreateUserData, UsersService } from '../../services/users.service';
import {
  ActionRow,
  ContentGrid,
  ErrorMessage,
  FieldGroup,
  Form,
  Input,
  Label,
  LoadingState,
  PrimaryButton,
  RoleBadge,
  SectionCard,
  SectionHeader,
  SectionText,
  SectionTitle,
  Select,
  SuccessMessage,
  Table,
  TableWrapper,
  Td,
  Th,
} from './styles';

const roleLabels = {
  ADMIN: 'Administrador',
  TREASURER: 'Tesoureiro',
  PASTOR: 'Pastor',
};

const initialForm: CreateUserData = {
  name: '',
  email: '',
  password: '',
  role: 'TREASURER',
};

const initialChurchForm = {
  name: '',
  cnpj: '',
  responsibleName: '',
  phone: '',
  email: '',
  street: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
};

function toChurchForm(church?: Church | null) {
  return {
    name: church?.name || '',
    cnpj: church?.cnpj || '',
    responsibleName: church?.responsibleName || '',
    phone: church?.phone || '',
    email: church?.email || '',
    street: church?.street || '',
    neighborhood: church?.neighborhood || '',
    city: church?.city || '',
    state: church?.state || '',
    zipCode: church?.zipCode || '',
  };
}

export function ConfiguracoesPage() {
  const { church, updateChurch } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<CreateUserData>(initialForm);
  const [churchForm, setChurchForm] = useState(() =>
    church ? toChurchForm(church) : initialChurchForm,
  );
  const [loadingChurch, setLoadingChurch] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [savingChurch, setSavingChurch] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchChurch = useCallback(async () => {
    try {
      setLoadingChurch(true);
      const data = await ChurchesService.show();
      setChurchForm(toChurchForm(data));
      updateChurch(data);
    } catch {
      setError('Nao foi possivel carregar os dados da igreja.');
    } finally {
      setLoadingChurch(false);
    }
  }, [updateChurch]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const data = await UsersService.index();
      setUsers(data);
    } catch {
      setError('Nao foi possivel carregar os usuarios.');
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchChurch();
    fetchUsers();
  }, [fetchChurch, fetchUsers]);

  const handleChurchSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!churchForm.name.trim()) {
      setError('Informe o nome da igreja.');
      return;
    }

    try {
      setSavingChurch(true);
      const payload: UpdateChurchData = {
        name: churchForm.name,
        cnpj: churchForm.cnpj,
        responsibleName: churchForm.responsibleName,
        phone: churchForm.phone,
        email: churchForm.email,
        street: churchForm.street,
        neighborhood: churchForm.neighborhood,
        city: churchForm.city,
        state: churchForm.state,
        zipCode: churchForm.zipCode,
      };
      const updatedChurch = await ChurchesService.update(payload);
      setChurchForm(toChurchForm(updatedChurch));
      updateChurch(updatedChurch);
      setSuccess('Dados da igreja salvos com sucesso.');
    } catch {
      setError('Nao foi possivel salvar os dados da igreja.');
    } finally {
      setSavingChurch(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setError('Informe nome, e-mail e uma senha com pelo menos 6 caracteres.');
      return;
    }

    try {
      setSaving(true);
      await UsersService.create({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
      });
      setForm(initialForm);
      setSuccess('Usuario criado com sucesso.');
      await fetchUsers();
    } catch {
      setError('Nao foi possivel criar o usuario.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Configuracoes">
      <ContentGrid>
        <SectionCard>
          <SectionHeader>
            <div>
              <SectionTitle>Dados da igreja</SectionTitle>
              <SectionText>Informacoes usadas nos relatorios e impressos</SectionText>
            </div>
          </SectionHeader>
          <Form onSubmit={handleChurchSubmit}>
            <FieldGroup>
              <Label>Nome</Label>
              <Input
                value={churchForm.name}
                disabled={loadingChurch}
                onChange={event =>
                  setChurchForm(current => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label>CNPJ</Label>
              <Input
                value={churchForm.cnpj}
                disabled={loadingChurch}
                onChange={event =>
                  setChurchForm(current => ({
                    ...current,
                    cnpj: event.target.value,
                  }))
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Responsavel</Label>
              <Input
                value={churchForm.responsibleName}
                disabled={loadingChurch}
                onChange={event =>
                  setChurchForm(current => ({
                    ...current,
                    responsibleName: event.target.value,
                  }))
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Telefone</Label>
              <Input
                value={churchForm.phone}
                disabled={loadingChurch}
                onChange={event =>
                  setChurchForm(current => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label>E-mail</Label>
              <Input
                type="email"
                value={churchForm.email}
                disabled={loadingChurch}
                onChange={event =>
                  setChurchForm(current => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label>CEP</Label>
              <Input
                value={churchForm.zipCode}
                disabled={loadingChurch}
                onChange={event =>
                  setChurchForm(current => ({
                    ...current,
                    zipCode: event.target.value,
                  }))
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Rua</Label>
              <Input
                value={churchForm.street}
                disabled={loadingChurch}
                onChange={event =>
                  setChurchForm(current => ({
                    ...current,
                    street: event.target.value,
                  }))
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Bairro</Label>
              <Input
                value={churchForm.neighborhood}
                disabled={loadingChurch}
                onChange={event =>
                  setChurchForm(current => ({
                    ...current,
                    neighborhood: event.target.value,
                  }))
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Cidade</Label>
              <Input
                value={churchForm.city}
                disabled={loadingChurch}
                onChange={event =>
                  setChurchForm(current => ({
                    ...current,
                    city: event.target.value,
                  }))
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Estado</Label>
              <Input
                value={churchForm.state}
                disabled={loadingChurch}
                onChange={event =>
                  setChurchForm(current => ({
                    ...current,
                    state: event.target.value,
                  }))
                }
              />
            </FieldGroup>
            <ActionRow>
              <PrimaryButton type="submit" disabled={savingChurch}>
                {savingChurch ? 'Salvando...' : 'Salvar dados da igreja'}
              </PrimaryButton>
            </ActionRow>
          </Form>
        </SectionCard>

        <SectionCard>
          <SectionHeader>
            <div>
              <SectionTitle>Novo usuario</SectionTitle>
              <SectionText>Cadastro administrativo da igreja</SectionText>
            </div>
          </SectionHeader>

          <Form onSubmit={handleSubmit}>
            <FieldGroup>
              <Label>Nome</Label>
              <Input
                value={form.name}
                onChange={event =>
                  setForm(current => ({ ...current, name: event.target.value }))
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label>E-mail</Label>
              <Input
                type="email"
                value={form.email}
                onChange={event =>
                  setForm(current => ({ ...current, email: event.target.value }))
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Senha</Label>
              <Input
                type="password"
                value={form.password}
                onChange={event =>
                  setForm(current => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Perfil</Label>
              <Select
                value={form.role}
                onChange={event =>
                  setForm(current => ({
                    ...current,
                    role: event.target.value as CreateUserData['role'],
                  }))
                }
              >
                <option value="TREASURER">Tesoureiro</option>
                <option value="PASTOR">Pastor</option>
                <option value="ADMIN">Administrador</option>
              </Select>
            </FieldGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            <ActionRow>
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? 'Salvando...' : 'Criar usuario'}
              </PrimaryButton>
            </ActionRow>
          </Form>
        </SectionCard>

        <SectionCard $wide>
          <SectionHeader>
            <div>
              <SectionTitle>Usuarios</SectionTitle>
              <SectionText>Acessos cadastrados nesta igreja</SectionText>
            </div>
          </SectionHeader>

          {loadingUsers ? (
            <LoadingState>Carregando usuarios...</LoadingState>
          ) : (
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>Nome</Th>
                    <Th>E-mail</Th>
                    <Th>Perfil</Th>
                    <Th>Criado em</Th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <Td>{user.name}</Td>
                      <Td>{user.email}</Td>
                      <Td>
                        <RoleBadge>{roleLabels[user.role]}</RoleBadge>
                      </Td>
                      <Td>
                        {user.createdAt
                          ? dayjs(user.createdAt).format('DD/MM/YYYY')
                          : '-'}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          )}
        </SectionCard>
      </ContentGrid>
    </Layout>
  );
}
