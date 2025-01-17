import { useQuery } from '@apollo/client';
import { GET_AVS_DATA } from '../graphql/queries';
import { formatDistanceToNow } from 'date-fns';
import { AVS } from '../types/avs';
import { useState } from 'react';
import { SortField, SortDirection } from '../types/sort';

interface AVSQueryResult {
    getAVSData: AVS[];
}

const AVSData = () => {
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [sortField, setSortField] = useState('lastUpdateBlockTimestamp');
    const [sortDirection, setSortDirection] = useState('desc');

    const { data, loading, error } = useQuery<AVSQueryResult>(GET_AVS_DATA, {
        variables: {
            skip: (page - 1) * pageSize,
            first: pageSize,
            orderBy: sortField,
            orderDirection: sortDirection
        }
    });

    if (loading) return <div className="p-4">Loading AVS data...</div>;
    if (error) return <div className="p-4 text-red-500">Error loading AVS Data: {error.message}</div>;

    const avsList = data?.getAVSData || [];

    const toggleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 -mt-20 sm:mt-0">
            <div className="w-full max-w-7xl">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 font-mono text-eigen">
                    <div className="sm:inline block text-center sm:text-left">Active Validator Services</div>
                    <div className="sm:inline block sm:ml-1 text-center sm:text-left">({avsList.length} per page)</div>
                </h2>
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                    <table className="min-w-full whitespace-nowrap bg-white/70 shadow-md rounded-lg overflow-hidden backdrop-blur-sm">
                        <thead className="bg-[#f0efe9]">
                            <tr>
                                <th className="px-2 sm:px-4 py-3 text-left">AVS ID</th>
                                <th className="px-2 sm:px-4 py-3 text-left">Owner</th>
                                <th
                                    onClick={() => toggleSort(SortField.OPERATOR_COUNT)}
                                    className="px-2 sm:px-4 py-3 text-center cursor-pointer hover:bg-[#e8e7e1]"
                                >
                                    Operators {sortField === SortField.OPERATOR_COUNT && (sortDirection === SortDirection.ASC ? '↑' : '↓')}
                                </th>
                                <th
                                    onClick={() => toggleSort(SortField.STRATEGY_COUNT)}
                                    className="px-2 sm:px-4 py-3 text-center cursor-pointer hover:bg-[#e8e7e1]"
                                >
                                    Strategies {sortField === SortField.STRATEGY_COUNT && (sortDirection === SortDirection.ASC ? '↑' : '↓')}
                                </th>
                                <th
                                    onClick={() => toggleSort(SortField.STAKER_COUNT)}
                                    className="px-2 sm:px-4 py-3 text-center cursor-pointer hover:bg-[#e8e7e1]"
                                >
                                    Stakers {sortField === SortField.STAKER_COUNT && (sortDirection === SortDirection.ASC ? '↑' : '↓')}
                                </th>
                                <th
                                    onClick={() => toggleSort(SortField.SLASHING_COUNT)}
                                    className="px-2 sm:px-4 py-3 text-center cursor-pointer hover:bg-[#e8e7e1]"
                                >
                                    Slashes {sortField === SortField.SLASHING_COUNT && (sortDirection === SortDirection.ASC ? '↑' : '↓')}
                                </th>
                                <th
                                    onClick={() => toggleSort(SortField.LAST_UPDATE_TIMESTAMP)}
                                    className="px-2 sm:px-4 py-3 text-center cursor-pointer hover:bg-[#e8e7e1] relative"
                                >
                                    Last Update {(sortField === SortField.LAST_UPDATE_TIMESTAMP || !sortField) && (sortDirection === SortDirection.ASC ? '↑' : '↓')}
                                </th>
                                <th className="px-2 sm:px-4 py-3 text-left">Metadata</th>
                            </tr>
                        </thead>
                        <tbody>
                            {avsList.map((avs: AVS) => (
                                <tr key={avs.id} className="border-t hover:bg-[#f7f6f3]">
                                    <td className="px-2 sm:px-4 py-3">
                                        <span className="font-mono text-xs sm:text-sm">
                                            {`${avs.id.slice(0, 4)}...${avs.id.slice(-4)}`}
                                        </span>
                                    </td>
                                    <td className="px-2 sm:px-4 py-3">
                                        <span className="font-mono text-xs sm:text-sm">
                                            {`${avs.owner.slice(0, 4)}...${avs.owner.slice(-4)}`}
                                        </span>
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 text-center">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                            {avs.operatorCount}
                                        </span>
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 text-center">
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                            {avs.strategyCount}
                                        </span>
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 text-center">
                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                                            {avs.stakerCount}
                                        </span>
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 text-center">
                                        <span className={`px-2 py-1 bg-red-200/80 text-red-900 font-semibold rounded-full`}>
                                            {avs.slashingCount}
                                        </span>
                                    </td>
                                    <td className="px-2 sm:px-4 py-3">
                                        {formatDistanceToNow(new Date(parseInt(avs.lastUpdateBlockTimestamp) * 1000), { addSuffix: true })}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3">
                                        {avs.metadataURI ? (
                                            <a
                                                href={avs.metadataURI}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                View
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex justify-center w-32 font-bold font-mono text-eigen px-4 py-2 bg-white/70 rounded-lg shadow disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm font-bold font-mono text-eigen">Page {page}</span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={avsList.length < pageSize}
                        className="flex justify-center w-32 font-bold font-mono text-eigen px-4 py-2 bg-white/70 rounded-lg shadow disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AVSData; 