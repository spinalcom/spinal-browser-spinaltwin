/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import axios from 'axios';
import ElementLocale from 'element-ui/lib/locale';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
const enLocalElement = require('element-ui/lib/locale/lang/en');
const enLocal = require('../local/en');
const messages = {
  en: {
    ...enLocalElement.default,
    ...enLocal.default,
  },
};
export const i18n = new VueI18n({
  locale: 'en',
  messages,
});

const loadedLanguages: string[] = []; // our default language that is preloaded
const elementLang = {
  en: () => Promise.resolve([enLocalElement, enLocal]),
  fr: () => {
    return Promise.all([
      import('element-ui/lib/locale/lang/fr'),
      import('../local/fr'),
    ]);
  },
};

function setI18nLanguage(lang) {
  i18n.locale = lang;
  axios.defaults.headers.common['Accept-Language'] = lang;
  const html = document.querySelector('html');
  html?.setAttribute('lang', lang);
  return lang;
}

export function loadLanguageAsync(lang: string) {
  // If the same language
  if (i18n.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // If the language was already loaded
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang));
  }
  return elementLang[lang]().then((langs) => {
    setLang(lang);
    const msg = {};
    for (const local of langs) {
      Object.assign(msg, local.default);
    }
    i18n.setLocaleMessage(lang, msg);
    loadedLanguages.push(lang);
    return setI18nLanguage(lang);
  });
}

function getFirstBrowserLanguage() {
  var nav = window.navigator,
    i,
    language,
    browserLanguagePropertyKeys = [
      'language',
      'browserLanguage',
      'systemLanguage',
      'userLanguage',
    ];
  // support for HTML 5.1 "navigator.languages"
  if (Array.isArray(nav.languages)) {
    for (i = 0; i < nav.languages.length; i++) {
      language = nav.languages[i];
      if (language && language.length) {
        return language;
      }
    }
  }
  // support for other well known properties in browsers
  for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
    language = nav[browserLanguagePropertyKeys[i]];
    if (language && language.length) {
      return language;
    }
  }
  return null;
}

function getLang(): string {
  const lang = window.localStorage.getItem('spinal-lang');
  if (!lang) {
    const lang = getFirstBrowserLanguage();
    const languages = ['en', 'fr'];
    for (const language of languages) {
      if (lang.toLocaleLowerCase().startsWith(language)) {
        return language;
      }
    }
    return 'fr';
  }
  return lang;
}
function setLang(lang: string) {
  window.localStorage.setItem('spinal-lang', lang);
}

export function getDefaultLanguage() {
  return loadLanguageAsync(getLang());
}
ElementLocale.i18n((key, value) => i18n.t(key, value));
