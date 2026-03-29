/**
 * vite 클라이언트 타입과 환경 변수 타입 선언 파일
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SERVER_ADDRESS: string;
  readonly VITE_DISCORD_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
