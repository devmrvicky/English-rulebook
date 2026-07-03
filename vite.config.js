import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        // lucide-react gzips to ~135 KB — acceptable, cached after first load.
        chunkSizeWarningLimit: 900,
        rollupOptions: {
            output: {
                manualChunks: {
                    "vendor-react": ["react", "react-dom", "react-router-dom"],
                    "vendor-dexie": ["dexie"],
                    "vendor-icons": ["lucide-react"],
                    "vendor-zustand": ["zustand"],
                },
            },
        },
    },
});
