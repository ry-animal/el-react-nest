import { useState, useEffect } from 'react';
import { SortField, SortDirection, formatAddress, formatTimestamp, CONSTANTS } from '@el-react-nest/shared';
import { useAVSData } from '../hooks/useAVSData';
import AVSBubbleChart from './AVSBubbleChart';
import { MetadataModal } from './MetadataModal';
import { AVS } from '../types/avs';

interface AVSQueryResult {
    getAVSData: AVS[];
}

const AVSData = () => {
    const [page, setPage] = useState(1);
    const pageSize = CONSTANTS.DEFAULT_PAGE_SIZE;
    const [sortField, setSortField] = useState<SortField>(SortField.LAST_UPDATE_TIMESTAMP);
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [selectedAVSId, setSelectedAVSId] = useState<string>();
    const [selectedMetadata, setSelectedMetadata] = useState<string | null>(null);

    const { data: avsList = [], isLoading, error } = useAVSData({
        skip: (page - 1) * pageSize,
        first: pageSize,
        orderBy: sortField,
        orderDirection: sortDirection,
    });

    useEffect(() => {
        if (avsList.length > 0 && !avsList.find(avs => avs.id === selectedAVSId)) {
            setSelectedAVSId(avsList[0].id);
        }
    }, [page, avsList, selectedAVSId]);

    if (isLoading) return <div className="p-4">Loading AVS data...</div>;
    if (error) return <div className="p-4 text-red-500">Error loading AVS Data: {error.message}</div>;

    const toggleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection((prev: SortDirection) => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field as SortField);
            setSortDirection('desc');
        }
    };

    const getSortArrow = (field: string) => {
        if (sortField !== field) return '↓';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 -mt-20 sm:-mt-6">
            <div className="w-full max-w-7xl">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 font-mono text-eigen">
                    <div className="sm:inline block text-center sm:text-left">Active Validator Services</div>
                    <div className="sm:inline block sm:ml-1 text-center sm:text-left">({avsList.length} per page)</div>
                </h2>
                <div className="mb-8">
                    <AVSBubbleChart data={avsList} selectedId={selectedAVSId} />
                </div>
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                    <table className="min-w-full table-fixed whitespace-nowrap bg-white/70 shadow-md rounded-lg overflow-hidden backdrop-blur-sm">
                        <thead className="bg-[#f0efe9]">
                            <tr>
                                <th className="w-1/8 px-2 sm:px-4 py-3 text-left">AVS ID</th>
                                <th className="w-1/8 px-2 sm:px-4 py-3 text-left">Owner</th>
                                <th
                                    onClick={() => toggleSort(SortField.OPERATOR_COUNT)}
                                    className="w-1/8 px-2 sm:px-4 py-3 text-center cursor-pointer hover:bg-[#e8e7e1]"
                                    data-sort-direction={sortField === SortField.OPERATOR_COUNT ? sortDirection : undefined}
                                    data-testid="operator-header"
                                >
                                    Operators {sortField === SortField.OPERATOR_COUNT && getSortArrow(SortField.OPERATOR_COUNT)}
                                </th>
                                <th
                                    onClick={() => toggleSort(SortField.STRATEGY_COUNT)}
                                    className="w-1/8 px-2 sm:px-4 py-3 text-center cursor-pointer hover:bg-[#e8e7e1]"
                                >
                                    Strategies {sortField === SortField.STRATEGY_COUNT && getSortArrow(SortField.STRATEGY_COUNT)}
                                </th>
                                <th
                                    onClick={() => toggleSort(SortField.STAKER_COUNT)}
                                    className="w-1/8 px-2 sm:px-4 py-3 text-center cursor-pointer hover:bg-[#e8e7e1]"
                                >
                                    Stakers {sortField === SortField.STAKER_COUNT && getSortArrow(SortField.STAKER_COUNT)}
                                </th>
                                <th
                                    onClick={() => toggleSort(SortField.SLASHING_COUNT)}
                                    className="w-1/8 px-2 sm:px-4 py-3 text-center cursor-pointer hover:bg-[#e8e7e1]"
                                >
                                    Slashes {sortField === SortField.SLASHING_COUNT && getSortArrow(SortField.SLASHING_COUNT)}
                                </th>
                                <th
                                    onClick={() => toggleSort(SortField.LAST_UPDATE_TIMESTAMP)}
                                    className="w-1/8 px-2 sm:px-4 py-3 text-center cursor-pointer hover:bg-[#e8e7e1] relative"
                                >
                                    Last Update {(sortField === SortField.LAST_UPDATE_TIMESTAMP || !sortField) && getSortArrow(SortField.LAST_UPDATE_TIMESTAMP)}
                                </th>
                                <th className="w-1/8 px-2 sm:px-4 py-3 text-left">Metadata</th>
                            </tr>
                        </thead>
                        <tbody>
                            {avsList.map((avs: AVS) => (
                                <tr
                                    key={avs.id}
                                    className={`border-t cursor-pointer ${avs.id === selectedAVSId ? 'bg-[#f7f6f3]' : ''}`}
                                    onClick={() => setSelectedAVSId(avs.id)}
                                >
                                    <td className="px-2 sm:px-4 py-3">
                                        <span className="font-mono text-xs sm:text-sm">
                                            {formatAddress(avs.id)}
                                        </span>
                                    </td>
                                    <td className="px-2 sm:px-4 py-3">
                                        <span className="font-mono text-xs sm:text-sm">
                                            {formatAddress(avs.owner)}
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
                                        {formatTimestamp(avs.lastUpdateBlockTimestamp)}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3">
                                        {avs.metadataURI ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedMetadata(avs.metadataURI);
                                                }}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                View
                                            </button>
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
                        className="flex justify-center w-32 font-bold font-mono text-eigen px-4 py-2 bg-white/70 rounded-lg shadow 
                            transition-all duration-200 ease-out
                            hover:enabled:translate-y-[-2px] hover:enabled:shadow-lg hover:enabled:bg-white/90
                            active:enabled:translate-y-[0px] active:enabled:shadow-md
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(1)}
                            disabled={page === 1}
                            hidden={page === 1 || page === 2}
                            className="text-sm font-bold font-mono text-eigen px-3 py-1 bg-white/70 rounded-lg shadow
                                transition-all duration-200 ease-out
                                hover:enabled:translate-y-[-2px] hover:enabled:shadow-lg hover:enabled:bg-white/90
                                active:enabled:translate-y-[0px] active:enabled:shadow-md
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Page 1
                        </button>
                        <span className="text-sm font-bold font-mono text-eigen">Page {page}</span>
                    </div>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={avsList.length < pageSize}
                        className="flex justify-center w-32 font-bold font-mono text-eigen px-4 py-2 bg-white/70 rounded-lg shadow 
                            transition-all duration-200 ease-out
                            hover:enabled:translate-y-[-2px] hover:enabled:shadow-lg hover:enabled:bg-white/90
                            active:enabled:translate-y-[0px] active:enabled:shadow-md
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>

                <MetadataModal
                    uri={selectedMetadata || ''}
                    isOpen={!!selectedMetadata}
                    onClose={() => setSelectedMetadata(null)}
                />
            </div>
        </div>
    );
};

export default AVSData; 