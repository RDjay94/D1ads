/* BIGTAKA FREE-PLAY — i18n (Bengali default, English toggle) */
/* Strings keyed by their English source. Bengali = primary, English = fallback. */

(function () {
  const LANG_KEY = 'bigtaka_freeplay_lang_v1';
  const DEFAULT_LANG = 'bn';

  // English → Bengali map.
  // Brand names (Bigtaka, Pragmatic Play, Evolution Gaming, Aviator, etc.),
  // numbers, currency labels (FUN, taka), and game IDs stay as-is.
  const BN = {
    // ============ NAV ============
    'Home': 'হোম',
    'All Games': 'সব গেম',
    'Learning': 'শিক্ষা',
    'Learning Hub': 'শিক্ষা কেন্দ্র',
    'Learning Hub (3 articles daily)': 'শিক্ষা কেন্দ্র (দৈনিক ৩টি আর্টিকেল)',
    'How It Works': 'কীভাবে কাজ করে',
    'About': 'সম্পর্কে',
    'Log In': 'লগ ইন',
    'Sign Up': 'সাইন আপ',
    'Balance': 'ব্যালেন্স',
    'Toggle sounds': 'সাউন্ড টগল',
    'Mute sounds': 'সাউন্ড বন্ধ',
    'Unmute sounds': 'সাউন্ড চালু',
    'Reset balance': 'ব্যালেন্স রিসেট',
    'Menu': 'মেনু',
    'Your level & XP': 'আপনার লেভেল এবং XP',
    'English': 'ইংরেজি',
    'Bengali': 'বাংলা',
    'বাংলা': 'বাংলা',
    'EN': 'EN',
    'BN': 'বাং',

    // ============ LOADER ============
    'Loading the city of luxury…': 'বিলাসিতার শহর লোড হচ্ছে…',
    'Bigtaka Free Play': 'বিগটাকা ফ্রি প্লে',

    // ============ HERO ============
    '100% Free • Practice Mode • Educational': '১০০% ফ্রি • Practice Mode • শিক্ষামূলক',
    'Learn to Play.': 'খেলা শিখুন।',
    'Win Bigger': 'বড় জিতুন',
    ' Later.': ' পরে।',
    'Later.': 'পরে।',
    'Practice every casino game in the book — slots, live tables, Aviator, sports — with free FUN coins. Master the rules, build a strategy, and play like a pro. ':
      'বইয়ের প্রতিটি ক্যাসিনো গেম অনুশীলন করুন — স্লট, লাইভ টেবিল, Aviator, খেলাধুলা — ফ্রি FUN কয়েন দিয়ে। নিয়ম শিখুন, কৌশল গড়ুন, এবং প্রো-এর মতো খেলুন। ',
    'Zero risk.': 'কোনো ঝুঁকি নেই।',
    '▶ Play Free': '▶ ফ্রি খেলুন',
    '3000+ games': '৩০০০+ গেম',
    ' · live tables, slots, crash, sports — all free to practice': ' · লাইভ টেবিল, স্লট, ক্র্যাশ, খেলাধুলা — সব ফ্রি অনুশীলন',
    'FUN coin': 'FUN কয়েন',

    // ============ HOW IT WORKS ============
    '3 Steps. ': '৩ ধাপ। ',
    '3 Steps.': '৩ ধাপ।',
    'No catch.': 'কোনো শর্ত নেই।',
    'No sign-up. No deposit. Just open a game, place a FUN bet, and learn.':
      'কোনো সাইন-আপ নেই। কোনো ডিপোজিট নেই। শুধু একটি গেম খুলুন, FUN বাজি ধরুন, এবং শিখুন।',
    'Get 10,000 FUN Coins': '১০,০০০ FUN কয়েন পান',
    "Every visitor starts with 10,000 free FUN coins. Burn through them? Hit reset — they're not real currency, they're for learning.":
      'প্রতিটি ভিজিটর ১০,০০০ ফ্রি FUN কয়েন দিয়ে শুরু করে। শেষ হয়ে গেছে? রিসেট করুন — এগুলো real currency নয়, শেখার জন্য।',
    'Pick a Game': 'একটি গেম বাছুন',
    'Browse 60+ titles from real industry providers — Pragmatic Play, Evolution, Spribe, JILI. Tap "How to Play" to read the rules before you bet.':
      'বাস্তব ইন্ডাস্ট্রি প্রোভাইডার থেকে ৬০+ টাইটেল ব্রাউজ করুন — Pragmatic Play, Evolution, Spribe, JILI। বাজি ধরার আগে নিয়ম পড়তে "কীভাবে খেলবেন" ট্যাপ করুন।',
    'Master the Strategy': 'কৌশল আয়ত্ত করুন',
    'Every game includes a strategy tip card. Try the actual gameplay, study your wins and losses, build instinct — all risk-free.':
      'প্রতিটি গেমে একটি কৌশল টিপ কার্ড থাকে। আসল গেমপ্লে চেষ্টা করুন, আপনার জয় এবং পরাজয় অধ্যয়ন করুন, প্রবৃত্তি গড়ুন — সবকিছু ঝুঁকিমুক্ত।',

    // ============ CATEGORIES ============
    'Browse by ': 'ব্রাউজ করুন ',
    'Browse by': 'ব্রাউজ করুন',
    'Category': 'বিভাগ',
    '5 game categories, 60 unique titles. Each one teaches a different skill.':
      '৫টি গেম বিভাগ, ৬০টি অনন্য টাইটেল। প্রতিটি একটি আলাদা দক্ষতা শেখায়।',
    'Slots': 'স্লট',
    'Live Casino': 'লাইভ ক্যাসিনো',
    'Aviator & Crash': 'Aviator এবং ক্র্যাশ',
    'Fast Games': 'ফাস্ট গেম',
    'Sports': 'খেলাধুলা',
    '25 free titles · Reels & cascades': '২৫টি ফ্রি টাইটেল · রিল এবং ক্যাসকেড',
    '22 free titles · Tables & wheels': '২২টি ফ্রি টাইটেল · টেবিল এবং চাকা',
    '10 free titles · Cash out in time': '১০টি ফ্রি টাইটেল · সময়মতো ক্যাশআউট',
    '5 free titles · Mines, Plinko, Dice': '৫টি ফ্রি টাইটেল · মাইনস, প্লিনকো, ডাইস',
    '10 free titles · Cricket, soccer, NBA': '১০টি ফ্রি টাইটেল · ক্রিকেট, ফুটবল, NBA',

    // ============ MISSIONS ============
    'Daily ': 'দৈনিক ',
    'Daily': 'দৈনিক',
    'Missions': 'মিশন',
    'Complete 3 missions every day to earn bonus FUN coins. Refreshes at midnight.':
      'বোনাস FUN কয়েন উপার্জন করতে প্রতিদিন ৩টি মিশন সম্পূর্ণ করুন। মধ্যরাতে রিফ্রেশ হয়।',
    'Play 5 rounds in any game': 'যেকোনো গেমে ৫ রাউন্ড খেলুন',
    'Play 10 rounds in any game': 'যেকোনো গেমে ১০ রাউন্ড খেলুন',
    'Cash out at 2×+ in a crash game': 'একটি ক্র্যাশ গেমে ২× বা তার বেশি ক্যাশ আউট করুন',
    'Cash out at 2×+ three times': 'তিনবার ২× বা তার বেশি ক্যাশ আউট করুন',
    'Win on any sports game': 'যেকোনো খেলাধুলার গেমে জিতুন',
    'COMPLETE': 'সম্পূর্ণ',
    'Claim': 'দাবি করুন',
    'Claimed': 'দাবি করা হয়েছে',

    // ============ HOT NOW ============
    '🔥 Hot ': '🔥 হট ',
    '🔥 Hot': '🔥 হট',
    'Right Now': 'এখনই',
    'The most popular games on the platform — start here.': 'প্ল্যাটফর্মের সবচেয়ে জনপ্রিয় গেমগুলো — এখান থেকে শুরু করুন।',

    // ============ RECENTLY PLAYED ============
    '⏱ Recently ': '⏱ সম্প্রতি ',
    '⏱ Recently': '⏱ সম্প্রতি',
    'Played': 'খেলা হয়েছে',
    'Jump right back in where you left off.': 'যেখানে ছেড়েছিলেন সেখানেই ফিরে যান।',

    // ============ GAME LIBRARY ============
    'Game ': 'গেম ',
    'Game': 'গেম',
    'Library': 'লাইব্রেরি',
    "Every famous title from the world's top game providers — playable free.":
      'বিশ্বের শীর্ষ গেম প্রোভাইডারদের প্রতিটি বিখ্যাত টাইটেল — ফ্রি খেলার যোগ্য।',
    '72 games': '৭২টি গেম',
    'Search games or providers…': 'গেম বা প্রোভাইডার সার্চ করুন…',
    'All 72': 'সব ৭২',
    '🎰 Slots': '🎰 স্লট',
    '♠️ Live Casino': '♠️ লাইভ ক্যাসিনো',
    '🚀 Aviator': '🚀 Aviator',
    '⚡ Fast Games': '⚡ ফাস্ট গেম',
    '🏏 Sports': '🏏 খেলাধুলা',
    'No games found. Try another search.': 'কোনো গেম পাওয়া যায়নি। অন্য সার্চ চেষ্টা করুন।',
    'PLAY DEMO': 'ডেমো খেলুন',
    'HOW TO PLAY': 'কীভাবে খেলবেন',
    '🔥 HOT': '🔥 হট',
    '✨ NEW': '✨ নতুন',
    '▶ Try Demo': '▶ ডেমো চেষ্টা করুন',
    '📘 How to Play': '📘 কীভাবে খেলবেন',
    '💎 JACKPOT': '💎 জ্যাকপট',

    // ============ ABOUT / FEATURES ============
    'Built for ': 'তৈরি ',
    'Built for': 'তৈরি',
    'Real Learning': 'প্রকৃত শিক্ষার জন্য',
    'Every Bigtaka Free Play feature is designed to teach — not just entertain.':
      'প্রতিটি Bigtaka Free Play ফিচার শেখানোর জন্য ডিজাইন করা — শুধু বিনোদনের জন্য নয়।',
    '100% Free': '১০০% ফ্রি',
    'No deposits, no withdrawals, no payment forms. Ever. Pure practice.':
      'কোনো ডিপোজিট নেই, কোনো উত্তোলন নেই, কোনো পেমেন্ট ফর্ম নেই। কখনও না। শুধু অনুশীলন।',
    'Real Rules': 'প্রকৃত নিয়ম',
    'RTPs, paylines, and bonus features match the real games at industry providers.':
      'RTP, পেলাইন, এবং বোনাস ফিচার ইন্ডাস্ট্রি প্রোভাইডারের আসল গেমের সাথে মেলে।',
    'Strategy Cards': 'কৌশল কার্ড',
    'Every game has expert strategy tips. Learn what works before you play for real.':
      'প্রতিটি গেমে এক্সপার্ট কৌশল টিপস আছে। আসলভাবে খেলার আগে কী কাজ করে শিখুন।',
    'Instant Play': 'তাৎক্ষণিক খেলা',
    'No app to download. Open the page, pick a game, start playing in seconds.':
      'কোনো অ্যাপ ডাউনলোড নেই। পৃষ্ঠা খুলুন, একটি গেম বাছুন, সেকেন্ডে খেলা শুরু করুন।',
    'Mobile First': 'মোবাইল প্রথম',
    'Designed for phones first. Practice on the bus, the bench, anywhere.':
      'প্রথমে ফোনের জন্য ডিজাইন করা। বাসে, বেঞ্চে, যেকোনো জায়গায় অনুশীলন করুন।',

    // ============ ACHIEVEMENTS ============
    '🏆 Achievement ': '🏆 অর্জন ',
    '🏆 Achievement': '🏆 অর্জন',
    'Badges': 'ব্যাজ',
    'Unlock badges by playing — each one comes with a 500 FUN bonus.':
      'খেলার মাধ্যমে ব্যাজ আনলক করুন — প্রতিটির সাথে ৫০০ FUN বোনাস আসে।',
    'First Win': 'প্রথম জয়',
    'Win your first game': 'আপনার প্রথম গেম জিতুন',
    'Big Spender': 'বড় খরচকারী',
    'Place a single bet of 1,000+ FUN': '১,০০০+ FUN-এর একটি একক বাজি ধরুন',
    'Lucky Streak': 'ভাগ্যবান স্ট্রিক',
    'Win 3 games in a row': 'পরপর ৩টি গেম জিতুন',
    'Aviator Ace': 'Aviator এস',
    'Cash out at 5×+ in any crash game': 'যেকোনো ক্র্যাশ গেমে ৫× বা তার বেশি ক্যাশ আউট করুন',
    'Slot Master': 'স্লট মাস্টার',
    'Play 5 different slots': '৫টি ভিন্ন স্লট খেলুন',
    'Sports Champion': 'স্পোর্টস চ্যাম্পিয়ন',
    'Win on cricket, soccer & NBA': 'ক্রিকেট, ফুটবল এবং NBA-তে জিতুন',
    'VIP Status': 'VIP স্ট্যাটাস',
    'Reach level 5': 'লেভেল ৫-এ পৌঁছান',
    'Jackpot King': 'জ্যাকপট কিং',
    'Hit a 50×+ multiplier': '৫০× বা তার বেশি গুণক হিট করুন',
    'Week Warrior': 'সপ্তাহের যোদ্ধা',
    'Log in 7 days in a row': 'পরপর ৭ দিন লগ ইন করুন',
    'LOCKED': 'লক করা',
    'UNLOCKED': 'আনলক করা হয়েছে',

    // ============ FOOTER ============
    'A free educational platform to learn casino and sports game mechanics. We exist to teach — not to take your money.':
      'ক্যাসিনো এবং খেলাধুলার গেম মেকানিক্স শেখার জন্য একটি ফ্রি শিক্ষামূলক প্ল্যাটফর্ম। আমরা শেখানোর জন্য আছি — আপনার টাকা নেওয়ার জন্য নয়।',
    'Categories': 'বিভাগসমূহ',
    'Learn': 'শিখুন',
    'Browse Games': 'গেম ব্রাউজ করুন',
    'About Free Play': 'Free Play সম্পর্কে',
    'Play Aviator': 'Aviator খেলুন',
    'Play Mines': 'Mines খেলুন',
    'Responsible': 'দায়িত্বশীল',
    'Free play guidelines': 'ফ্রি প্লে নির্দেশিকা',
    'Educational use only': 'শুধুমাত্র শিক্ষামূলক ব্যবহার',
    'Free practice only': 'শুধু ফ্রি practice',
    'Contact us': 'যোগাযোগ করুন',
    '⚠ Free play only.': '⚠ শুধু ফ্রি প্লে।',
    ' Bigtaka Free Play uses virtual FUN coins with no monetary value. No real currency is wagered, won, or paid out. For ages 18+. This is an educational learning environment.':
      ' Bigtaka Free Play কোনো আর্থিক মূল্য ছাড়াই ভার্চুয়াল FUN কয়েন ব্যবহার করে। কোনো আসল মুদ্রা বাজি ধরা, জিতা বা প্রদান করা হয় না। ১৮+ বয়সের জন্য। এটি একটি শিক্ষামূলক শেখার পরিবেশ।',
    '© 2026 Bigtaka. All rights reserved.': '© ২০২৬ Bigtaka। সর্বস্বত্ব সংরক্ষিত।',

    // ============ DAILY LOGIN MODAL ============
    'Daily Login Bonus!': 'দৈনিক লগইন বোনাস!',
    'Lucky Boss says welcome back, boss!': 'লাকি বস বলছে স্বাগতম, বস!',
    'Claim & Play': 'দাবি এবং খেলুন',
    'Login streak:': 'লগইন স্ট্রিক:',
    'day': 'দিন',
    'days': 'দিন',

    // ============ MODAL — HOW TO PLAY ============
    'RTP': 'RTP',
    'Volatility': 'ভোলাটিলিটি',
    'Max Win': 'সর্বোচ্চ জয়',
    'Min Bet': 'সর্বনিম্ন বাজি',
    'How to play': 'কীভাবে খেলবেন',
    'Rules': 'নিয়ম',
    'Strategy': 'কৌশল',
    'Close': 'বন্ধ',
    'Provider': 'প্রোভাইডার',
    'Provider:': 'প্রোভাইডার:',
    'Try the Demo': 'ডেমো চেষ্টা করুন',
    '▶ Try Free Demo': '▶ ফ্রি ডেমো চেষ্টা করুন',
    'How It Works': 'কীভাবে কাজ করে',
    'Rules & Features': 'নিয়ম এবং বৈশিষ্ট্য',
    'Game Info': 'গেম তথ্য',
    '💡 Strategy tip:': '💡 কৌশল টিপ:',
    'Lucky Boss': 'লাকি বস',
    'Search': 'সার্চ',
    'Search games or providers...': 'গেম বা প্রোভাইডার সার্চ করুন...',

    // ============ COMMON BUTTONS / GAME UI ============
    'Bet': 'বাজি',
    'Place Bet': 'বাজি ধরুন',
    'Cash Out': 'ক্যাশ আউট',
    'Cashout': 'ক্যাশআউট',
    'Spin': 'স্পিন',
    'Spin!': 'স্পিন!',
    'Deal': 'ডিল',
    'Hit': 'হিট',
    'Stand': 'স্ট্যান্ড',
    'Double': 'ডাবল',
    'Split': 'স্প্লিট',
    'Fold': 'ফোল্ড',
    'Play': 'খেলুন',
    'Play Again': 'আবার খেলুন',
    'New Game': 'নতুন গেম',
    'Reset': 'রিসেট',
    'Win': 'জয়',
    'Loss': 'পরাজয়',
    'Tie': 'ড্র',
    'Push': 'পুশ',
    'Auto': 'অটো',
    'Manual': 'ম্যানুয়াল',
    'Start': 'শুরু',
    'Stop': 'বন্ধ',
    'Continue': 'চালিয়ে যান',
    'Back': 'ফিরে যান',
    'Next': 'পরবর্তী',
    'Crash!': 'ক্র্যাশ!',
    'You won': 'আপনি জিতেছেন',
    'You lost': 'আপনি হেরেছেন',
    'Multiplier': 'গুণক',
    'Round': 'রাউন্ড',
    'History': 'ইতিহাস',
    'Last round': 'শেষ রাউন্ড',
    'Wager': 'বাজি',
    'Payout': 'পেআউট',

    // ============ HOSTESS / MASCOT ============
    'Choose Your Hostess': 'আপনার হোস্টেস বাছুন',
    'Pick a Mascot': 'একটি মাস্কট বাছুন',
    'Mascot': 'মাস্কট',
    'Hostess': 'হোস্টেস',
    'Elegant VIP': 'মার্জিত VIP',
    'Classic Hostess': 'ক্লাসিক হোস্টেস',
    'Game Show Host': 'গেম শো হোস্ট',
    'Mystic Fortune': 'রহস্যময় ভাগ্য',
    'High Voltage': 'হাই ভোল্টেজ',

    // ============ BONUSES ============
    '100% Welcome Slot Bonus': '১০০% স্বাগতম স্লট বোনাস',
    '100 Free Spins': '১০০টি ফ্রি স্পিন',
    '30% MegaCashback': '৩০% মেগা ক্যাশব্যাক',
    'Weekly Bonus Pool': 'সাপ্তাহিক বোনাস পুল',
    'Exclusive VIP Rebate': 'এক্সক্লুসিভ VIP রিবেট',
    'Live Casino Unlimited Bonus': 'লাইভ ক্যাসিনো আনলিমিটেড বোনাস',
    'BEST DEAL': 'সেরা ডিল',
    'POPULAR': 'জনপ্রিয়',
    'MEGA': 'মেগা',
    'HUGE': 'বিশাল',
    'EXCLUSIVE': 'এক্সক্লুসিভ',
    'NEW': 'নতুন',

    // ============ COIN BURST / NOTIFICATIONS ============
    'Level Up!': 'লেভেল আপ!',
    'Achievement Unlocked!': 'অর্জন আনলক করা হয়েছে!',
    'Mission Complete!': 'মিশন সম্পূর্ণ!',
    'Bonus FUN coins earned': 'বোনাস FUN কয়েন উপার্জিত',
    'Big Win!': 'বড় জয়!',
    'Jackpot!': 'জ্যাকপট!',
    'Mega Win!': 'মেগা জয়!',

    // ============ SIGNUP MODAL ============
    'Welcome to': 'স্বাগতম',
    'Bigtaka': 'বিগটাকা',
    'What should we call you, boss?': 'আপনাকে কী বলে ডাকব, বস?',
    'Your name': 'আপনার নাম',
    'Please enter your name': 'অনুগ্রহ করে আপনার নাম লিখুন',
    'Continue →': 'এগিয়ে যান →',
    'Pick your': 'আপনার বাছাই',
    'favorites': 'প্রিয়',
    "What games are you most excited to try?": 'কোন গেমগুলো খেলতে আপনি সবচেয়ে বেশি আগ্রহী?',
    "Select any — we'll personalize your hub.": 'যেকোনো বাছুন — আমরা আপনার হাব ব্যক্তিগতকৃত করব।',
    '🎰 Slots': '🎰 স্লট',
    '♠️ Live Casino': '♠️ লাইভ ক্যাসিনো',
    '🚀 Aviator': '🚀 Aviator',
    '⚡ Fast Games': '⚡ ফাস্ট গেম',
    '🏏 Sports (Cricket · Soccer · NBA)': '🏏 খেলাধুলা (ক্রিকেট · ফুটবল · NBA)',
    '← Back': '← ফিরে যান',
    "You're": 'আপনি',
    'ready': 'প্রস্তুত',
    'boss': 'বস',
    '10,000 FUN coins are loaded up. Pick how you want to play.': '১০,০০০ FUN কয়েন লোড করা হয়েছে। কীভাবে খেলতে চান বেছে নিন।',
    'Claim Welcome Bonus': 'স্বাগতম বোনাস দাবি করুন',
    'Bigger prizes, daily rewards & VIP perks': 'বড় পুরস্কার, দৈনিক রিওয়ার্ড এবং VIP সুবিধা',
    'Play Free First': 'প্রথমে ফ্রি খেলুন',
    'Practice with FUN coins': 'FUN কয়েন দিয়ে অনুশীলন করুন',
    'Verifying region…': 'অঞ্চল যাচাই করা হচ্ছে…',
    'Welcome Bonus is available to selected region only.': 'স্বাগতম বোনাস শুধুমাত্র নির্বাচিত অঞ্চলে উপলব্ধ।',
    'Our bonuses currently launch in available country. You can still keep playing FUN coins here for free.': 'আমাদের বোনাস বর্তমানে উপলব্ধ দেশে চালু আছে। আপনি এখানে FUN কয়েন দিয়ে ফ্রি খেলা চালিয়ে যেতে পারেন।',
    'Welcome to Bigtaka,': 'বিগটাকায় স্বাগতম,',

    // ============ GAME PAGE COMMON ============
    '← Back to all games': '← সব গেমে ফিরে যান',
    'Place a bet. Cash out before the plane flies away.': 'বাজি ধরুন। বিমান উড়ে যাওয়ার আগে ক্যাশ আউট করুন।',
    'Place a bet. Pick gems. Avoid mines. Cash out anytime.': 'বাজি ধরুন। রত্ন বাছুন। মাইন এড়ান। যেকোনো সময় ক্যাশ আউট করুন।',
    'Predict if the next number is higher or lower.': 'পরবর্তী সংখ্যা বেশি না কম তা অনুমান করুন।',
    'Set your target. Roll the dice. Win if your roll is on the right side.': 'আপনার টার্গেট সেট করুন। ডাইস রোল করুন। আপনার রোল সঠিক দিকে হলে জিতুন।',
    'Drop the ball through the pegs. Land in the highest-multiplier bucket.': 'বল পেগের মধ্য দিয়ে ফেলুন। সর্বোচ্চ গুণক বাকেটে অবতরণ করুন।',
    'Spin the reels. Match symbols. Trigger bonuses.': 'রিল ঘুরান। সিম্বল মেলান। বোনাস ট্রিগার করুন।',
    'Place chips. Spin the wheel. Win on your number.': 'চিপ রাখুন। চাকা ঘুরান। আপনার সংখ্যায় জিতুন।',
    'Beat the dealer without going over 21.': '২১-এর বেশি না হয়ে ডিলারকে হারান।',
    'Score 6 sixes before you get out.': 'আউট হওয়ার আগে ৬টি ছক্কা মারুন।',
    'Pick a corner. Beat the keeper. Score all 5 to win the bonus.': 'একটি কোণ বাছুন। গোলকিপারকে হারান। বোনাস জিততে সব ৫টি স্কোর করুন।',
    'Time your release. Drain the three.': 'আপনার রিলিজ টাইম করুন। থ্রি পয়েন্টার মারুন।',

    // ============ GAME UI CONTROLS ============
    'Auto Cashout': 'অটো ক্যাশআউট',
    'Auto Mode': 'অটো মোড',
    'Manual Mode': 'ম্যানুয়াল মোড',
    'How to Play Aviator': 'Aviator কীভাবে খেলবেন',
    'How to Play Mines': 'Mines কীভাবে খেলবেন',
    'How to Play Plinko': 'Plinko কীভাবে খেলবেন',
    'How to Play Dice': 'Dice কীভাবে খেলবেন',
    'How to Play Slot': 'স্লট কীভাবে খেলবেন',
    'How to Play Roulette': 'রুলেট কীভাবে খেলবেন',
    'How to Play Blackjack': 'ব্ল্যাকজ্যাক কীভাবে খেলবেন',
    'Place Bet': 'বাজি ধরুন',
    'CASH OUT': 'ক্যাশ আউট',
    'WAITING': 'অপেক্ষা',
    'FLYING': 'উড়ছে',
    'CRASHED': 'ক্র্যাশ',
    'WIN!': 'জয়!',
    'LOSE': 'হার',
    'Bet Amount': 'বাজি পরিমাণ',
    'Min': 'সর্বনিম্ন',
    'Max': 'সর্বোচ্চ',
    'Half': 'অর্ধেক',
    'Double Bet': 'বাজি দ্বিগুণ',
    'Lines': 'লাইন',
    'Number of Mines': 'মাইনের সংখ্যা',
    'Risk Level': 'ঝুঁকি স্তর',
    'Rows': 'সারি',
    'Low': 'কম',
    'Medium': 'মাঝারি',
    'High': 'বেশি',
    'Difficulty': 'কঠিনতা',
    'Easy': 'সহজ',
    'Hard': 'কঠিন',
    'Target': 'লক্ষ্য',
    'Over': 'উপরে',
    'Under': 'নিচে',
    'Roll': 'রোল',
    'Roll Over': 'রোল আপ',
    'Roll Under': 'রোল ডাউন',
    'Higher': 'বেশি',
    'Lower': 'কম',
    'Higher or Lower?': 'বেশি না কম?',
    'Chance to Win': 'জেতার সম্ভাবনা',
    'Pick a tile': 'একটি টাইল বাছুন',
    'Click a tile to reveal': 'প্রকাশ করতে একটি টাইল ক্লিক করুন',
    'Cash Out': 'ক্যাশ আউট',
    'Cashout': 'ক্যাশআউট',
    'Bet': 'বাজি',
    'Player': 'প্লেয়ার',
    'Dealer': 'ডিলার',
    'Banker': 'ব্যাঙ্কার',
    'You': 'আপনি',
    'Score': 'স্কোর',
    'Total': 'মোট',
    'Pot': 'পট',
    'Result': 'ফলাফল',
    'Game over': 'গেম শেষ',
    'Round complete': 'রাউন্ড সম্পূর্ণ',
    'Round in progress': 'রাউন্ড চলছে',
    'Waiting for bets…': 'বাজির জন্য অপেক্ষা…',
    'Place your bet': 'আপনার বাজি ধরুন',
    'Next round in': 'পরবর্তী রাউন্ড',
    'Round History': 'রাউন্ড ইতিহাস',
    'Bet History': 'বাজি ইতিহাস',
    'Pick the corner': 'কোণ বাছুন',
    'Top Left': 'উপরে বামে',
    'Top Right': 'উপরে ডানে',
    'Bottom Left': 'নিচে বামে',
    'Bottom Right': 'নিচে ডানে',
    'Center': 'কেন্দ্র',
    'Shoot!': 'শট!',
    'GOAL!': 'গোল!',
    'SAVED!': 'সেভ!',
    'MISSED!': 'মিস!',
    'OUT!': 'আউট!',
    'SIX!': 'ছক্কা!',
    'FOUR!': 'চার!',
    'BOUNDARY!': 'বাউন্ডারি!',
    'Pilot Rafi Aviator Cap': 'পাইলট রাফি অ্যাভিয়েটর ক্যাপ',
    'How to play this game': 'এই গেম কীভাবে খেলবেন',
    'Show How': 'কীভাবে দেখান',
    'Hide How': 'লুকান',
    'Strategy Tip': 'কৌশল টিপ',
    'Last 50 rounds': 'শেষ ৫০ রাউন্ড',
    'Provably Fair': 'প্রমাণযোগ্য ন্যায্য',
    'Pause': 'থামান',
    'Resume': 'চালু',
    'Quick Spin': 'দ্রুত স্পিন',
    'Auto Spin': 'অটো স্পিন',
    'Buy Bonus': 'বোনাস কিনুন',
    'Free Spins': 'ফ্রি স্পিন',
    'Free Spin': 'ফ্রি স্পিন',
    'Spin Count': 'স্পিন সংখ্যা',
    'Bet per Spin': 'প্রতি স্পিনে বাজি',
    'Total Bet': 'মোট বাজি',
    'Stake': 'স্টেক',
    'Last Win': 'শেষ জয়',
    'Best Win': 'সেরা জয়',
    'Biggest Multiplier': 'সর্বোচ্চ গুণক',
  };

  let currentLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;

  // ============ Lookup ============
  function t(s) {
    if (currentLang === 'en') return s;
    return BN[s] != null ? BN[s] : s;
  }

  // ============ HTML text-node walker ============
  // Walk DOM, replace text nodes that match a known English string.
  // Stores original English in data-i18n-en so we can restore on toggle.
  function applyToElement(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        // Skip nodes inside <script>, <style>, contenteditable, etc.
        const p = node.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (p.tagName === 'SCRIPT' || p.tagName === 'STYLE' || p.tagName === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest('[data-i18n-skip]')) return NodeFilter.FILTER_REJECT;
        // Skip empty / whitespace-only text
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach((node) => {
      const original = node.dataset?.i18nEn || node.nodeValue;
      // Snapshot original English on the parent for restore
      if (!node._i18nOrig) node._i18nOrig = node.nodeValue;
      const trimmed = node._i18nOrig.trim();
      const leading = node._i18nOrig.match(/^\s*/)?.[0] || '';
      const trailing = node._i18nOrig.match(/\s*$/)?.[0] || '';
      const tr = t(trimmed);
      if (tr !== trimmed) {
        node.nodeValue = leading + tr + trailing;
      } else {
        // Restore to original if no translation (handles toggle back)
        node.nodeValue = node._i18nOrig;
      }
    });

    // Translate attributes: placeholder, title, alt, aria-label, value (on inputs)
    root.querySelectorAll('[placeholder], [title], [alt], [aria-label]').forEach((el) => {
      ['placeholder', 'title', 'alt', 'aria-label'].forEach((attr) => {
        const v = el.getAttribute(attr);
        if (v == null) return;
        const key = `__i18n_${attr}`;
        if (el[key] == null) el[key] = v;
        const orig = el[key];
        const tr = t(orig);
        el.setAttribute(attr, tr);
      });
    });
  }

  // ============ Public API ============
  const I18n = {
    get lang() { return currentLang; },

    setLang(lang) {
      if (lang !== 'bn' && lang !== 'en') return;
      currentLang = lang;
      localStorage.setItem(LANG_KEY, lang);
      document.documentElement.setAttribute('lang', lang);
      applyToElement(document.body);
      this._updateToggle();
      // Re-render dynamic sections that depend on translated strings
      try {
        if (typeof window.renderGrid === 'function') {
          const activeFilter = document.querySelector('.chip-btn.active')?.dataset.filter || 'all';
          window.renderGrid(activeFilter, document.getElementById('search-input')?.value || '');
        }
        if (typeof window.renderHot === 'function') window.renderHot();
        if (typeof window.renderRecent === 'function') window.renderRecent();
        if (typeof window.renderMissions === 'function') window.renderMissions();
        if (typeof window.renderBadges === 'function') window.renderBadges();
      } catch (e) { /* dynamic re-renders are best-effort */ }
    },

    toggle() {
      const target = currentLang === 'bn' ? 'en' : 'bn';
      // If the page declares a sibling translated HTML file via
      // <link rel="alternate" hreflang="..."> use that — the in-place
      // translator can't fully render long-form article content.
      try {
        const alt = document.querySelector('link[rel="alternate"][hreflang="' + target + '"]');
        if (alt && alt.href) {
          const url = new URL(alt.href, location.href);
          // Same-origin only — and ignore self-references (some EN pages
          // list themselves as hreflang="en" + as x-default)
          const samePath = url.pathname === location.pathname;
          if (!samePath) {
            // Persist the choice so other pages (without alternates) follow it
            try { localStorage.setItem(LANG_KEY, target); } catch (e) {}
            location.href = url.pathname + url.search + url.hash;
            return;
          }
        }
      } catch (e) { /* fall through to in-place translation */ }
      this.setLang(target);
    },

    t,

    apply(root) { applyToElement(root || document.body); },

    _updateToggle() {
      document.querySelectorAll('[data-i18n-toggle]').forEach((el) => {
        const isBn = currentLang === 'bn';
        el.setAttribute('aria-label', isBn ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন');
        el.setAttribute('title', isBn ? 'English' : 'বাংলা');
        const icon = el.querySelector('[data-i18n-toggle-label]');
        if (icon) icon.textContent = isBn ? 'EN' : 'বাং';
      });
    },

    init() {
      document.documentElement.setAttribute('lang', currentLang);
      // Auto-inject a floating language toggle if no toggle is present in the DOM
      if (!document.querySelector('[data-i18n-toggle]')) {
        const btn = document.createElement('button');
        btn.setAttribute('data-i18n-toggle', '');
        btn.setAttribute('data-i18n-skip', '');
        btn.className = 'i18n-floating-toggle';
        btn.title = currentLang === 'bn' ? 'English' : 'বাংলা';
        btn.innerHTML = '<span data-i18n-toggle-label>' + (currentLang === 'bn' ? 'EN' : 'বাং') + '</span>';
        document.body.appendChild(btn);
      }
      // Walk the DOM once on init
      applyToElement(document.body);
      this._updateToggle();
      // Bind click on toggle buttons
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-i18n-toggle]');
        if (btn) {
          e.preventDefault();
          this.toggle();
        }
      });
      // Auto-apply when new elements are inserted (re-rendering game grids, modals, etc.)
      const obs = new MutationObserver((mutations) => {
        for (const m of mutations) {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) applyToElement(node);
          });
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    },
  };

  window.I18n = I18n;
  window.t = t;

  // Init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => I18n.init());
  } else {
    I18n.init();
  }
})();
