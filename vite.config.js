import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
<<<<<<< HEAD
        port: 5173,
=======
>>>>>>> 4b7e401 (Frontend updates)
        watch: {
            ignored: ['**/.vs/**']
        }
    }
<<<<<<< HEAD
});
=======
})
>>>>>>> 4b7e401 (Frontend updates)
