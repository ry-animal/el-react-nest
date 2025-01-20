import { useEffect, useState } from 'react';

interface MetadataModalProps {
    uri: string;
    isOpen: boolean;
    onClose: () => void;
}

export const MetadataModal = ({ uri, isOpen, onClose }: MetadataModalProps) => {
    const [metadata, setMetadata] = useState<any>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (isOpen && uri) {
            fetch(uri)
                .then(res => res.json())
                .then(data => setMetadata(data))
                .catch(err => setError('Failed to load metadata'));
        }
    }, [uri, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">AVS Metadata</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : !metadata ? (
                    <p>Loading...</p>
                ) : (
                    <pre className="bg-gray-50 p-4 rounded overflow-auto">
                        {JSON.stringify(metadata, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
}; 