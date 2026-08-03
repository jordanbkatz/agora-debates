import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../components/Navbar';

describe('Navbar Component', () => {
  const defaultProps = {
    user: null,
    profile: null,
    displayNameInput: '',
    onDisplayNameChange: jest.fn(),
    isUserSignedIn: false,
    onHomeClick: jest.fn(),
    onOpenAuth: jest.fn(),
    onSignOut: jest.fn(),
  };

  it('renders branding title and subtitle', () => {
    render(<Navbar {...defaultProps} />);
    expect(screen.getByText('Agora Debates')).toBeInTheDocument();
    expect(screen.getByText('Structured Debate Platform')).toBeInTheDocument();
  });

  it('calls onHomeClick when clicking header logo/title', () => {
    render(<Navbar {...defaultProps} />);
    fireEvent.click(screen.getByText('Agora Debates'));
    expect(defaultProps.onHomeClick).toHaveBeenCalledTimes(1);
  });

  it('renders Sign In button when not signed in', () => {
    render(<Navbar {...defaultProps} />);
    const signInBtn = screen.getByRole('button', { name: /sign in/i });
    expect(signInBtn).toBeInTheDocument();
    fireEvent.click(signInBtn);
    expect(defaultProps.onOpenAuth).toHaveBeenCalledTimes(1);
  });

  it('renders Sign Out button and editable input when user is signed in', () => {
    const props = {
      ...defaultProps,
      isUserSignedIn: true,
      profile: { uid: 'u1', displayName: 'TestUser', createdAt: null },
      displayNameInput: 'TestUser',
    };
    render(<Navbar {...props} />);
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    const input = screen.getByPlaceholderText('Nickname');
    expect(input).toBeInTheDocument();
    expect((input as HTMLInputElement).value).toBe('TestUser');
  });
});
