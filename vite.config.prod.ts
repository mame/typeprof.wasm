import { defineConfig } from 'vite';
import { buildBaseConfig } from "./vite.config.base";

export default defineConfig(({ command }) => {
    const config = buildBaseConfig();
    config.base = 'https://mame.github.io/typeprof.wasm/';
    return config;
});