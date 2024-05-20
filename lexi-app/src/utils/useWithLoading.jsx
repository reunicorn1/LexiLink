import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

function withLoading(Component, delay = 10000) {
  return function WithLoadingComponent({ isLoading, setIsLoading, ...props }) {

    useEffect(() => {
      let timeoutId;
      if (isLoading) {
        timeoutId = setTimeout(() => setIsLoading(false), delay);
      } else {
        setIsLoading(false);
      }
      return () => clearTimeout(timeoutId);
    }, [isLoading, delay]);
    if (!isLoading) return <Component isLoading={isLoading} setIsLoading={setIsLoading} {...props} />;
    return <LoadingSpinner />;
  };
}

export default withLoading;