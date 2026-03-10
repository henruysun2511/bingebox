import { expires } from "@/constants/expires";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from 'js-cookie';

export function useRefreshTokenQuery() {
  return useQuery({
    queryKey: ["auth-refresh"],
    queryFn: async () => {
      const res = await authService.refreshToken();
      return res.data.data.accessToken as string;
    },
    retry: false,
    staleTime: Infinity,
  });
}

export function useRegister() {
    return useMutation({
        mutationFn: authService.register,
    });
}

export function useLogin() {
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation({
        mutationFn: authService.login,
        onSuccess: (res) => {
            const { username, role, avatar, accessToken } = res.data.data;
            setAuth({ username, role, avatar}, accessToken);
            Cookies.set('accessToken', accessToken, { expires: expires });
        },
    });
}

export function useLogout() {
    const logoutStore = useAuthStore((s) => s.logout);

    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            logoutStore();
            window.location.href = "/";
        },
    });
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authService.resetPassword,
  });
};


export const useChangePassword = () => {
  return useMutation({
    mutationFn: authService.changePassword,
  });
};