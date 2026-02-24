import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../app/queryClient';

const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
