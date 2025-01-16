import React from 'react';
import { sharedFunction } from 'shared';

const App: React.FC = () => {
    React.useEffect(() => {
        sharedFunction();
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-4xl">Hello, React App!</h1>
        </div>
    );
};

export default App; 