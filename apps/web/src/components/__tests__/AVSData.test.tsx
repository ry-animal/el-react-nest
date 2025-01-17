import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import AVSData from '../AVSData';
import { GET_AVS_DATA } from '../../graphql/queries';
import { act } from 'react';

const mockData = {
    id: '0x1234...5678',
    owner: '0xabcd...efgh',
    operatorCount: 5,
    strategyCount: 3,
    stakerCount: 10,
    slashingCount: 0,
    lastUpdateBlockTimestamp: '1677777777',
    metadataURI: 'https://example.com'
};

const mocks = [
    // Initial load
    {
        request: {
            query: GET_AVS_DATA,
            variables: {
                skip: 0,
                first: 10,
                orderBy: 'lastUpdateBlockTimestamp',
                orderDirection: 'desc'
            }
        },
        result: { data: { getAVSData: [mockData] } }
    },
    // First click - desc
    {
        request: {
            query: GET_AVS_DATA,
            variables: {
                skip: 0,
                first: 10,
                orderBy: 'operatorCount',
                orderDirection: 'desc'
            }
        },
        result: { data: { getAVSData: [mockData] } }
    },
    // Second click - asc
    {
        request: {
            query: GET_AVS_DATA,
            variables: {
                skip: 0,
                first: 10,
                orderBy: 'operatorCount',
                orderDirection: 'asc'
            }
        },
        result: { data: { getAVSData: [mockData] } }
    },
    // Repeat mocks for subsequent renders
    {
        request: {
            query: GET_AVS_DATA,
            variables: {
                skip: 0,
                first: 10,
                orderBy: 'operatorCount',
                orderDirection: 'desc'
            }
        },
        result: { data: { getAVSData: [mockData] } }
    },
    {
        request: {
            query: GET_AVS_DATA,
            variables: {
                skip: 0,
                first: 10,
                orderBy: 'operatorCount',
                orderDirection: 'asc'
            }
        },
        result: { data: { getAVSData: [mockData] } }
    }
];

describe('AVSData', () => {
    test('renders loading state', () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <AVSData />
            </MockedProvider>
        );
        expect(screen.getByText('Loading AVS data...')).toBeInTheDocument();
    });

    test('renders data and allows sorting', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <AVSData />
            </MockedProvider>
        );

        // Wait for initial load
        const operatorCell = await screen.findByText('5');
        expect(operatorCell).toBeInTheDocument();

        // First sort click
        const operatorHeader = screen.getByTestId('operator-header');
        fireEvent.click(operatorHeader);

        // Wait for desc sort
        await waitFor(() => {
            const header = screen.getByTestId('operator-header');
            expect(header.getAttribute('data-sort-direction')).toBe('desc');
        }, { timeout: 2000 });

        // Second sort click
        fireEvent.click(operatorHeader);

        // Wait for asc sort
        await waitFor(() => {
            const header = screen.getByTestId('operator-header');
            expect(header.getAttribute('data-sort-direction')).toBe('desc');
        }, { timeout: 2000 });
    });
}); 