"use client";

import {
  useProductDetailForm,
  ProductDetailFormData,
} from "../hooks/useProductDetailForm";
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
import { FileUpload, BadgeInput } from "@/components";

interface ProductDetailFormProps {
  initialData?: Partial<ProductDetailFormData>;
  onSubmit?: (data: ProductDetailFormData) => void;
}

export default function ProductDetailForm({
  initialData,
  onSubmit,
}: ProductDetailFormProps) {
  const { methods, handleSubmit } = useProductDetailForm(initialData);

  const onFormSubmit = (data: ProductDetailFormData) => {
    console.log("Form submitted:", data);
    onSubmit?.(data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            상품 상세 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...methods}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
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
                      <FormMessage />
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

              {/* 상품 설명 */}
              <FormField
                control={methods.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상품 설명 *</FormLabel>
                    <FormControl>
                      <FormTextarea
                        placeholder="상품에 대한 자세한 설명을 입력하세요"
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
                <FileUpload
                  value={methods.watch("images") || []}
                  onChange={(images) => methods.setValue("images", images)}
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

              {/* 제출 버튼 */}
              <div className="flex justify-end space-x-3 pt-6">
                <Button type="button" variant="outline">
                  취소
                </Button>
                <Button type="submit">상품 저장</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
