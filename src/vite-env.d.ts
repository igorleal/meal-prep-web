/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_MODE: 'mock' | 'local' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
