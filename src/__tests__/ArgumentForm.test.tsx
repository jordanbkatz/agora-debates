import { render, screen, fireEvent } from '@testing-library/react';
import { ArgumentForm } from '../components/ArgumentForm';

describe('ArgumentForm Component', () => {
  const defaultProps = {
    side: 'pro' as const,
    text: '',
    setText: jest.fn(),
    sources: [{ title: '', url: '' }],
    onAddSource: jest.fn(),
    onUpdateSource: jest.fn(),
    onRemoveSource: jest.fn(),
    isSubmitting: false,
    error: '',
    onSubmit: jest.fn(),
  };

  it('renders submit pro argument heading and text area', () => {
    render(<ArgumentForm {...defaultProps} />);
    expect(screen.getByText('Submit Pro Argument')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('State your pro argument clearly...')).toBeInTheDocument();
  });

  it('calls setText when typing in argument text area', () => {
    render(<ArgumentForm {...defaultProps} />);
    const textarea = screen.getByPlaceholderText('State your pro argument clearly...');
    fireEvent.change(textarea, { target: { value: 'New argument text' } });
    expect(defaultProps.setText).toHaveBeenCalledWith('New argument text');
  });

  it('renders error message if provided', () => {
    render(<ArgumentForm {...defaultProps} error="Argument text is required." />);
    expect(screen.getByText('Argument text is required.')).toBeInTheDocument();
  });

  it('calls onSubmit when clicking publish button', () => {
    render(<ArgumentForm {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /publish argument/i }));
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });
});
