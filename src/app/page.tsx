import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">상품관리 어드민</h1>
          <p className="text-gray-600 mt-2">
            상품을 효율적으로 관리할 수 있는 어드민 페이지입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
