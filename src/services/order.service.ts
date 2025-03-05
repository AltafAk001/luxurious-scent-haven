
// Update the useOrders hook to use the correct API
export const useOrders = (page = 1, pageSize = 10, filters?: OrderFilters) => {
  return useQuery({
    queryKey: ['orders', page, pageSize, filters],
    queryFn: () => orderService.getOrders(page, pageSize, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
