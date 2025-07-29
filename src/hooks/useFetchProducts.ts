import { apiCall } from "~/utils/callApi.util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// 📋 GET - Lấy danh sách products
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => apiCall("/products"),
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// 📄 GET - Lấy chi tiết 1 product
export const useProduct = (id: string | number, enabled = true) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => apiCall(`/products/${id}`),
    enabled: enabled && !!id,
  });
};

// ➕ POST - Tạo product mới
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: any) =>
      apiCall("/products", {
        method: "POST",
        body: JSON.stringify(productData),
      }),
    onSuccess: () => {
      // Invalidate danh sách products
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// ✏️ PUT - Cập nhật toàn bộ product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...productData }: any) =>
      apiCall(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(productData),
      }),
    onSuccess: (data, variables) => {
      // Invalidate danh sách
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // Invalidate chi tiết product này
      queryClient.invalidateQueries({ queryKey: ["products", variables.id] });
    },
  });
};

// 🔧 PATCH - Cập nhật một phần
export const usePatchProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updates }: any) =>
      apiCall(`/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", variables.id] });
    },
  });
};

// 🗑️ DELETE - Xóa product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) =>
      apiCall(`/products/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (data, deletedId) => {
      // Invalidate danh sách
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // Remove khỏi cache chi tiết
      queryClient.removeQueries({ queryKey: ["products", deletedId] });
    },
  });
};

// 🔍 GET - Tìm kiếm products
export const useSearchProducts = (query: string, enabled = true) => {
  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: () => apiCall(`/products/search?q=${encodeURIComponent(query)}`),
    enabled: enabled && query.length >= 2,
    staleTime: 30 * 1000, // 30 giây
  });
};

// 📂 GET - Products theo category
export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: () => apiCall(`/products?category=${category}`),
    enabled: !!category,
  });
};
