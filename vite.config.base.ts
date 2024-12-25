import { UserConfig } from 'vite';
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';
import vsixPlugin from '@codingame/monaco-vscode-rollup-vsix-plugin';

export const buildBaseConfig: () => UserConfig = () => ({
    build: {
        target: 'ES2022',
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                importMetaUrlPlugin,
            ]
        },
        include: [
            'vscode-textmate',
            'vscode-oniguruma',
        ],
    },
    define: {
        rootDirectory: JSON.stringify(__dirname),
    },
    worker: {
        format: 'es',
    },
    plugins: [
        vsixPlugin({
            transformManifest: (manifest) => ({ browser: manifest.main, ...manifest })
        }),
    ],
});