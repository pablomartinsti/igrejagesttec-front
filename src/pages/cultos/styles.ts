import styled from 'styled-components';

export const PageHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
`;

export const AddButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: #1a3c2b;
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #2d6a4f;
  }
`;

export const CultosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

export const CultoCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  border-top: 4px solid #1a3c2b;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CultoDate = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
`;

export const CultoType = styled.div`
  font-size: 0.875rem;
  color: #1a3c2b;
  font-weight: 500;
`;

export const CultoPreacher = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
`;

export const CultoStats = styled.div`
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
`;

export const StatItem = styled.div`
  flex: 1;
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`;

export const StatLabel = styled.div`
  font-size: 0.7rem;
  color: #6b7280;
`;

export const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const DetailButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  background: #1a3c2b;
  color: white;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #2d6a4f;
  }
`;

export const ActionButton = styled.button<{ $variant: 'edit' | 'delete' }>`
  padding: 0.5rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  background: ${({ $variant }) =>
    $variant === 'edit' ? '#EFF6FF' : '#FEF2F2'};
  color: ${({ $variant }) => ($variant === 'edit' ? '#2563EB' : '#DC2626')};

  &:hover {
    background: ${({ $variant }) =>
      $variant === 'edit' ? '#DBEAFE' : '#FEE2E2'};
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
`;

export const Modal = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
`;

export const ModalTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  padding: 0.75rem 1rem;
  border: 1.5px solid ${({ $hasError }) => ($hasError ? '#EF4444' : '#E5E7EB')};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #111827;

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? '#EF4444' : '#2D6A4F')};
    outline: none;
  }
`;

export const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
  background: white;

  &:focus {
    border-color: #2d6a4f;
    outline: none;
  }
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

export const CancelButton = styled.button`
  padding: 0.625rem 1.25rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  background: white;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
  }
`;

export const SubmitButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: #1a3c2b;
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #2d6a4f;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;
// adicione ao final do arquivo
export const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

export const SecondaryButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: white;
  color: #1a3c2b;
  border: 1.5px solid #1a3c2b;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #f0fdf4;
  }
`;

export const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
  max-height: 200px;
  overflow-y: auto;
`;

export const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0.875rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

export const CategoryTitle = styled.span`
  font-size: 0.875rem;
  color: #111827;
`;

export const DeleteCategoryButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: #dc2626;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background 0.2s;

  &:hover {
    background: #fee2e2;
  }
`;
