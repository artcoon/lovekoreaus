# Supabase Auth Social Login Setup Guide

## 1. Provider 활성화

Supabase Dashboard → Authentication → Providers

### Google
1. Google Provider 클릭
2. Status: **Enabled**
3. Client ID와 Client Secret 입력
   - Google Cloud Console → APIs & Services → Credentials → Create OAuth 2.0 Client ID
   - Authorized redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
4. Save

### Kakao
1. Kakao Provider 클릭
2. Status: **Enabled**
3. Client ID와 Client Secret 입력
   - Kakao Developers → 내 애플리케이션 → 플랫폼 → Web → 사이트 도메인 등록: `https://lovekorea.us`
   - Kakao Login → Redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
4. Save

## 2. Site URL / Redirect URLs 설정

Supabase Dashboard → Authentication → URL Configuration

- Site URL: `https://lovekorea.us`
- Redirect URLs 추가:
  - `https://lovekorea.us/api/auth/callback`
  - `https://lovekorea.us/auth/callback`
  - `http://localhost:3000/api/auth/callback` (개발용)

## 3. 현재 발생하는 에러

`{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}`

이 에러는 **Supabase에서 Google/Kakao provider가 Enabled 되어 있지 않아서** 발생합니다. 위 1번 단계를 완료하면 해결됩니다.

## 4. 추가 확인 사항

- `.env.local` / Vercel Environment Variables에 `NEXT_PUBLIC_SITE_URL=https://lovekorea.us` 설정
- Google/Kakao OAuth 앱에서 Redirect URI가 정확히 Supabase callback URL인지 확인
- Supabase Auth → Providers에서 사용하지 않는 provider는 Disabled로 유지

## 5. 테스트

1. 회원가입 페이지에서 Buyer/Seller 선택
2. Google 또는 Kakao로 Continue
3. OAuth 동의 후 `/dashboard` 또는 `/seller-onboarding`로 리디렉션

## 6. 보안 권장사항

- Production에서는 반드시 HTTPS 사용
- Google Client Secret, Kakao Secret은 절대 프론트엔드에 노출하지 않기
- Supabase Service Role Key는 서버 사이드에서만 사용
