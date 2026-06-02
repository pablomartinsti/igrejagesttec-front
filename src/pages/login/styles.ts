import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a3c2b 0%, #2d6a4f 100%);
  padding: 1rem;
`;

export const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  text-align: center;
`;

export const Logo = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 2rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  text-align: left;
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
  font-size: 1rem;
  color: #111827;
  transition: border-color 0.2s;
  width: 100%;

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? '#EF4444' : '#4F46E5')};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) =>
        $hasError ? 'rgba(239,68,68,0.1)' : 'rgba(79,70,229,0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const Button = styled.button`
  padding: 0.875rem;
  background: #2d6a4f;
  color: white;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.2s;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background: #1a3c2b;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
`;

export const ErrorAlert = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: left;
`;
