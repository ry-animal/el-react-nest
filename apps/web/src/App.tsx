import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AVSData from './components/AVSData';
import logo from './assets/el-logo.svg';
import githubLogo from './assets/github-logo.svg';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
        },
    },
});

const App = () => (
    <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-[#f7f6f3]">
            <header className="bg-[#fff]/80 shadow backdrop-blur-sm">
                <div className="max-w-7xl mx-auto py-6 px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 w-full sm:w-auto">
                            <a
                                href="https://www.eigenlayer.xyz/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={logo} alt="EigenLayer Logo" className="h-8 w-auto logo-wiggle" />
                            </a>
                            <div className="flex-1 flex justify-center sm:justify-start">
                                <div className="flex items-center space-x-4 -ml-8 sm:ml-0">
                                    <div className="h-8 w-px" />
                                    <h1
                                        className="text-2xl font-bold font-mono text-eigen"
                                        data-text="AVS DASHBOARD"
                                    >
                                        <span>
                                            AVS DASHBOARD
                                        </span>
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <a
                            href="https://github.com/ry-animal/el-react-nest"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src={githubLogo} alt="GitHub" className="h-8 w-8 logo-wiggle" />
                        </a>
                    </div>
                </div>
            </header>
            <div className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-4">
                <AVSData />
            </div>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
);

export default App; 