import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
 feature/candidate-profile
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        port: 5173,
        watch: {
            ignored: ['**/.vs/**'],
        },
    },

    plugins: [react()],
    server: {
        port: 5173,
        watch: {
            ignored: ['**/.vs/**']
        }
    }
 dev
});