import { render, screen } from '@testing-library/react';
import AVSBubbleChart from '../AVSBubbleChart';
import { ReactNode } from 'react';
import { AVS } from '../../types/avs';

jest.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    ScatterChart: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Scatter: () => <div>Scatter</div>,
    XAxis: () => <div>XAxis</div>,
    YAxis: () => <div>YAxis</div>,
    ZAxis: () => <div>ZAxis</div>,
    Tooltip: () => <div>Tooltip</div>,
    Legend: ({ formatter }: { formatter: (value: string) => ReactNode }) => (
        <div>
            {['Operators', 'Strategies', 'Stakers', 'Slashes'].map(value => (
                <div key={value}>{formatter(value)}</div>
            ))}
        </div>
    )
}));

const mockData: AVS[] = [
    {
        id: '0x1234',
        owner: '0xabcd',
        operatorCount: 5,
        strategyCount: 3,
        stakerCount: 10,
        slashingCount: 0,
        lastUpdateBlockTimestamp: 1677777777,
        metadataURI: 'https://example.com'
    },
    {
        id: '0x5678',
        owner: '0xefgh',
        operatorCount: 3,
        strategyCount: 2,
        stakerCount: 8,
        slashingCount: 1,
        lastUpdateBlockTimestamp: 1677777888,
        metadataURI: 'https://example.com/2'
    }
];

describe('AVSBubbleChart', () => {
    test('renders chart with data', () => {
        const mockDataWithRequired = [{
            ...mockData[0],
            operatorSetCount: 2,
            lastUpdateBlockNumber: '123456'
        }];
        render(<AVSBubbleChart data={mockDataWithRequired} selectedId={mockDataWithRequired[0].id} />);

        expect(screen.getByText(/AVS Metrics:/)).toBeInTheDocument();
        expect(screen.getByText(/Operators/)).toBeInTheDocument();
        expect(screen.getByText(/Strategies/)).toBeInTheDocument();
    });

    test('handles empty data', () => {
        render(<AVSBubbleChart data={[]} />);
        expect(screen.queryByText(/AVS Metrics:/)).not.toBeInTheDocument();
    });

    it('renders without crashing', () => {
        render(<AVSBubbleChart data={mockData} selectedId={mockData[0].id} />);
    });

    it('renders with empty data', () => {
        render(<AVSBubbleChart data={[]} />);
    });
}); 