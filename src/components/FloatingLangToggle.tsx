import { useTranslation } from 'react-i18next'

export function FloatingLangToggle() {
  const { i18n } = useTranslation()

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'bn' ? 'en' : 'bn')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleLang}
        className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:shadow-orange-500/30 hover:scale-110 border-2 border-transparent hover:border-orange-400"
        style={{
          background: 'linear-gradient(135deg, #F97316, #FB923C)',
          color: 'white',
        }}
        aria-label={i18n.language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
        title={i18n.language === 'bn' ? 'English' : 'বাংলা'}
      >
        <span className="font-bold text-sm tracking-wider">
          {i18n.language === 'bn' ? 'EN' : 'বাং'}
        </span>
      </button>
    </div>
  )
}