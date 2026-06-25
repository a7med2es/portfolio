import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { writeFileSync, mkdirSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    {
      name: "file-upload-middleware",
      configureServer(server: any) {
        server.middlewares.use("/api/upload", (req: any, res: any) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end("Method Not Allowed");
            return;
          }
          const filename =
            (req.headers["x-filename"] as string) ||
            `upload-${Date.now()}.png`;
          const chunks: Buffer[] = [];
          req.on("data", (chunk: Buffer) => chunks.push(chunk));
          req.on("end", () => {
            try {
              const buffer = Buffer.concat(chunks);
              const uploadDir = path.resolve(
                __dirname,
                "public",
                "ahmed-uploads"
              );
              mkdirSync(uploadDir, { recursive: true });
              const filePath = path.join(uploadDir, filename);
              writeFileSync(filePath, buffer);
              res.setHeader("Content-Type", "application/json");
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.end(JSON.stringify({ url: `/ahmed-uploads/${filename}` }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
