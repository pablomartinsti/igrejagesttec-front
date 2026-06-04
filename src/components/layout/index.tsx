import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/auth.context';
import {
  Container,
  Sidebar,
  SidebarHeader,
  SidebarLogo,
  SidebarChurch,
  SidebarNav,
  NavItem,
  NavIcon,
  NavLabel,
  SidebarFooter,
  LogoutButton,
  Main,
  TopBar,
  TopBarTitle,
  UserInfo,
  UserName,
  UserRole,
  Content,
  Overlay,
  HamburgerButton,
} from './styles';

const menuItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/cultos', icon: '⛪', label: 'Cultos' },
  { path: '/transacoes', icon: '💰', label: 'Transações' },
  { path: '/categorias', icon: '🏷️', label: 'Categorias' },
  { path: '/relatorios', icon: '📈', label: 'Relatórios' },
  { path: '/configuracoes', icon: '⚙️', label: 'Configurações' },
];

const roleLabels = {
  ADMIN: 'Administrador',
  TREASURER: 'Tesoureiro',
  PASTOR: 'Pastor',
};

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export function Layout({ children, title }: LayoutProps) {
  const { user, church, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const visibleMenuItems = menuItems.filter(
    item => item.path !== '/configuracoes' || user?.role === 'ADMIN',
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container>
      <Overlay $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      <Sidebar $open={sidebarOpen}>
        <SidebarHeader>
          <SidebarLogo>⛪ IgrejaGestTec</SidebarLogo>
          <SidebarChurch>{church?.name}</SidebarChurch>
        </SidebarHeader>

        <SidebarNav>
          {visibleMenuItems.map(item => (
            <NavItem
              key={item.path}
              $active={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              <NavIcon>{item.icon}</NavIcon>
              <NavLabel>{item.label}</NavLabel>
            </NavItem>
          ))}
        </SidebarNav>

        <SidebarFooter>
          <LogoutButton onClick={handleLogout}>🚪 Sair</LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <Main>
        <TopBar>
          <HamburgerButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </HamburgerButton>
          <TopBarTitle>{title}</TopBarTitle>
          <UserInfo>
            <UserName>{user?.name}</UserName>
            <UserRole>{user ? roleLabels[user.role] : ''}</UserRole>
          </UserInfo>
        </TopBar>

        <Content>{children}</Content>
      </Main>
    </Container>
  );
}
