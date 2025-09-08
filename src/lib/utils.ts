import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function extractBase64ImagesFromHtml(html: string) {
  const imgRegex = /<img[^>]+src="(data:image\/[^;]+;base64,[^"]+)"/g;
  const base64Images: string[] = [];
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    base64Images.push(match[1]);
  }

  return base64Images;
}

export const base64ToFile = (base64Data: string, fileName: string): File => {
  const arr = base64Data.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
};
