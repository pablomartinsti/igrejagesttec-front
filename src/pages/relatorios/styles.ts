import styled from 'styled-components';

export const ReportActions = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media print {
    display: none;
  }
`;

export const FiltersRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const FilterLabel = styled.label`
  color: #374151;
  font-size: 0.8rem;
  font-weight: 600;
`;

export const FilterInput = styled.input`
  width: 150px;
  padding: 0.5rem 0.75rem;
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

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const PrimaryButton = styled.button`
  height: 38px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #1a3c2b;
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;

  &:hover:not(:disabled) {
    background: #2d6a4f;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  height: 38px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  color: #1a3c2b;
  border: 1.5px solid #1a3c2b;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;

  &:hover {
    background: #f0fdf4;
  }
`;

export const ReportHeader = styled.div`
  margin-bottom: 1.5rem;
`;

export const ReportTitle = styled.h1`
  color: #111827;
  font-size: 1.5rem;
  line-height: 1.2;
`;

export const ReportSubtitle = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }

  @media print {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    break-inside: avoid-page;
  }
`;

export const SummaryCard = styled.div<{ $variant?: 'income' | 'expense' }>`
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  border-left: 4px solid
    ${({ $variant }) =>
      $variant === 'income'
        ? '#10B981'
        : $variant === 'expense'
          ? '#EF4444'
          : '#1A3C2B'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
`;

export const SummaryLabel = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
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
  font-weight: 800;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1rem;
  align-items: start;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }

  @media print {
    display: block;
  }
`;

export const ReportSection = styled.section<{ $wide?: boolean }>`
  background: white;
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  ${({ $wide }) => $wide && 'grid-column: 1 / -1;'}

  @media print {
    margin-bottom: 0.75rem;
    padding: 0.75rem;
    box-shadow: none;
    border: 1px solid #e5e7eb;
    break-inside: avoid-page;
    page-break-inside: avoid;
  }
`;

export const SectionHeader = styled.div`
  margin-bottom: 1rem;

  @media print {
    margin-bottom: 0.5rem;
    break-after: avoid-page;
    page-break-after: avoid;
  }
`;

export const SectionTitle = styled.h2`
  color: #111827;
  font-size: 1rem;
  font-weight: 800;
`;

export const SectionSubtitle = styled.p`
  color: #6b7280;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;

  @media print {
    overflow: visible;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  @media print {
    table-layout: auto;

    thead {
      display: table-header-group;
    }

    tr {
      break-inside: avoid-page;
      page-break-inside: avoid;
    }
  }
`;

export const Th = styled.th<{ $align?: 'right' }>`
  padding: 0.75rem;
  background: #f9fafb;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.75rem;
  font-weight: 800;
  text-align: ${({ $align }) => ($align === 'right' ? 'right' : 'left')};
  text-transform: uppercase;
  white-space: nowrap;
`;

export const Td = styled.td<{ $align?: 'right' }>`
  padding: 0.75rem;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  text-align: ${({ $align }) => ($align === 'right' ? 'right' : 'left')};
  vertical-align: middle;
  white-space: nowrap;
`;

export const Money = styled.span<{ $variant?: 'income' | 'expense' }>`
  color: ${({ $variant }) =>
    $variant === 'income'
      ? '#10B981'
      : $variant === 'expense'
        ? '#EF4444'
        : '#111827'};
  font-weight: 800;
`;

export const CategoryName = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ $color }) => $color || '#1a3c2b'};
    flex-shrink: 0;
  }
`;

export const EmptyState = styled.div`
  padding: 1.5rem;
  background: #f9fafb;
  color: #9ca3af;
  border-radius: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
`;

export const LoadingState = styled.div`
  padding: 3rem;
  color: #6b7280;
  text-align: center;
`;

export const ErrorState = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  color: #991b1b;
  background: #fee2e2;
  border-radius: 0.5rem;
`;
