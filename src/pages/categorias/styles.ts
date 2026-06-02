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

export const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  border-collapse: collapse;
  overflow: hidden;
`;

export const Th = styled.th`
  padding: 0.875rem 1.25rem;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`;

export const Td = styled.td`
  padding: 0.875rem 1.25rem;
  font-size: 0.875rem;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
`;

export const ColorBadge = styled.div<{ $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 2px solid #e5e7eb;
`;

export const ActionButton = styled.button<{ $variant: 'edit' | 'delete' }>`
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 500;
  margin-right: 0.5rem;
  transition: all 0.2s;
  background: ${({ $variant }) =>
    $variant === 'edit' ? '#EFF6FF' : '#FEF2F2'};
  color: ${({ $variant }) => ($variant === 'edit' ? '#2563EB' : '#DC2626')};

  &:hover {
    background: ${({ $variant }) =>
      $variant === 'edit' ? '#DBEAFE' : '#FEE2E2'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

export const ColorInput = styled.input`
  width: 60px;
  height: 40px;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  padding: 2px;
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
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
