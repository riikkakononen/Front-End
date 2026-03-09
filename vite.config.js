import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                home: resolve(__dirname, 'index.html'),
                getstarted: resolve(__dirname, 'getstarted/index.html'),
                about: resolve(__dirname, 'about/index.html'),
                bmicalculator: resolve(__dirname, 'bmicalculator/index.html'),
            },
        },
    },
    
    base: '/~riikkono/AlignmentGuide/'
});