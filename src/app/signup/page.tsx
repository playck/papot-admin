"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (password.length < 6) {
      setMessage("비밀번호는 최소 6자 이상이어야 합니다.");
      setIsLoading(false);
      return;
    }

    if (!name.trim()) {
      setMessage("이름을 입력해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setMessage(`회원가입 실패: ${authError.message}`);
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        const { error: dbError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: email,
          name: name,
          phone: phone || null,
          role: "admin",
          is_active: true,
        });

        if (dbError) {
          setMessage(`사용자 정보 저장 실패: ${dbError.message}`);
        } else {
          setMessage("관리자 계정 생성 성공! 이메일을 확인해주세요.");
          // 폼 초기화
          setEmail("");
          setPassword("");
          setName("");
          setPhone("");
        }
      }
    } catch (err) {
      console.error("회원가입 오류:", err);
      setMessage("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">관리자 회원가입</CardTitle>
          <p className="text-gray-600">관리자 계정을 생성합니다</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                이메일 *
              </label>
              <input
                name="email"
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                이름 *
              </label>
              <input
                name="name"
                id="name"
                type="text"
                placeholder="관리자 이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                전화번호
              </label>
              <input
                name="phone"
                id="phone"
                type="tel"
                placeholder="010-1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호 *
              </label>
              <input
                name="password"
                id="password"
                type="password"
                placeholder="최소 6자 이상"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {message && (
              <div
                className={`text-sm p-3 rounded ${
                  message.includes("성공")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "관리자 계정 생성 중..." : "관리자 계정 생성"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
