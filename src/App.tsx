import { FormEvent, useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import './App.css'
import { locales, type LocaleKey } from './locales'

type ThemeMode = 'light' | 'dark'

function App() {
  const [greetMsg, setGreetMsg] = useState('')
  const [name, setName] = useState('')
  const [language, setLanguage] = useState<LocaleKey>('zh')
  const [theme, setTheme] = useState<ThemeMode>('light')

  const text = locales[language]

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
  }, [language])

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  const toggleLanguage = () => {
    setLanguage((current) => (current === 'zh' ? 'en' : 'zh'))
  }

  async function greet() {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setGreetMsg('')
      return
    }
    setGreetMsg(await invoke('greet', { name: trimmedName }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void greet()
  }

  return (
    <div className="app">
      <header className="app__header">
        <span className="app__brand">CloudFrontend</span>
        <div className="app__toggles">
          <div className="app__control">
            <span className="app__control-label">{text.themeLabel}</span>
            <button
              type="button"
              className="app__control-button"
              onClick={toggleTheme}
              aria-label={`${text.themeLabel}: ${
                theme === 'light' ? text.themeDark : text.themeLight
              }`}
            >
              {theme === 'light' ? text.themeDark : text.themeLight}
            </button>
          </div>
          <div className="app__control">
            <span className="app__control-label">{text.languageLabel}</span>
            <button
              type="button"
              className="app__control-button"
              onClick={toggleLanguage}
              aria-label={text.languageLabel}
            >
              {text.languageToggleLabel}
            </button>
          </div>
        </div>
      </header>

      <main className="app__main">
        <section className="hero">
          <h1 className="hero__title">{text.heroTitle}</h1>
          <p className="hero__subtitle">{text.heroSubtitle}</p>
        </section>

        <form className="greeting-form" onSubmit={handleSubmit}>
          <label className="greeting-form__label" htmlFor="greet-input">
            {text.nameInputLabel}
          </label>
          <div className="greeting-form__controls">
            <input
              id="greet-input"
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
              placeholder={text.nameInputPlaceholder}
            />
            <button type="submit">{text.greetButton}</button>
          </div>
        </form>

        {greetMsg && <p className="greeting-form__result">{greetMsg}</p>}
      </main>
    </div>
  )
}

export default App
