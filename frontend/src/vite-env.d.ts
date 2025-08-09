/// <reference types="vite/client" />

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ViteTypeOptions {}

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string;
  readonly VITE_SOCKET_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
