import { useEffect, useState } from 'react';

interface AVSMetadata {
    name?: string;
    description?: string;
    website?: string;
    logo?: string;
    socials?: {
        twitter?: string;
        discord?: string;
        github?: string;
        [key: string]: string | undefined;
    };
    [key: string]: any;
}

interface MetadataModalProps {
    uri: string;
    isOpen: boolean;
    onClose: () => void;
}

const formatUrl = (url: string, platform?: string): string => {
    if (!url) return '';

    if (url.startsWith('http')) {
        if (url.includes('twitter.com')) {
            return url.replace('twitter.com', 'x.com');
        }
        return url;
    }

    if (url.startsWith('//')) return `https:${url}`;

    if (platform) {
        switch (platform.toLowerCase()) {
            case 'twitter':
            case 'x':
                return url.startsWith('@')
                    ? `https://x.com/${url.slice(1)}`
                    : `https://x.com/${url}`;
            case 'discord':
                return `https://discord.gg/${url}`;
            case 'github':
                return `https://github.com/${url}`;
        }
    }

    return url.startsWith('www.') ? `https://${url}` : `https://${url}`;
};

export const MetadataModal = ({ uri, isOpen, onClose }: MetadataModalProps) => {
    const [metadata, setMetadata] = useState<AVSMetadata | null>(null);
    const [error, setError] = useState<string>('');
    const [showRaw, setShowRaw] = useState(false);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (isOpen && uri) {
            setError('');
            setMetadata(null);

            fetch(`/api/subgraph/metadata?url=${encodeURIComponent(uri)}`)
                .then(async res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    if (!data) throw new Error('No data received');
                    setMetadata(data);
                })
                .catch(err => {
                    console.error('Metadata fetch error:', err, 'URI:', uri);
                    setError(`Failed to load metadata: ${err.message}`);
                });
        }
    }, [uri, isOpen]);

    if (!isOpen) return null;

    const renderSocials = (socials: AVSMetadata['socials']) => {
        if (!socials) return null;
        return (
            <div className="flex gap-4 mt-2">
                {Object.entries(socials).map(([platform, url]) => (
                    url && <a
                        key={platform}
                        href={formatUrl(url, platform)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 capitalize"
                    >
                        {platform}
                    </a>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold">AVS Metadata</h3>
                        {metadata?.name && (
                            <p className="text-gray-600 mt-1">{metadata.name}</p>
                        )}
                    </div>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => setShowRaw(!showRaw)}
                            className="text-sm text-gray-600 hover:text-gray-800"
                        >
                            {showRaw ? 'Show Formatted' : 'Show Raw'}
                        </button>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ✕
                        </button>
                    </div>
                </div>

                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : !metadata ? (
                    <p>Loading...</p>
                ) : showRaw ? (
                    <pre className="bg-gray-50 p-4 rounded overflow-auto font-mono text-sm">
                        {JSON.stringify(metadata, null, 2)}
                    </pre>
                ) : (
                    <div className="space-y-6">
                        {metadata.logo && !imgError && (
                            <div className="flex justify-center">
                                <img
                                    src={formatUrl(metadata.logo)}
                                    alt={`${metadata.name || 'AVS'} logo`}
                                    className="h-24 w-24 object-contain"
                                    onError={() => setImgError(true)}
                                    loading="lazy"
                                />
                            </div>
                        )}

                        {metadata.description && (
                            <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p className="text-gray-700 whitespace-pre-wrap">{metadata.description}</p>
                            </div>
                        )}

                        {metadata.website && (
                            <div>
                                <h4 className="font-semibold mb-2">Website</h4>
                                <a
                                    href={formatUrl(metadata.website)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    {metadata.website}
                                </a>
                            </div>
                        )}

                        {metadata.socials && (
                            <div>
                                <h4 className="font-semibold mb-2">Social Links</h4>
                                {renderSocials(metadata.socials)}
                            </div>
                        )}

                        {/* Display other metadata fields */}
                        {Object.entries(metadata).map(([key, value]) => {
                            if (['name', 'description', 'website', 'logo', 'socials'].includes(key)) return null;
                            if (typeof value === 'object') return null;

                            return (
                                <div key={key}>
                                    <h4 className="font-semibold mb-2 capitalize">{key.replace(/_/g, ' ')}</h4>
                                    <p className="text-gray-700">{value}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}; 