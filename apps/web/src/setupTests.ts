import '@testing-library/jest-dom';

class ResizeObserverMock {
    observe() {
        if (this.callback) {
            const entry = [{
                contentRect: {
                    width: 1000,
                    height: 400
                },
                target: document.createElement('div')
            }];
            this.callback(entry);
        }
    }
    unobserve() {}
    disconnect() {}
    callback: any;

    constructor(callback: any) {
        this.callback = callback;
    }
}

global.ResizeObserver = ResizeObserverMock;

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});