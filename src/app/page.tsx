"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/hooks/useAuth";

export default function Home() {
  const { loading, isAuthenticated, signOut } = useAuth();
  const router = useRouter();

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우
  if (!isAuthenticated) {
    return null;
  }

  const handleSignOut = async () => {
    const { success } = await signOut();
    if (success) {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 py-8">
        {/* 헤더 - 사용자 정보 및 로그아웃 */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PAPOT 관리자</h1>
            <p className="text-gray-600 mt-2">
              안녕하세요, 종진님! 오늘도 화이팅! 🌱
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            로그아웃
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>상품 목록</CardTitle>
              <CardDescription>
                등록된 모든 상품을 조회하고 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">상품 목록 보기</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>상품 등록</CardTitle>
              <CardDescription>
                새로운 상품을 시스템에 등록합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">상품 등록하기</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>카테고리 관리</CardTitle>
              <CardDescription>
                상품 카테고리를 생성하고 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">카테고리 관리</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
