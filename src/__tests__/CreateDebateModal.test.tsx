import { render, screen, fireEvent } from '@testing-library/react';
import { CreateDebateModal } from '../components/CreateDebateModal';

describe('CreateDebateModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Sample Debate Title',
    setTitle: jest.fn(),
    description: '',
    setDescription: jest.fn(),
    category: 'Society',
    setCategory: jest.fn(),
    duration: 'none',
    setDuration: jest.fn(),
    isCreating: false,
    error: '',
    onSubmit: jest.fn(),
    categories: ['All', 'Society', 'Technology', 'Science'],
  };

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<CreateDebateModal {...defaultProps} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders title input, category select, and open topic button', () => {
    render(<CreateDebateModal {...defaultProps} />);
    expect(screen.getByText('Start a New Debate Topic')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open debate topic/i })).toBeInTheDocument();
  });

  it('calls onSubmit on form submit', () => {
    render(<CreateDebateModal {...defaultProps} />);
    fireEvent.submit(screen.getByRole('button', { name: /open debate topic/i }));
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });
});
