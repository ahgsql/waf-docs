import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// Helper function to get API sidebar items
function getApiSidebarItems(lang) {
  const apiDir = path.resolve(__dirname, `../../web-automation-framework`)
  const outputDir = lang === 'en' ? 'en/api' : 'tr/api'
  const items = []

  const sourceDirs = ['core', 'modules', 'utils']
  const sourceFiles = [path.join(apiDir, 'index.js')]

  sourceDirs.forEach(dir => {
    const fullDir = path.join(apiDir, dir)
    if (fs.existsSync(fullDir)) {
      const files = fs.readdirSync(fullDir)
        .filter(file => file.endsWith('.js'))
        .map(file => ({
          text: path.basename(file, '.js'),
          link: `/${outputDir}/${path.basename(file, '.js')}`
        }))
      if (files.length > 0) {
        items.push({
          text: dir.charAt(0).toUpperCase() + dir.slice(1), // Capitalize first letter
          collapsed: true,
          items: files
        })
      }
    }
  })

  sourceFiles.forEach(file => {
    if (fs.existsSync(file)) {
      items.push({
        text: path.basename(file, '.js'),
        link: `/${outputDir}/${path.basename(file, '.js')}`
      })
    }
  })
  return items.sort((a, b) => a.text.localeCompare(b.text)); // Sort alphabetically
}


export default defineConfig({
  title: 'WAF Documentation',
  description: 'Web Automation Framework Documentation',
  ignoreDeadLinks: true,

  // Theme related configurations.
  themeConfig: {
    // Common search settings, social links etc. can go here
    socialLinks: [
      { icon: 'github', link: 'https://github.com/web-automation-framework/waf' } // Örnek, projenizin GitHub linki ile değiştirin
    ]
  },

  locales: {
    root: { // English (Default)
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'API Overview', link: '/en/api' },
          // { text: 'API Reference', link: '/en/api-reference' }, // Removed old static link
          { text: 'Best Practices', link: '/en/best-practices' }
        ],
        sidebar: {
          '/en/': [
            {
              text: 'Guide',
              items: [
                { text: 'Introduction', link: '/en/' }
              ]
            },
            {
              text: 'API',
              items: [
                { text: 'Overview', link: '/en/api' }
                // { text: 'Reference (Auto-generated)', link: '/en/api-reference' } // Removed old static link
              ]
            },
            {
              text: 'API Reference',
              collapsed: false,
              items: getApiSidebarItems('en')
            },
            {
              text: 'Development',
              items: [
                { text: 'Best Practices', link: '/en/best-practices' }
              ]
            }
          ]
        },
        editLink: {
          pattern: 'https://github.com/web-automation-framework/waf/edit/main/waf-docs/:path', // Örnek, projenizin GitHub linki ile değiştirin
          text: 'Edit this page on GitHub'
        },
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2024-present WAF Team'
        }
      }
    },
    tr: {
      label: 'Türkçe',
      lang: 'tr',
      link: '/tr/',
      themeConfig: {
        nav: [
          { text: 'Anasayfa', link: '/tr/' },
          { text: 'API Genel Bakış', link: '/tr/api' },
          // API Referansı linki navigasyona eklenebilir, şimdilik kenar çubuğunda
          { text: 'En İyi Uygulamalar', link: '/tr/best-practices' }
        ],
        sidebar: {
          '/tr/': [
            {
              text: 'Kılavuz',
              items: [
                { text: 'Giriş', link: '/tr/' }
              ]
            },
            {
              text: 'API',
              items: [
                { text: 'Genel Bakış', link: '/tr/api' }
              ]
            },
            {
              text: 'API Referansı',
              collapsed: false,
              items: getApiSidebarItems('tr')
            },
            {
              text: 'Geliştirme',
              items: [
                 { text: 'En İyi Uygulamalar', link: '/tr/best-practices' }
              ]
            }
          ]
        },
        editLink: {
          pattern: 'https://github.com/web-automation-framework/waf/edit/main/waf-docs/:path', // Örnek, projenizin GitHub linki ile değiştirin
          text: 'Bu sayfayı GitHub\'da düzenle'
        },
        footer: {
          message: 'MIT Lisansı altında yayınlanmıştır.',
          copyright: 'Telif Hakkı © 2024-günümüz WAF Ekibi'
        },
        // VitePress'in kendi metinlerini Türkçeleştirmek için
        docFooter: {
          prev: 'Önceki sayfa',
          next: 'Sonraki sayfa'
        },
        outlineTitle: 'Bu sayfada',
        lastUpdatedText: 'Son güncelleme'
      }
    }
  }
})
