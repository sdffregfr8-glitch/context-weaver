import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        title: 'AI Context Engine',
        subtitle: 'Intelligent Document Analysis',
      },
      sidebar: {
        contexts: 'Data Contexts',
        addContext: 'Add Context',
        noContexts: 'No contexts loaded',
        syncFiles: 'Sync Files',
        fileCount: '{{count}} file(s)',
      },
      chat: {
        placeholder: 'Ask anything about your documents...',
        send: 'Send',
        thinking: 'Thinking...',
        greeting: 'Hello! I\'m ready to analyze your documents. Load a context to get started.',
      },
      status: {
        online: 'Connected',
        offline: 'Disconnected',
        connecting: 'Connecting...',
        serverStatus: 'Server Status',
      },
      contextPreview: {
        title: 'Context Preview',
        noContent: 'Select a file to preview',
        references: 'Referenced in response',
      },
      actions: {
        refresh: 'Refresh',
        clear: 'Clear',
        copy: 'Copy',
        download: 'Download',
        delete: 'Delete',
      },
      errors: {
        connectionFailed: 'Failed to connect to AI server',
        fileReadError: 'Error reading file',
        noResponse: 'No response from AI',
      },
    },
  },
  ar: {
    translation: {
      app: {
        title: 'محرك الذكاء الاصطناعي',
        subtitle: 'تحليل المستندات الذكي',
      },
      sidebar: {
        contexts: 'سياقات البيانات',
        addContext: 'إضافة سياق',
        noContexts: 'لا توجد سياقات محملة',
        syncFiles: 'مزامنة الملفات',
        fileCount: '{{count}} ملف(ات)',
      },
      chat: {
        placeholder: 'اسأل أي شيء عن مستنداتك...',
        send: 'إرسال',
        thinking: 'جاري التفكير...',
        greeting: 'مرحباً! أنا جاهز لتحليل مستنداتك. قم بتحميل سياق للبدء.',
      },
      status: {
        online: 'متصل',
        offline: 'غير متصل',
        connecting: 'جاري الاتصال...',
        serverStatus: 'حالة الخادم',
      },
      contextPreview: {
        title: 'معاينة السياق',
        noContent: 'اختر ملفاً للمعاينة',
        references: 'مُشار إليه في الإجابة',
      },
      actions: {
        refresh: 'تحديث',
        clear: 'مسح',
        copy: 'نسخ',
        download: 'تحميل',
        delete: 'حذف',
      },
      errors: {
        connectionFailed: 'فشل الاتصال بخادم الذكاء الاصطناعي',
        fileReadError: 'خطأ في قراءة الملف',
        noResponse: 'لا توجد استجابة من الذكاء الاصطناعي',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
