import styled from 'styled-components';

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 1rem;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionCard = styled.section<{ $wide?: boolean }>`
  background: white;
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  ${({ $wide }) => $wide && 'grid-column: 1 / -1;'}
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const SectionTitle = styled.h2`
  color: #111827;
  font-size: 1rem;
  font-weight: 800;
`;

export const SectionText = styled.p`
  color: #6b7280;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

export const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const Label = styled.label`
  color: #374151;
  font-size: 0.8rem;
  font-weight: 700;
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #111827;
  background: white;
  font-size: 0.875rem;

  &:focus {
    border-color: #2d6a4f;
    outline: none;
  }

  &:read-only,
  &:disabled {
    background: #f9fafb;
    color: #4b5563;
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
    outline: none;
  }
`;

export const ActionRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  grid-column: 1 / -1;
`;

export const PrimaryButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: #1a3c2b;
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;

  &:hover:not(:disabled) {
    background: #2d6a4f;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  grid-column: 1 / -1;
  color: #991b1b;
  background: #fee2e2;
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.875rem;
`;

export const SuccessMessage = styled.div`
  grid-column: 1 / -1;
  color: #065f46;
  background: #d1fae5;
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.875rem;
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
  font-weight: 800;
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

export const RoleBadge = styled.span`
  display: inline-flex;
  padding: 0.25rem 0.625rem;
  color: #1a3c2b;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 800;
`;

export const LoadingState = styled.div`
  color: #6b7280;
  padding: 2rem;
  text-align: center;
`;
