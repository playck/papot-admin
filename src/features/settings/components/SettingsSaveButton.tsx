import { Button } from "@/components/ui/button";

interface SettingsSaveButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isSaving?: boolean;
}

export function SettingsSaveButton({
  onClick,
  disabled = false,
  isSaving = false,
}: SettingsSaveButtonProps) {
  return (
    <div className="flex justify-end">
      <Button
        onClick={onClick}
        disabled={disabled}
        className="bg-green-600 hover:bg-green-700 text-white px-8"
      >
        {isSaving ? "저장 중..." : "저장"}
      </Button>
    </div>
  );
}
