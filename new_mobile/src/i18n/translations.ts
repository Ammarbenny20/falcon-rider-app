// src/i18n/translations.ts

import type { AppLanguage } from '@/store/preferences.store';

export type TranslationKey =
  | 'home.greeting.morning'
  | 'home.greeting.afternoon'
  | 'home.greeting.evening'
  | 'home.greeting.night'
  | 'home.greeting.generic'
  | 'home.search.placeholder'
  | 'home.saved.title'
  | 'home.saved.addPlace'
  | 'home.saved.add'
  | 'home.saved.home'
  | 'home.saved.work'
  | 'home.recent.title'
  | 'search.title'
  | 'search.placeholder'
  | 'search.recents'
  | 'search.results'
  | 'search.noResults'
  | 'search.noResultsHint'
  | 'search.startTyping'
  | 'search.error.title'
  | 'search.error.hint'
  | 'plan.title'
  | 'plan.pickup'
  | 'plan.pickup.finding'
  | 'plan.pickup.notSet'
  | 'plan.pickup.retry'
  | 'plan.destination'
  | 'plan.destination.notSelected'
  | 'plan.destination.select'
  | 'plan.destination.change'
  | 'plan.when'
  | 'plan.when.now'
  | 'plan.when.book'
  | 'plan.when.date'
  | 'plan.when.time'
  | 'plan.when.selectDate'
  | 'plan.when.selectTime'
  | 'plan.when.futureTimeRequired'
  | 'plan.rideType'
  | 'plan.rideType.private'
  | 'plan.rideType.private.description'
  | 'plan.rideType.shared'
  | 'plan.rideType.shared.description'
  | 'plan.passengers'
  | 'plan.continue'
  | 'options.title'
  | 'options.badge.shared'
  | 'options.badge.private'
  | 'options.seatsAvailable'
  | 'options.driverEta'
  | 'options.tripDuration'
  | 'options.selected'
  | 'options.passenger'
  | 'options.passengers'
  | 'options.mockNote'
  | 'options.review'
  | 'review.title'
  | 'review.when'
  | 'review.ride'
  | 'review.passengers'
  | 'review.availableSeats'
  | 'review.estimatedFare'
  | 'review.driverArrival'
  | 'review.tripDuration'
  | 'review.mockNote'
  | 'review.submit.now'
  | 'review.submit.scheduled'
  | 'review.missingInfo'
  | 'review.backHome'
  | 'matching.searching.title'
  | 'matching.searching.description'
  | 'matching.matched.title'
  | 'matching.matched.description'
  | 'matching.noMatch.title'
  | 'matching.noMatch.description'
  | 'matching.cancelled.title'
  | 'matching.cancelled.description'
  | 'matching.status'
  | 'matching.cancel'
  | 'matching.changeTrip'
  | 'matching.error'
  | 'account.preferences'
  | 'account.language'
  | 'account.appearance'
  | 'account.notifications'
  | 'account.security'
  | 'account.savedPlaces'
  | 'account.support'
  | 'account.about'
  | 'account.logout'
  | 'account.logout.confirmTitle'
  | 'account.logout.confirmMessage'
  | 'account.logout.confirmCancel'
  | 'account.logout.confirmAction'
  | 'settings.language.title'
  | 'settings.language.english'
  | 'settings.language.swahili'
  | 'settings.appearance.title'
  | 'settings.appearance.system'
  | 'settings.appearance.light'
  | 'settings.appearance.dark'
  | 'settings.notifications.title'
  | 'settings.security.title'
  | 'settings.savedPlaces.title'
  | 'settings.support.title'
  | 'settings.about.title'
  | 'settings.comingSoon'
  | 'common.back'
  | 'common.cancel'
  | 'common.confirm'
  | 'common.save'
  | 'common.continue';

type Translations = Record<TranslationKey, string>;

export const EN: Translations = {
  'home.greeting.morning': 'Good morning',
  'home.greeting.afternoon': 'Good afternoon',
  'home.greeting.evening': 'Good evening',
  'home.greeting.night': 'Good evening',
  'home.greeting.generic': 'Hi',
  'home.search.placeholder': 'Where are you going?',
  'home.saved.title': 'Saved places',
  'home.saved.addPlace': 'Add a place',
  'home.saved.add': 'Add',
  'home.saved.home': 'Home',
  'home.saved.work': 'Work',
  'home.recent.title': 'Recent',

  'search.title': 'Where are you going?',
  'search.placeholder': 'Search destination',
  'search.recents': 'Recent',
  'search.results': 'Results',
  'search.noResults': 'No places found.',
  'search.noResultsHint': 'Try a different name or nearby landmark.',
  'search.startTyping': 'Start typing to search destinations.',
  'search.error.title': "Couldn't load destinations.",
  'search.error.hint': 'Check your connection and try again.',

  'plan.title': 'Plan your ride',
  'plan.pickup': 'Pickup',
  'plan.pickup.finding': 'Finding your location…',
  'plan.pickup.notSet': 'Not set',
  'plan.pickup.retry': 'Retry',
  'plan.destination': 'Destination',
  'plan.destination.notSelected': 'Not selected',
  'plan.destination.select': 'Select',
  'plan.destination.change': 'Change',
  'plan.when': 'When',
  'plan.when.now': 'Now',
  'plan.when.book': 'Book for later',
  'plan.when.date': 'Date',
  'plan.when.time': 'Time',
  'plan.when.selectDate': 'Select date',
  'plan.when.selectTime': 'Select time',
  'plan.when.futureTimeRequired': 'Please choose a future time.',
  'plan.rideType': 'Ride type',
  'plan.rideType.private': 'Private',
  'plan.rideType.private.description': 'Just you and your group',
  'plan.rideType.shared': 'Shared',
  'plan.rideType.shared.description':
    'Share available capacity with other riders',
  'plan.passengers': 'Passengers',
  'plan.continue': 'Continue',

  'options.title': 'Choose your ride',
  'options.badge.shared': 'Shared',
  'options.badge.private': 'Private',
  'options.seatsAvailable': 'seats available',
  'options.driverEta': 'Driver ETA',
  'options.tripDuration': 'Trip',
  'options.selected': 'Selected',
  'options.passenger': 'passenger',
  'options.passengers': 'passengers',
  'options.mockNote':
    'Live availability is mocked for now. Real-time updates arrive in Phase 3.',
  'options.review': 'Review',

  'review.title': 'Review your ride',
  'review.when': 'When',
  'review.ride': 'Ride',
  'review.passengers': 'Passengers',
  'review.availableSeats': 'Available seats',
  'review.estimatedFare': 'Estimated fare',
  'review.driverArrival': 'Driver arrival',
  'review.tripDuration': 'Trip duration',
  'review.mockNote':
    'Fare and timing are placeholders until the backend provides them.',
  'review.submit.now': 'Request ride',
  'review.submit.scheduled': 'Book ride',
  'review.missingInfo': 'Missing trip information. Please start again.',
  'review.backHome': 'Back to home',

  'matching.searching.title': 'Finding your ride',
  'matching.searching.description':
    'Searching for available drivers nearby…',
  'matching.matched.title': 'Driver found',
  'matching.matched.description':
    'A driver is on the way to your pickup point.',
  'matching.noMatch.title': 'No ride found',
  'matching.noMatch.description':
    "We couldn't find a ride right now. Try adjusting your trip.",
  'matching.cancelled.title': 'Request cancelled',
  'matching.cancelled.description': 'This ride request was cancelled.',
  'matching.status': 'Status',
  'matching.cancel': 'Cancel request',
  'matching.changeTrip': 'Change trip',
  'matching.error': 'Could not load request',

  'account.preferences': 'Preferences',
  'account.language': 'Language',
  'account.appearance': 'Appearance',
  'account.notifications': 'Notifications',
  'account.security': 'Security',
  'account.savedPlaces': 'Saved places',
  'account.support': 'Support',
  'account.about': 'About Falcon Rider',
  'account.logout': 'Log out',
  'account.logout.confirmTitle': 'Log out',
  'account.logout.confirmMessage':
    'Are you sure you want to log out of Falcon Rider?',
  'account.logout.confirmCancel': 'Cancel',
  'account.logout.confirmAction': 'Log out',

  'settings.language.title': 'Language',
  'settings.language.english': 'English',
  'settings.language.swahili': 'Kiswahili',
  'settings.appearance.title': 'Appearance',
  'settings.appearance.system': 'System default',
  'settings.appearance.light': 'Light',
  'settings.appearance.dark': 'Dark',
  'settings.notifications.title': 'Notifications',
  'settings.security.title': 'Security',
  'settings.savedPlaces.title': 'Saved places',
  'settings.support.title': 'Help & support',
  'settings.about.title': 'About Falcon Rider',
  'settings.comingSoon': 'Coming soon.',

  'common.back': 'Back',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.save': 'Save',
  'common.continue': 'Continue',
};

export const SW: Translations = {
  'home.greeting.morning': 'Habari ya asubuhi',
  'home.greeting.afternoon': 'Habari ya mchana',
  'home.greeting.evening': 'Habari ya jioni',
  'home.greeting.night': 'Habari ya jioni',
  'home.greeting.generic': 'Habari',
  'home.search.placeholder': 'Unaenda wapi?',
  'home.saved.title': 'Maeneo yaliyohifadhiwa',
  'home.saved.addPlace': 'Ongeza eneo',
  'home.saved.add': 'Ongeza',
  'home.saved.home': 'Nyumbani',
  'home.saved.work': 'Kazini',
  'home.recent.title': 'Hivi karibuni',

  'search.title': 'Unaenda wapi?',
  'search.placeholder': 'Tafuta mahali',
  'search.recents': 'Hivi karibuni',
  'search.results': 'Matokeo',
  'search.noResults': 'Hakuna mahali palipopatikana.',
  'search.noResultsHint': 'Jaribu jina lingine au alama ya karibu.',
  'search.startTyping': 'Anza kuandika kutafuta.',
  'search.error.title': 'Imeshindwa kupakua maeneo.',
  'search.error.hint': 'Angalia muunganisho wako na ujaribu tena.',

  'plan.title': 'Panga safari yako',
  'plan.pickup': 'Kuchukua',
  'plan.pickup.finding': 'Inatafuta eneo lako…',
  'plan.pickup.notSet': 'Haijawekwa',
  'plan.pickup.retry': 'Jaribu tena',
  'plan.destination': 'Unakoenda',
  'plan.destination.notSelected': 'Hakijachaguliwa',
  'plan.destination.select': 'Chagua',
  'plan.destination.change': 'Badilisha',
  'plan.when': 'Lini',
  'plan.when.now': 'Sasa',
  'plan.when.book': 'Weka kwa baadaye',
  'plan.when.date': 'Tarehe',
  'plan.when.time': 'Muda',
  'plan.when.selectDate': 'Chagua tarehe',
  'plan.when.selectTime': 'Chagua muda',
  'plan.when.futureTimeRequired': 'Tafadhali chagua muda ujao.',
  'plan.rideType': 'Aina ya safari',
  'plan.rideType.private': 'Binafsi',
  'plan.rideType.private.description': 'Wewe na kundi lako tu',
  'plan.rideType.shared': 'Shirikishi',
  'plan.rideType.shared.description':
    'Shiriki nafasi na abiria wengine',
  'plan.passengers': 'Abiria',
  'plan.continue': 'Endelea',

  'options.title': 'Chagua safari yako',
  'options.badge.shared': 'Shirikishi',
  'options.badge.private': 'Binafsi',
  'options.seatsAvailable': 'nafasi zilizopo',
  'options.driverEta': 'Dereva anafika',
  'options.tripDuration': 'Safari',
  'options.selected': 'Imechaguliwa',
  'options.passenger': 'abiria',
  'options.passengers': 'abiria',
  'options.mockNote':
    'Upatikanaji wa moja kwa moja ni wa majaribio kwa sasa.',
  'options.review': 'Angalia',

  'review.title': 'Angalia safari yako',
  'review.when': 'Lini',
  'review.ride': 'Safari',
  'review.passengers': 'Abiria',
  'review.availableSeats': 'Nafasi zilizopo',
  'review.estimatedFare': 'Bei ya makadirio',
  'review.driverArrival': 'Dereva anafika',
  'review.tripDuration': 'Muda wa safari',
  'review.mockNote': 'Bei na muda ni ya majaribio.',
  'review.submit.now': 'Omba safari',
  'review.submit.scheduled': 'Weka safari',
  'review.missingInfo': 'Taarifa za safari hazijakamilika.',
  'review.backHome': 'Rudi nyumbani',

  'matching.searching.title': 'Inatafuta safari yako',
  'matching.searching.description': 'Inatafuta madereva karibu…',
  'matching.matched.title': 'Dereva amepatikana',
  'matching.matched.description': 'Dereva anakuja kwenye eneo lako.',
  'matching.noMatch.title': 'Hakuna safari iliyopatikana',
  'matching.noMatch.description':
    'Hatuwezi kupata safari kwa sasa. Jaribu kubadilisha.',
  'matching.cancelled.title': 'Ombi limefutwa',
  'matching.cancelled.description': 'Ombi hili la safari limefutwa.',
  'matching.status': 'Hali',
  'matching.cancel': 'Futa ombi',
  'matching.changeTrip': 'Badilisha safari',
  'matching.error': 'Imeshindwa kupakua ombi',

  'account.preferences': 'Mapendeleo',
  'account.language': 'Lugha',
  'account.appearance': 'Muonekano',
  'account.notifications': 'Arifa',
  'account.security': 'Usalama',
  'account.savedPlaces': 'Maeneo yaliyohifadhiwa',
  'account.support': 'Msaada',
  'account.about': 'Kuhusu Falcon Rider',
  'account.logout': 'Toka',
  'account.logout.confirmTitle': 'Toka',
  'account.logout.confirmMessage': 'Una uhakika unataka kutoka Falcon Rider?',
  'account.logout.confirmCancel': 'Ghairi',
  'account.logout.confirmAction': 'Toka',

  'settings.language.title': 'Lugha',
  'settings.language.english': 'English',
  'settings.language.swahili': 'Kiswahili',
  'settings.appearance.title': 'Muonekano',
  'settings.appearance.system': 'Mfumo',
  'settings.appearance.light': 'Nuru',
  'settings.appearance.dark': 'Giza',
  'settings.notifications.title': 'Arifa',
  'settings.security.title': 'Usalama',
  'settings.savedPlaces.title': 'Maeneo yaliyohifadhiwa',
  'settings.support.title': 'Msaada',
  'settings.about.title': 'Kuhusu Falcon Rider',
  'settings.comingSoon': 'Inakuja hivi karibuni.',

  'common.back': 'Rudi',
  'common.cancel': 'Ghairi',
  'common.confirm': 'Thibitisha',
  'common.save': 'Hifadhi',
  'common.continue': 'Endelea',
};

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  en: EN,
  sw: SW,
};