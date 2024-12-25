import { defineConfig } from 'vite';
import { buildBaseConfig } from "./vite.config.base";

export default defineConfig(({ command }) => {
    const config = buildBaseConfig();
    config.base = 'http://localhost:13579';
    config.build!.sourcemap = true;
    config.server = {
        port: 13579,
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        },
    }
    return config;
});