// src/i18n/translations.ts

import type { AppLanguage } from '@/store/preferences.store';

export type TranslationKey =
  // Common
  | 'common.back'
  | 'common.cancel'
  | 'common.confirm'
  | 'common.save'
  | 'common.continue'
  | 'common.loading'
  | 'common.retry'
  | 'common.comingSoon'
  // Auth
  | 'auth.welcome.title'
  | 'auth.welcome.tagline'
  | 'auth.welcome.login'
  | 'auth.welcome.signup'
  | 'auth.login.title'
  | 'auth.login.subtitle'
  | 'auth.login.identifier'
  | 'auth.login.password'
  | 'auth.login.submit'
  | 'auth.login.forgot'
  | 'auth.login.noAccount'
  | 'auth.signup.title'
  | 'auth.signup.subtitle'
  | 'auth.signup.fullName'
  | 'auth.signup.identifier'
  | 'auth.signup.password'
  | 'auth.signup.passwordConfirm'
  | 'auth.signup.submit'
  | 'auth.signup.haveAccount'
  | 'auth.logout'
  | 'auth.logout.confirm'
  // Tabs (4 tabs)
  | 'tabs.home'
  | 'tabs.activity'
  | 'tabs.journeys'
  | 'tabs.account'
  // Hidden tab screens (still translated for deep links)
  | 'tabs.trips'
  | 'tabs.earnings'
  // Home
  | 'home.greeting'
  | 'home.offline.title'
  | 'home.offline.description'
  | 'home.online.title'
  | 'home.online.description'
  | 'home.goOnline'
  | 'home.goOffline'
  | 'home.shareJourney'
  | 'home.createJourney'
  | 'home.myJourney'
  | 'home.noActivity'
  // Activity (professional operations)
  | 'activity.title'
  | 'activity.requests'
  | 'activity.active'
  | 'activity.upcoming'
  | 'activity.completed'
  | 'activity.empty'
  | 'activity.empty.description'
  // Journeys (community)
  | 'journeys.title'
  | 'journeys.empty'
  | 'journeys.empty.description'
  | 'journeys.create'
  | 'journeys.active'
  | 'journeys.scheduled'
  | 'journeys.completed'
  | 'journeys.cancelled'
  // Trips (hidden — placeholder)
  | 'trips.title'
  | 'trips.empty'
  | 'trips.empty.description'
  // Earnings (hidden — placeholder)
  | 'earnings.title'
  | 'earnings.today'
  | 'earnings.week'
  | 'earnings.month'
  | 'earnings.empty'
  | 'earnings.empty.description'
  // Account
  | 'account.title'
  | 'account.profile'
  | 'account.vehicle'
  | 'account.documents'
  | 'account.earnings'
  | 'account.preferences'
  | 'account.language'
  | 'account.appearance'
  | 'account.notifications'
  | 'account.security'
  | 'account.support'
  | 'account.about'
  | 'account.logout'
  // Settings
  | 'settings.language.title'
  | 'settings.language.english'
  | 'settings.language.swahili'
  | 'settings.appearance.title'
  | 'settings.appearance.system'
  | 'settings.appearance.light'
  | 'settings.appearance.dark';

type Translations = Record<TranslationKey, string>;

export const EN: Translations = {
  // Common
  'common.back': 'Back',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.save': 'Save',
  'common.continue': 'Continue',
  'common.loading': 'Loading…',
  'common.retry': 'Try again',
  'common.comingSoon': 'Coming soon.',
  // Auth
  'auth.welcome.title': 'Falcon Rider',
  'auth.welcome.tagline': 'Drive & Share',
  'auth.welcome.login': 'Log in',
  'auth.welcome.signup': 'Create account',
  'auth.login.title': 'Welcome back',
  'auth.login.subtitle': 'Log in to continue',
  'auth.login.identifier': 'Phone or email',
  'auth.login.password': 'Password',
  'auth.login.submit': 'Log in',
  'auth.login.forgot': 'Forgot password?',
  'auth.login.noAccount': 'Create account',
  'auth.signup.title': 'Create account',
  'auth.signup.subtitle': 'Join Falcon Rider as a provider',
  'auth.signup.fullName': 'Full name',
  'auth.signup.identifier': 'Phone or email',
  'auth.signup.password': 'Password',
  'auth.signup.passwordConfirm': 'Confirm password',
  'auth.signup.submit': 'Create account',
  'auth.signup.haveAccount': 'Already have an account? Log in',
  'auth.logout': 'Log out',
  'auth.logout.confirm': 'Are you sure you want to log out?',
  // Tabs (4 tabs)
  'tabs.home': 'Home',
  'tabs.activity': 'Activity',
  'tabs.journeys': 'Journeys',
  'tabs.account': 'Account',
  // Hidden tab screens
  'tabs.trips': 'Trips',
  'tabs.earnings': 'Earnings',
  // Home
  'home.greeting': 'Hi',
  'home.offline.title': 'You are offline',
  'home.offline.description': 'What are you doing today?',
  'home.online.title': 'Available for trips',
  'home.online.description': 'You are visible to riders nearby.',
  'home.goOnline': 'Go online',
  'home.goOffline': 'Go offline',
  'home.shareJourney': 'Share a journey',
  'home.createJourney': 'Create journey',
  'home.myJourney': 'My journey',
  'home.noActivity': 'No current activity',
  // Activity
  'activity.title': 'Activity',
  'activity.requests': 'Requests',
  'activity.active': 'Active',
  'activity.upcoming': 'Upcoming',
  'activity.completed': 'Completed',
  'activity.empty': 'No activity yet',
  'activity.empty.description':
    'Your professional trips and requests will appear here.',
  // Journeys
  'journeys.title': 'Journeys',
  'journeys.empty': 'No journeys yet',
  'journeys.empty.description':
    'Share a journey you are already making and fill empty seats.',
  'journeys.create': 'Create journey',
  'journeys.active': 'Active',
  'journeys.scheduled': 'Scheduled',
  'journeys.completed': 'Completed',
  'journeys.cancelled': 'Cancelled',
  // Trips
  'trips.title': 'Trips',
  'trips.empty': 'No trips yet',
  'trips.empty.description': 'Your completed trips will appear here.',
  // Earnings
  'earnings.title': 'Earnings',
  'earnings.today': 'Today',
  'earnings.week': 'This week',
  'earnings.month': 'This month',
  'earnings.empty': 'No earnings yet',
  'earnings.empty.description': 'Complete trips to start earning.',
  // Account
  'account.title': 'Account',
  'account.profile': 'Profile',
  'account.vehicle': 'Vehicles',
  'account.documents': 'Documents',
  'account.earnings': 'Earnings & Payouts',
  'account.preferences': 'Preferences',
  'account.language': 'Language',
  'account.appearance': 'Appearance',
  'account.notifications': 'Notifications',
  'account.security': 'Security',
  'account.support': 'Support',
  'account.about': 'About',
  'account.logout': 'Log out',
  // Settings
  'settings.language.title': 'Language',
  'settings.language.english': 'English',
  'settings.language.swahili': 'Kiswahili',
  'settings.appearance.title': 'Appearance',
  'settings.appearance.system': 'System default',
  'settings.appearance.light': 'Light',
  'settings.appearance.dark': 'Dark',
};

export const SW: Translations = {
  // Common
  'common.back': 'Rudi',
  'common.cancel': 'Ghairi',
  'common.confirm': 'Thibitisha',
  'common.save': 'Hifadhi',
  'common.continue': 'Endelea',
  'common.loading': 'Inapakia…',
  'common.retry': 'Jaribu tena',
  'common.comingSoon': 'Inakuja hivi karibuni.',
  // Auth
  'auth.welcome.title': 'Falcon Rider',
  'auth.welcome.tagline': 'Endesha & Shiriki',
  'auth.welcome.login': 'Ingia',
  'auth.welcome.signup': 'Fungua akaunti',
  'auth.login.title': 'Karibu tena',
  'auth.login.subtitle': 'Ingia kuendelea',
  'auth.login.identifier': 'Simu au barua pepe',
  'auth.login.password': 'Nenosiri',
  'auth.login.submit': 'Ingia',
  'auth.login.forgot': 'Umesahau nenosiri?',
  'auth.login.noAccount': 'Fungua akaunti',
  'auth.signup.title': 'Fungua akaunti',
  'auth.signup.subtitle': 'Jiunge na Falcon Rider kama mtoa huduma',
  'auth.signup.fullName': 'Jina kamili',
  'auth.signup.identifier': 'Simu au barua pepe',
  'auth.signup.password': 'Nenosiri',
  'auth.signup.passwordConfirm': 'Thibitisha nenosiri',
  'auth.signup.submit': 'Fungua akaunti',
  'auth.signup.haveAccount': 'Una akaunti tayari? Ingia',
  'auth.logout': 'Toka',
  'auth.logout.confirm': 'Una uhakika unataka kutoka?',
  // Tabs (4 tabs)
  'tabs.home': 'Nyumbani',
  'tabs.activity': 'Shughuli',
  'tabs.journeys': 'Safari',
  'tabs.account': 'Akaunti',
  // Hidden tab screens
  'tabs.trips': 'Safari Zilizofanyika',
  'tabs.earnings': 'Mapato',
  // Home
  'home.greeting': 'Habari',
  'home.offline.title': 'Hupo mtandaoni',
  'home.offline.description': 'Unafanya nini leo?',
  'home.online.title': 'Uko tayari kwa safari',
  'home.online.description': 'Unaonekana kwa abiria karibu.',
  'home.goOnline': 'Washa mtandaoni',
  'home.goOffline': 'Zima mtandaoni',
  'home.shareJourney': 'Shiriki safari',
  'home.createJourney': 'Unda safari',
  'home.myJourney': 'Safari yangu',
  'home.noActivity': 'Hakuna shughuli kwa sasa',
  // Activity
  'activity.title': 'Shughuli',
  'activity.requests': 'Maombi',
  'activity.active': 'Inaendelea',
  'activity.upcoming': 'Yajayo',
  'activity.completed': 'Zilizokamilika',
  'activity.empty': 'Hakuna shughuli bado',
  'activity.empty.description':
    'Safari zako za kitaalamu zitaonekana hapa.',
  // Journeys
  'journeys.title': 'Safari',
  'journeys.empty': 'Hakuna safari bado',
  'journeys.empty.description':
    'Shiriki safari unayoifanya tayari na ujaze nafasi tupu.',
  'journeys.create': 'Unda safari',
  'journeys.active': 'Inaendelea',
  'journeys.scheduled': 'Imepangwa',
  'journeys.completed': 'Imekamilika',
  'journeys.cancelled': 'Imefutwa',
  // Trips
  'trips.title': 'Safari Zilizofanyika',
  'trips.empty': 'Hakuna safari bado',
  'trips.empty.description':
    'Safari zako zilizokamilika zitaonekana hapa.',
  // Earnings
  'earnings.title': 'Mapato',
  'earnings.today': 'Leo',
  'earnings.week': 'Wiki hii',
  'earnings.month': 'Mwezi huu',
  'earnings.empty': 'Hakuna mapato bado',
  'earnings.empty.description': 'Kamilisha safari ili kuanza kupata.',
  // Account
  'account.title': 'Akaunti',
  'account.profile': 'Wasifu',
  'account.vehicle': 'Magari',
  'account.documents': 'Nyaraka',
  'account.earnings': 'Mapato & Malipo',
  'account.preferences': 'Mapendeleo',
  'account.language': 'Lugha',
  'account.appearance': 'Muonekano',
  'account.notifications': 'Arifa',
  'account.security': 'Usalama',
  'account.support': 'Msaada',
  'account.about': 'Kuhusu',
  'account.logout': 'Toka',
  // Settings
  'settings.language.title': 'Lugha',
  'settings.language.english': 'English',
  'settings.language.swahili': 'Kiswahili',
  'settings.appearance.title': 'Muonekano',
  'settings.appearance.system': 'Mfumo',
  'settings.appearance.light': 'Nuru',
  'settings.appearance.dark': 'Giza',
};

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  en: EN,
  sw: SW,
};