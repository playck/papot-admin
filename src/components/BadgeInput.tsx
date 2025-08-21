"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

const MAX_BADGES = 5;

interface BadgeInputProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxBadges?: number;
}

export const BadgeInput: React.FC<BadgeInputProps> = ({
  value = [],
  onChange,
  placeholder = "뱃지 이름을 입력하고 Enter를 누르세요",
  className,
  disabled = false,
  maxBadges = MAX_BADGES,
}) => {
  const [inputValue, setInputValue] = React.useState("");

  const handleAddBadge = () => {
    const trimmedValue = inputValue.trim();

    if (
      trimmedValue &&
      !value.includes(trimmedValue) &&
      value.length < maxBadges
    ) {
      onChange?.([...value, trimmedValue]);
      setInputValue("");
    }
  };

  const handleRemoveBadge = (index: number) => {
    const newBadges = value.filter((_, i) => i !== index);
    onChange?.(newBadges);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddBadge();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const isMaxReached = value.length >= maxBadges;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder={
              isMaxReached
                ? `최대 ${maxBadges}개 뱃지까지 추가 가능합니다`
                : placeholder
            }
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={disabled || isMaxReached}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddBadge}
          disabled={
            disabled ||
            !inputValue.trim() ||
            isMaxReached ||
            value.includes(inputValue.trim())
          }
          className="shrink-0"
        >
          <Plus className="w-4 h-4 mr-1" />
          추가
        </Button>
      </div>

      <div className="text-xs text-gray-500">
        {value.length}/{maxBadges} 뱃지 사용 중
        {inputValue.trim() && value.includes(inputValue.trim()) && (
          <span className="text-orange-500 ml-2">
            • 이미 존재하는 뱃지입니다
          </span>
        )}
      </div>

      {/* 뱃지 리스트 */}
      {value.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            생성된 뱃지 ({value.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {value.map((badge, index) => (
              <div key={index} className="relative group">
                <Badge variant="secondary" className="w-fit">
                  {badge}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveBadge(index)}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black hover:bg-gray-800 text-white"
                  disabled={disabled}
                >
                  <X className="w-2 h-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

BadgeInput.displayName = "BadgeInput";
