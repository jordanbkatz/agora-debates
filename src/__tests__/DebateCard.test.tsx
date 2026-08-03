import { render, screen, fireEvent } from '@testing-library/react';
import { DebateCard } from '../components/DebateCard';
import type { Debate } from '../types';

describe('DebateCard Component', () => {
  const mockDebate: Debate = {
    id: 'd1',
    title: 'Is AI good for humanity?',
    description: 'A discussion on ethical AI implications.',
    category: 'Technology',
    creatorId: 'c1',
    creatorName: 'Alice',
    isLocked: false,
    expirationTime: null,
    createdAt: new Date(),
  };

  const mockSelect = jest.fn();
  const mockFormatExp = jest.fn().mockReturnValue('No expiration');

  it('renders debate title, category, description, creator', () => {
    render(
      <DebateCard 
        debate={mockDebate} 
        onSelectDebate={mockSelect} 
        isExpired={false} 
        formatExpiration={mockFormatExp} 
      />
    );

    expect(screen.getByText('Is AI good for humanity?')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('A discussion on ethical AI implications.')).toBeInTheDocument();
    expect(screen.getByText('By Alice')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('calls onSelectDebate when clicked', () => {
    render(
      <DebateCard 
        debate={mockDebate} 
        onSelectDebate={mockSelect} 
        isExpired={false} 
        formatExpiration={mockFormatExp} 
      />
    );

    fireEvent.click(screen.getByText('Is AI good for humanity?'));
    expect(mockSelect).toHaveBeenCalledWith(mockDebate);
  });

  it('shows LOCKED status when debate is expired or locked', () => {
    render(
      <DebateCard 
        debate={{ ...mockDebate, isLocked: true }} 
        onSelectDebate={mockSelect} 
        isExpired={false} 
        formatExpiration={mockFormatExp} 
      />
    );

    expect(screen.getByText('LOCKED')).toBeInTheDocument();
  });

  it('renders delete button for creator and triggers onDelete when confirmed', () => {
    const mockDelete = jest.fn();
    mockSelect.mockClear();
    render(
      <DebateCard 
        debate={mockDebate} 
        onSelectDebate={mockSelect} 
        isExpired={false} 
        formatExpiration={mockFormatExp}
        currentUserId="c1"
        onDelete={mockDelete}
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /delete debate topic/i });
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);

    const confirmBtn = screen.getByRole('button', { name: /^delete debate$/i });
    expect(confirmBtn).toBeInTheDocument();
    fireEvent.click(confirmBtn);

    expect(mockDelete).toHaveBeenCalled();
  });
});
