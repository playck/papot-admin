import { supabase } from "@/services/supabase/client";

export interface Settings {
  id: string;
  main_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const getSettings = async (): Promise<Settings | null> => {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error("설정 조회 실패:", error);
    throw new Error("설정을 불러올 수 없습니다.");
  }

  return data;
};

export const updateMainImage = async (
  id: string,
  imageUrl: string | null
): Promise<Settings> => {
  const { data, error } = await supabase
    .from("settings")
    .update({ main_image_url: imageUrl })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("메인 이미지 업데이트 실패:", error);
    throw new Error("설정을 저장할 수 없습니다.");
  }

  return data;
};
