/**
 * Falcon Rider Admin Portal — usePagination
 *
 * Manages pagination state and helpers.
 * Works with server-side pagination.
 */

'use client';

import { useCallback, useMemo, useState } from 'react';

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 20,
  totalItems = 0,
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );

  const canGoNext = page < totalPages;
  const canGoPrev = page > 1;

  const goNext = useCallback(() => {
    if (canGoNext) setPage((p) => p + 1);
  }, [canGoNext]);

  const goPrev = useCallback(() => {
    if (canGoPrev) setPage((p) => p - 1);
  }, [canGoPrev]);

  const goToPage = useCallback(
    (newPage: number) => {
      const clamped = Math.max(1, Math.min(newPage, totalPages));
      setPage(clamped);
    },
    [totalPages]
  );

  const changePageSize = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  return {
    page,
    pageSize,
    totalPages,
    canGoNext,
    canGoPrev,
    goNext,
    goPrev,
    goToPage,
    changePageSize,
    setPage,
    setPageSize,
    reset,
    offset: (page - 1) * pageSize,
  };
}