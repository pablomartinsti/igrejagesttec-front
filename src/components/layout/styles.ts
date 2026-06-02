import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
`;

export const Overlay = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }
`;

export const Sidebar = styled.aside<{ $open: boolean }>`
  width: 240px;
  min-height: 100vh;
  background: #1a3c2b;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    transform: ${({ $open }) =>
      $open ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;

export const SidebarHeader = styled.div`
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const SidebarLogo = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.375rem;
`;

export const SidebarChurch = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
`;

export const SidebarNav = styled.nav`
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const NavItem = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: ${({ $active }) =>
    $active ? 'rgba(255,255,255,0.15)' : 'transparent'};
  color: ${({ $active }) => ($active ? 'white' : 'rgba(255,255,255,0.7)')};
  font-size: 0.9rem;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  width: 100%;
  text-align: left;
  transition: all 0.2s;
  border: none;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

export const NavIcon = styled.span`
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
`;

export const NavLabel = styled.span``;

export const SidebarFooter = styled.div`
  padding: 1rem 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  width: 100%;
  text-align: left;
  transition: all 0.2s;
  border: none;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

export const Main = styled.main`
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const TopBar = styled.header`
  height: 64px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 30;
`;

export const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #374151;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const TopBarTitle = styled.h1`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  flex: 1;
`;

export const UserInfo = styled.div`
  text-align: right;
`;

export const UserName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
`;

export const UserRole = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

export const Content = styled.div`
  padding: 1.5rem;
  flex: 1;
`;
