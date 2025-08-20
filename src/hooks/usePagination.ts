import { useState, useMemo } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  getPageItems: (items: T[]) => T[];
  reset: () => void;
}

export const usePagination = <T = any>({
  totalItems,
  itemsPerPage: initialItemsPerPage = 10,
  initialPage = 1
}: UsePaginationProps): UsePaginationReturn<T> => {
  const [currentPage, setCurrentPageState] = useState(initialPage);
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage, totalItems);
  }, [startIndex, itemsPerPage, totalItems]);

  const hasNextPage = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  const hasPreviousPage = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  const setCurrentPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPageState(validPage);
  };

  const setItemsPerPage = (size: number) => {
    setItemsPerPageState(size);
    // Reset to first page when changing items per page
    setCurrentPageState(1);
  };

  const goToFirstPage = () => {
    setCurrentPageState(1);
  };

  const goToLastPage = () => {
    setCurrentPageState(totalPages);
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPageState(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPageState(currentPage - 1);
    }
  };

  const getPageItems = (items: T[]): T[] => {
    return items.slice(startIndex, endIndex);
  };

  const reset = () => {
    setCurrentPageState(initialPage);
    setItemsPerPageState(initialItemsPerPage);
  };

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    setCurrentPage,
    setItemsPerPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    getPageItems,
    reset
  };
};