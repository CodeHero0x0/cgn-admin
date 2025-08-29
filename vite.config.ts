import {resolve} from 'path'
import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

// 将 defineConfig 的参数改为一个函数，以接收 mode 参数
export default defineConfig(({mode}) => {
    // 基于当前工作目录和模式加载 .env 文件
    // process.cwd() 是当前项目根目录
    const env = loadEnv(mode, process.cwd())

    return {
        base: '/',
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
                'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
            }
        },
        plugins: [
            vue(),
            vueSetupExtend(),
            createSvgIconsPlugin({
                iconDirs: [resolve(__dirname, 'src/icons/svg')],
                symbolId: 'icon-[dir]-[name]'
            })
        ],
        server: {
            host: '0.0.0.0',
            port: 3000,
            open: false,

            proxy: {
                [env.VITE_API_BASE_URL]: {
                    target: env.VITE_API_PROXY_TARGET,

                    // 允许跨域
                    changeOrigin: true,

                    rewrite: path => path.replace(new RegExp('^' + env.VITE_API_BASE_URL), '')
                }
            }
        }
    }
})
