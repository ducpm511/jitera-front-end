import { authApi } from './authApi';
import { GenericResponse, IBidItemsResponse, IBidItemResponse } from './types';

export const getAllBidItemsFn = async () => {
  const response = await authApi.get<IBidItemsResponse>(`bid-item`);
  return response.data;
};

export const getBidItemFn = async (id: string) => {
  const response = await authApi.get<IBidItemResponse>(`bid-item/${id}`);
  return response.data;
};

export const createBidItemFn = async (data: any) => {
  const response = await authApi.post<IBidItemResponse>(`bid-item`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const updateBidItemFn = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) => {
  const response = await authApi.patch<IBidItemResponse>(`bid-item/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteBidItemFn = async (id: string) => {
  const response = await authApi.delete<GenericResponse>(`bid-item/${id}`);
  return response.data;
};
