import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src", // 相对于项目根目录
    },
  },
  server: {
    port: 8000,
    host: true,
    open: true,
    proxy: {
      // "/api": {
      //   target: "http://182.160.29.95:8001",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ""),
      // },
      "/contract": {
        target: "http://116.204.67.82:8083",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/contract/, ""),
      },
      "/pdf_parse": {
        target: "http://3.25.107.115:8002/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pdf_parse/, ""),
      },
    },
  },
});
