import { render, screen, fireEvent } from '@testing-library/react';
import { VotingPanel } from '../components/VotingPanel';

describe('VotingPanel Component', () => {
  it('renders Agree and Disagree buttons and score', () => {
    const onVote = jest.fn();
    render(<VotingPanel onVote={onVote} userVote={undefined} score={5} />);

    expect(screen.getByRole('button', { name: /^agree$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^disagree$/i })).toBeInTheDocument();
    expect(screen.getByText('+5')).toBeInTheDocument();
  });

  it('triggers onVote with up or down when clicked', () => {
    const onVote = jest.fn();
    render(<VotingPanel onVote={onVote} userVote={undefined} score={0} />);

    fireEvent.click(screen.getByRole('button', { name: /^agree$/i }));
    expect(onVote).toHaveBeenCalledWith('up');

    fireEvent.click(screen.getByRole('button', { name: /^disagree$/i }));
    expect(onVote).toHaveBeenCalledWith('down');
  });

  it('disables buttons when disabled prop is true', () => {
    const onVote = jest.fn();
    render(<VotingPanel onVote={onVote} userVote={undefined} disabled={true} />);

    expect(screen.getByRole('button', { name: /^agree$/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /^disagree$/i })).toBeDisabled();
  });
});
