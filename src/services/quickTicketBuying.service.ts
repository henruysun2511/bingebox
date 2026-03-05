import { ApiResponse } from "@/types/body";
import http from "@/utils/http";

const prefix = "quick-ticket-buyings";

export const QuickTicketService = {
  getCinemas: (movieId: string) =>
    http.get<ApiResponse<any[]>>(`/${prefix}/cinemas/${movieId}`),

  getDates: (params: { movieId: string; cinemaId: string }) =>
    http.get<ApiResponse<string[]>>(`/${prefix}/dates`, { params }),

  getTimes: (params: { movieId: string; cinemaId: string; date: string }) =>
    http.get<ApiResponse<any[]>>(`/${prefix}/times`, { params }),
};