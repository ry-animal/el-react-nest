import { useState, useEffect } from 'react';

export const usePageSize = () => {
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const updatePageSize = () => {
      setPageSize(window.innerWidth >= 768 ? 10 : 5);
    };

    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  return pageSize;
}; 