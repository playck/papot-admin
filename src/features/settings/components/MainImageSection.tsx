import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/image-upload/ImageUpload";

interface MainImageSectionProps {
  images: string[];
  onImageChange: (images: string[]) => void;
  disabled?: boolean;
}

export function MainImageSection({
  images,
  onImageChange,
  disabled = false,
}: MainImageSectionProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">메인 이미지</h2>
      <p className="text-sm text-gray-600 mb-4">
        홈페이지 메인 화면에 표시될 이미지를 업로드하세요.
      </p>
      <ImageUpload
        images={images}
        onChange={onImageChange}
        placeholder="메인 이미지를 선택하거나 드래그 해 주세요."
        maxFiles={1}
        disabled={disabled}
        pathPrefix="settings"
      />
    </Card>
  );
}
