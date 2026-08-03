import { render, screen } from '@testing-library/react';
import { Footer } from '../components/Footer';

describe('Footer Component', () => {
  it('renders footer link correctly', () => {
    render(<Footer />);
    const link = screen.getByText('a Jordan Katz project');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://jordankatz.dev');
  });
});
