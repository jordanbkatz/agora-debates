import { render, screen, fireEvent } from '@testing-library/react';
import { AuthModal } from '../components/AuthModal';

describe('AuthModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    isSignUp: false,
    setIsSignUp: jest.fn(),
    authEmail: 'user@example.com',
    setAuthEmail: jest.fn(),
    authPassword: 'password123',
    setAuthPassword: jest.fn(),
    authError: '',
    setAuthError: jest.fn(),
    onSubmit: jest.fn(),
    onGoogleSignIn: jest.fn(),
  };

  it('renders nothing if isOpen is false', () => {
    const { container } = render(<AuthModal {...defaultProps} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders Sign In fields and buttons when open', () => {
    render(<AuthModal {...defaultProps} />);
    expect(screen.getByRole('heading', { name: /^sign in$/i })).toBeInTheDocument();
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    expect(screen.getByText('Continue as Guest')).toBeInTheDocument();
  });

  it('calls onSubmit on form submit', () => {
    render(<AuthModal {...defaultProps} />);
    fireEvent.submit(screen.getByRole('button', { name: /^sign in$/i }));
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });
});
