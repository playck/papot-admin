import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase/client";

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // 현재 세션 확인
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("세션 확인 오류:", error);
        }

        setAuthState({
          user: session?.user || null,
          loading: false,
          isAuthenticated: !!session?.user,
        });
      } catch (error) {
        console.error("인증 상태 확인 실패:", error);
        setAuthState({
          user: null,
          loading: false,
          isAuthenticated: false,
        });
      }
    };

    getSession();

    // 인증 상태 변화 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("인증 상태 변화:", event, session?.user?.email);

      setAuthState({
        user: session?.user || null,
        loading: false,
        isAuthenticated: !!session?.user,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 로그아웃
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("로그아웃 오류:", error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error("로그아웃 실패:", error);
      return { success: false, error: "로그아웃 중 오류가 발생했습니다." };
    }
  };

  // 사용자 정보 새로고침
  const refreshUser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("사용자 정보 새로고침 오류:", error);
        return;
      }

      setAuthState((prev) => ({
        ...prev,
        user: user,
        isAuthenticated: !!user,
      }));
    } catch (error) {
      console.error("사용자 정보 새로고침 실패:", error);
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    isAuthenticated: authState.isAuthenticated,
    signOut,
    refreshUser,
    email: authState.user?.email || null,
    userId: authState.user?.id || null,
  };
};
