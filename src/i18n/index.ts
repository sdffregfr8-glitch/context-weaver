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
        demoMode: 'Demo Mode',
        serverMode: 'Server Mode',
      },
      chat: {
        placeholder: 'Ask anything about your documents...',
        send: 'Send',
        thinking: 'Thinking...',
        greeting: 'Hello! I\'m ready to analyze your documents. Load a context to get started.',
        serverOffline: 'Server is offline. Please check connection settings.',
      },
      status: {
        online: 'Connected',
        offline: 'Disconnected',
        connecting: 'Connecting...',
        serverStatus: 'Server Status',
        corsError: 'CORS/Network Error',
        timeout: 'Connection Timeout',
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
      settings: {
        title: 'Server Settings',
        description: 'Configure the connection to Ollama server and file system.',
        ollamaEndpoint: 'Ollama Server URL',
        endpointHint: 'Example: http://localhost:11434 or http://your-server-ip:11434',
        filesApiPath: 'Files API Path',
        model: 'AI Model',
        temperature: 'Temperature',
        topP: 'Top P',
        saved: 'Settings Saved',
        savedDescription: 'Your settings have been updated successfully.',
        reset: 'Settings Reset',
        resetDescription: 'Settings have been restored to defaults.',
        resetButton: 'Reset',
      },
      export: {
        title: 'Export Conversation',
        success: 'Export Successful',
        successDescription: 'Conversation exported as Markdown file.',
        noMessages: 'No Messages',
        noMessagesDescription: 'There are no messages to export.',
      },
      common: {
        cancel: 'Cancel',
        save: 'Save',
        close: 'Close',
      },
      errors: {
        connectionFailed: 'Failed to connect to AI server',
        fileReadError: 'Error reading file',
        noResponse: 'No response from AI',
        corsError: 'CORS error - Server needs to allow external requests',
        networkError: 'Network error - Check server availability',
        timeoutError: 'Request timed out',
        syncFailed: 'Failed to sync files from server',
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
        demoMode: 'وضع العرض التجريبي',
        serverMode: 'وضع السيرفر',
      },
      chat: {
        placeholder: 'اسأل أي شيء عن مستنداتك...',
        send: 'إرسال',
        thinking: 'جاري التفكير...',
        greeting: 'مرحباً! أنا جاهز لتحليل مستنداتك. قم بتحميل سياق للبدء.',
        serverOffline: 'السيرفر غير متصل. يرجى التحقق من إعدادات الاتصال.',
      },
      status: {
        online: 'متصل',
        offline: 'غير متصل',
        connecting: 'جاري الاتصال...',
        serverStatus: 'حالة الخادم',
        corsError: 'خطأ CORS/شبكة',
        timeout: 'انتهت مهلة الاتصال',
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
      settings: {
        title: 'إعدادات السيرفر',
        description: 'تكوين الاتصال بخادم Ollama ونظام الملفات.',
        ollamaEndpoint: 'عنوان خادم Ollama',
        endpointHint: 'مثال: http://localhost:11434 أو http://your-server-ip:11434',
        filesApiPath: 'مسار API الملفات',
        model: 'نموذج الذكاء الاصطناعي',
        temperature: 'درجة الحرارة',
        topP: 'Top P',
        saved: 'تم حفظ الإعدادات',
        savedDescription: 'تم تحديث إعداداتك بنجاح.',
        reset: 'إعادة تعيين الإعدادات',
        resetDescription: 'تمت استعادة الإعدادات الافتراضية.',
        resetButton: 'إعادة تعيين',
      },
      export: {
        title: 'تصدير المحادثة',
        success: 'تم التصدير بنجاح',
        successDescription: 'تم تصدير المحادثة كملف Markdown.',
        noMessages: 'لا توجد رسائل',
        noMessagesDescription: 'لا توجد رسائل للتصدير.',
      },
      common: {
        cancel: 'إلغاء',
        save: 'حفظ',
        close: 'إغلاق',
      },
      errors: {
        connectionFailed: 'فشل الاتصال بخادم الذكاء الاصطناعي',
        fileReadError: 'خطأ في قراءة الملف',
        noResponse: 'لا توجد استجابة من الذكاء الاصطناعي',
        corsError: 'خطأ CORS - يجب أن يسمح السيرفر بالطلبات الخارجية',
        networkError: 'خطأ في الشبكة - تحقق من توفر السيرفر',
        timeoutError: 'انتهت مهلة الطلب',
        syncFailed: 'فشل مزامنة الملفات من السيرفر',
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
