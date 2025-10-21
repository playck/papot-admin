"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageUpload, BadgeInput } from "@/components";
import { Editor } from "@/components/editor";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/services/hooks/useAuth";
import {
  useProductDetailForm,
  ProductDetailFormData,
} from "../hooks/useProductDetailForm";
import { useProductCreate } from "../hooks/useProductCreate";
import { useCategories } from "@/features/category/services/hooks";

interface ProductDetailFormProps {
  initialData?: Partial<ProductDetailFormData>;
  isEditMode?: boolean;
  productId?: string;
}

export default function ProductDetailForm({
  initialData,
  isEditMode = false,
  productId,
}: ProductDetailFormProps) {
  const { user } = useAuth();
  const { methods, handleSubmit } = useProductDetailForm(initialData);
  const { handleProductSubmit, isPending } = useProductCreate({
    isEditMode,
    productId,
    userId: user?.id,
    onFormReset: () => methods.reset(),
  });
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();

  if (isCategoriesLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const categories = categoriesData?.categories || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {isEditMode ? "상품 정보 수정" : "상품 등록"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...methods}>
            <form
              onSubmit={handleSubmit(handleProductSubmit)}
              className="space-y-6"
            >
              {/* 상품 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={methods.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상품 이름 *</FormLabel>
                      <FormControl>
                        <FormInput
                          placeholder="상품 이름을 입력하세요"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>게시 상태</FormLabel>
                  <FormField
                    control={methods.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                            value={field.value ? "true" : "false"}
                            className="flex flex-row space-x-3 mt-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="true" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer mb-0">
                                게시
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="false" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer mb-0">
                                비공개
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 상품 카테고리 */}
              <FormField
                control={methods.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상품 카테고리 *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString()}
                        className="flex flex-wrap gap-3 mt-4"
                      >
                        {categories.length === 0 ? (
                          <p className="text-sm text-gray-500">
                            등록된 카테고리가 없습니다.
                          </p>
                        ) : (
                          categories.map((category) => (
                            <FormItem
                              key={category.id}
                              className="flex items-center space-x-2 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem
                                  value={category.id.toString()}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer mb-0">
                                {category.name}
                              </FormLabel>
                            </FormItem>
                          ))
                        )}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 상품 간단 설명 */}
              <FormField
                control={methods.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상품 간단 설명 *</FormLabel>
                    <FormControl>
                      <FormTextarea
                        placeholder="상품에 대한 간단한 설명을 입력하세요"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 상품 이미지 */}
              <div className="space-y-4">
                <FormLabel>상품 이미지 *</FormLabel>
                <ImageUpload
                  images={methods.watch("images") || []}
                  onChange={(images: string[]) =>
                    methods.setValue("images", images)
                  }
                  maxFiles={10}
                  placeholder="이미지를 선택하거나 드래그하세요 (여러 개 선택 가능)"
                />
                {methods.formState.errors.images && (
                  <p className="text-sm font-medium text-destructive">
                    {methods.formState.errors.images.message}
                  </p>
                )}
              </div>

              {/* 수량 및 가격 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={methods.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>수량 *</FormLabel>
                      <FormControl>
                        <FormInput
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>가격 (원) *</FormLabel>
                      <FormControl>
                        <FormInput
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name="discountRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>할인률 (%)</FormLabel>
                      <FormControl>
                        <FormInput
                          type="number"
                          placeholder="0"
                          min="0"
                          max="100"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 상품 뱃지 */}
              <div className="space-y-4">
                <FormLabel>상품 뱃지</FormLabel>
                <BadgeInput
                  value={methods.watch("badges") || []}
                  onChange={(badges) => methods.setValue("badges", badges)}
                  maxBadges={5}
                  placeholder="뱃지 이름을 입력하고 Enter를 누르세요"
                />
                {methods.formState.errors.badges && (
                  <p className="text-sm font-medium text-destructive">
                    {methods.formState.errors.badges.message}
                  </p>
                )}
              </div>

              {/* 상품 상세 설명 (에디터) */}
              <FormField
                control={methods.control}
                name="detailDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상품 상세 설명</FormLabel>
                    <FormControl>
                      <Editor
                        initialValue={field.value || ""}
                        placeholder="상품에 대한 상세한 설명을 입력 해 주세요."
                        onChange={field.onChange}
                        showPreview={true}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 제출 버튼 */}
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline">
                  취소
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending
                    ? "저장 중..."
                    : isEditMode
                    ? "상품 수정"
                    : "상품 저장"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
