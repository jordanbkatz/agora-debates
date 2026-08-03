import { render, screen, fireEvent } from '@testing-library/react';
import { ArgumentCard } from '../components/ArgumentCard';
import type { Argument } from '../types';

describe('ArgumentCard Component', () => {
  const mockArg: Argument = {
    id: 'a1',
    text: 'Renewable energy is sustainable long-term.',
    side: 'pro',
    authorId: 'u1',
    authorName: 'Bob',
    upvotes: 10,
    downvotes: 2,
    consensusMetric: 8,
    evidence: [{ title: 'Study 2024', url: 'https://example.com' }],
    createdAt: new Date(),
  };

  const defaultProps = {
    arg: mockArg,
    onVote: jest.fn(),
    userVote: undefined,
    isExpired: false,
    onExpandRebuttals: jest.fn(),
    isRebuttalsOpen: false,
  };

  it('renders author name, argument text, and source evidence link', () => {
    render(<ArgumentCard {...defaultProps} />);

    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Renewable energy is sustainable long-term.')).toBeInTheDocument();
    expect(screen.getByText('Study 2024')).toBeInTheDocument();
  });

  it('calls onExpandRebuttals when Rebuttals button is clicked', () => {
    render(<ArgumentCard {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /rebuttals/i }));
    expect(defaultProps.onExpandRebuttals).toHaveBeenCalledTimes(1);
  });

  it('renders delete button for argument author and triggers onDelete when confirmed', () => {
    const mockDelete = jest.fn();
    render(
      <ArgumentCard 
        {...defaultProps} 
        currentUserId="u1" 
        onDelete={mockDelete} 
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /delete argument/i });
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);

    const deleteButtons = screen.getAllByRole('button', { name: /delete argument/i });
    const modalConfirmBtn = deleteButtons[deleteButtons.length - 1];
    fireEvent.click(modalConfirmBtn);

    expect(mockDelete).toHaveBeenCalledWith(mockArg);
  });
});
