"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormSelect } from "@/components/ui/form-select";

interface ExampleFormData {
  name: string;
  email: string;
  category: string;
  description: string;
  price: number;
}

const categoryOptions = [
  { value: "electronics", label: "전자제품" },
  { value: "clothing", label: "의류" },
  { value: "food", label: "식품" },
  { value: "household", label: "생활용품" },
  { value: "sports", label: "스포츠" },
];

export default function ExampleForm() {
  const form = useForm<ExampleFormData>({
    defaultValues: {
      name: "",
      email: "",
      category: "",
      description: "",
      price: 0,
    },
  });

  const onSubmit = (data: ExampleFormData) => {
    console.log("Form submitted:", data);
    alert("폼이 제출되었습니다! 콘솔을 확인하세요.");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>React Hook Form 예시</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                name="name"
                label="상품명"
                placeholder="상품명을 입력하세요"
                required
              />

              <FormInput
                name="email"
                label="이메일"
                type="email"
                placeholder="이메일을 입력하세요"
                description="연락 가능한 이메일 주소를 입력하세요"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                name="category"
                label="카테고리"
                placeholder="카테고리를 선택하세요"
                options={categoryOptions}
                required
              />

              <FormInput
                name="price"
                label="가격"
                type="number"
                placeholder="0"
                description="원 단위로 입력하세요"
                required
              />
            </div>

            <FormTextarea
              name="description"
              label="상품 설명"
              placeholder="상품에 대한 자세한 설명을 입력하세요"
              description="고객이 이해하기 쉽게 작성해주세요"
              rows={4}
            />

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                제출하기
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="flex-1"
              >
                초기화
              </Button>
            </div>

            {/* 폼 상태 디버깅 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">폼 상태 (개발용)</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(form.watch(), null, 2)}
              </pre>
              {Object.keys(form.formState.errors).length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium text-red-600">에러:</h4>
                  <pre className="text-xs text-red-600">
                    {JSON.stringify(form.formState.errors, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
