
import { QuickTicketService } from "@/services/quickTicketBuying.service";
import { useQuery } from "@tanstack/react-query";

export const QUICK_TICKET_KEY = ["quick-ticket"];

export const useQuickCinemas = (movieId: string) => {
  return useQuery({
    queryKey: [...QUICK_TICKET_KEY, "cinemas", movieId],
    queryFn: async () => {
      const res = await QuickTicketService.getCinemas(movieId);
      return res.data;
    },
    enabled: !!movieId,
  });
};

export const useQuickDates = (params: { movieId: string; cinemaId: string }) => {
  return useQuery({
    queryKey: [...QUICK_TICKET_KEY, "dates", params],
    queryFn: async () => {
      const res = await QuickTicketService.getDates(params);
      return res.data;
    },
    enabled: !!params.movieId && !!params.cinemaId,
  });
};

export const useQuickTimes = (params: { movieId: string; cinemaId: string; date: string }) => {
  return useQuery({
    queryKey: [...QUICK_TICKET_KEY, "times", params],
    queryFn: async () => {
      const res = await QuickTicketService.getTimes(params);
      return res.data;
    },
    enabled: !!params.movieId && !!params.cinemaId && !!params.date,
  });
};