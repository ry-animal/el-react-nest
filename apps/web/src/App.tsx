import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';
import { sharedFunction } from 'shared';
import AVSData from './components/AVSData';
import { useEffect } from 'react';
import logo from './assets/el-logo.svg';

const App = () => {
    useEffect(() => {
        sharedFunction();
    }, []);

    return (
        <ApolloProvider client={client}>
            <div className="min-h-screen bg-[#f7f6f3]">
                <header className="bg-[#f0efe9]/80 shadow backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <a
                                    href="https://www.eigenlayer.xyz/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-80 transition-opacity"
                                >
                                    <img src={logo} alt="EigenLayer Logo" className="h-6 sm:h-8 w-auto" />
                                </a>
                                <div className="h-6 sm:h-8 w-px bg-gray-200" />
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">AVS Dashboard</h1>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-4">
                    <AVSData />
                </div>
            </div>
        </ApolloProvider>
    );
};

export default App; 