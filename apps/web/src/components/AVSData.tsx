import { useQuery } from '@apollo/client';
import { GET_AVS_DATA } from '../graphql/queries';
import { formatDistanceToNow } from 'date-fns';
import { AVS } from '../types/avs';

interface AVSQueryResult {
    getAVSData: AVS[];
}

const AVSData = () => {
    const { loading, error, data } = useQuery<AVSQueryResult>(GET_AVS_DATA);

    if (loading) return <div className="p-4">Loading AVS data...</div>;
    if (error) return <div className="p-4 text-red-500">Error loading AVS Data: {error.message}</div>;

    const avsList = data?.getAVSData || [];

    return (
        <div className="p-2 sm:p-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Active Validator Services ({avsList.length})</h2>
            <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="min-w-full whitespace-nowrap bg-white/70 shadow-md rounded-lg overflow-hidden backdrop-blur-sm">
                    <thead className="bg-[#f0efe9]">
                        <tr>
                            <th className="px-2 sm:px-4 py-3 text-left">AVS ID</th>
                            <th className="px-2 sm:px-4 py-3 text-left">Owner</th>
                            <th className="px-2 sm:px-4 py-3 text-center">Operators</th>
                            <th className="px-2 sm:px-4 py-3 text-center">Strategies</th>
                            <th className="px-2 sm:px-4 py-3 text-center">Stakers</th>
                            <th className="px-2 sm:px-4 py-3 text-center">Slashes</th>
                            <th className="px-2 sm:px-4 py-3 text-left">Last Update</th>
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
        </div>
    );
};

export default AVSData; 