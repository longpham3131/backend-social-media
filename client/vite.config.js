import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import vitePluginImp from "vite-plugin-imp";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: /^~/, replacement: "" },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
  plugins: [reactRefresh()],
});
