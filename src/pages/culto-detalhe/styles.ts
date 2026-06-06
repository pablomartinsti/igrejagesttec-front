import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const BackButton = styled.button`
  color: #1a3c2b;
  background: transparent;
  font-size: 0.875rem;
  font-weight: 600;
  width: fit-content;
  padding: 0;
`;

export const CultoTitle = styled.h1`
  font-size: 1.5rem;
  color: #111827;
  line-height: 1.2;
`;

export const CultoSubtitle = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const PrimaryButton = styled.button`
  padding: 0.625rem 1rem;
  background: #1a3c2b;
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #2d6a4f;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  padding: 0.625rem 1rem;
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

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.div<{ $variant?: 'income' | 'expense' }>`
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  border-left: 4px solid
    ${({ $variant }) =>
      $variant === 'income'
        ? '#10B981'
        : $variant === 'expense'
          ? '#EF4444'
          : '#1A3C2B'};
`;

export const SummaryLabel = styled.div`
  color: #6b7280;
  font-size: 0.8rem;
  margin-bottom: 0.375rem;
`;

export const SummaryValue = styled.div<{ $variant?: 'income' | 'expense' }>`
  color: ${({ $variant }) =>
    $variant === 'income'
      ? '#10B981'
      : $variant === 'expense'
        ? '#EF4444'
        : '#111827'};
  font-size: 1.25rem;
  font-weight: 700;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionCard = styled.section<{ $wide?: boolean }>`
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  ${({ $wide }) => $wide && 'grid-column: 1 / -1;'}
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const SectionTitle = styled.h2`
  color: #111827;
  font-size: 1rem;
  font-weight: 700;
`;

export const SectionSubtitle = styled.p`
  color: #6b7280;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  padding: 0.75rem;
  color: #6b7280;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 0.75rem;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  vertical-align: middle;
`;

export const Amount = styled.span<{ $variant?: 'income' | 'expense' }>`
  color: ${({ $variant }) =>
    $variant === 'income'
      ? '#10B981'
      : $variant === 'expense'
        ? '#EF4444'
        : '#111827'};
  font-weight: 700;
  white-space: nowrap;
`;

export const CategoryBadge = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ $color }) => $color || '#1A3C2B'};
    flex-shrink: 0;
  }
`;

export const TypeBadge = styled.span<{ $type: 'income' | 'expense' }>`
  display: inline-flex;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  color: ${({ $type }) => ($type === 'income' ? '#065F46' : '#991B1B')};
  background: ${({ $type }) => ($type === 'income' ? '#D1FAE5' : '#FEE2E2')};
  font-size: 0.75rem;
  font-weight: 700;
`;

export const DeleteButton = styled.button`
  padding: 0.375rem 0.625rem;
  border-radius: 0.375rem;
  background: #fef2f2;
  color: #dc2626;
  font-size: 0.8rem;
  font-weight: 600;

  &:hover {
    background: #fee2e2;
  }
`;

export const EmptyState = styled.div`
  color: #9ca3af;
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
`;

export const LoadingState = styled.div`
  color: #6b7280;
  padding: 3rem;
  text-align: center;
`;

export const ErrorState = styled.div`
  color: #991b1b;
  background: #fee2e2;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 100;
`;

export const Modal = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
`;

export const ModalTitle = styled.h2`
  color: #111827;
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const Label = styled.label`
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  padding: 0.75rem 1rem;
  border: 1.5px solid ${({ $hasError }) => ($hasError ? '#EF4444' : '#E5E7EB')};
  border-radius: 0.5rem;
  color: #111827;
  font-size: 0.875rem;

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? '#EF4444' : '#2D6A4F')};
  }
`;

export const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #111827;
  background: white;
  font-size: 0.875rem;

  &:focus {
    border-color: #2d6a4f;
  }
`;

export const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
`;

export const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const CancelButton = styled.button`
  padding: 0.625rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #374151;
  background: white;
  font-size: 0.875rem;
  font-weight: 600;

  &:hover {
    background: #f9fafb;
  }
`;
