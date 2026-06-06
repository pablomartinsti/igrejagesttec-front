import styled from 'styled-components';

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div<{
  $variant: 'default' | 'cash' | 'income' | 'expense';
}>`
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  border-left: 4px solid
    ${({ $variant }) =>
      $variant === 'cash'
        ? '#1A3C2B'
        : $variant === 'income'
        ? '#10B981'
        : $variant === 'expense'
          ? '#EF4444'
          : '#3B82F6'};

  &[hidden] {
    display: none;
  }
`;

export const CardIcon = styled.div`
  font-size: 2rem;
`;

export const CardTitle = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

export const CardValue = styled.div<{
  $variant: 'default' | 'cash' | 'income' | 'expense';
}>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $variant }) =>
    $variant === 'cash'
      ? '#1A3C2B'
      : $variant === 'income'
      ? '#10B981'
      : $variant === 'expense'
        ? '#EF4444'
        : '#111827'};
`;

export const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
`;

export const SectionSubtitle = styled.p`
  font-size: 0.8rem;
  color: #6b7280;
`;

export const FiltersRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const FilterLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
`;

export const FilterInput = styled.input`
  padding: 0.5rem 0.75rem;
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

export const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background: #1a3c2b;
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s;
  height: 38px;

  &:hover:not(:disabled) {
    background: #2d6a4f;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ChartCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  margin-bottom: 1.5rem;
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
  font-size: 0.875rem;
`;

export const YearFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
