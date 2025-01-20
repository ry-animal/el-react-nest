import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AVSData from '../AVSData';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);

describe('AVSData', () => {
    it('renders loading state', () => {
        render(<AVSData />, { wrapper });
        expect(screen.getByText(/Loading AVS data/i)).toBeInTheDocument();
    });
}); 