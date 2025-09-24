export const locales = {
  zh: {
    heroTitle: '云端应用助手',
    heroSubtitle: '体验跨平台桌面能力，与 Tauri 一起打造高效工作流。',
    nameInputLabel: '请输入姓名以获取问候',
    nameInputPlaceholder: '请输入姓名…',
    greetButton: '发送问候',
    themeLabel: '主题',
    themeLight: '明亮',
    themeDark: '暗黑',
    languageLabel: '语言',
    languageToggleLabel: 'English'
  },
  en: {
    heroTitle: 'Cloud Application Companion',
    heroSubtitle: 'Experience cross-platform desktop power with Tauri in a streamlined workflow.',
    nameInputLabel: 'Enter a name to receive a greeting',
    nameInputPlaceholder: 'Enter your name…',
    greetButton: 'Send Greeting',
    themeLabel: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    languageLabel: 'Language',
    languageToggleLabel: '中文'
  }
} as const

export type LocaleKey = keyof typeof locales
export type LocaleContent = (typeof locales)[LocaleKey]
