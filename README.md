# MLBB Draft Assistant by Princenue — Complete Starter

Aplikasi mobile-first Draft Assistant untuk Mobile Legends.

## Fitur
- 5v5 Draft Room
- Rank: Epic, Legend, Mythic, Mythical Honor, Mythical Glory, Mythical Immortal
- Ban count 6 / 8 / 10 sesuai rank
- Pick & Ban timeline
- Blue/Red team
- 133-hero roster
- Smart recommendation engine
- Counter + synergy + role balance + tag composition + meta priority
- Hero database
- Competitive meta board
- Draft history
- Premium dark esports UI
- Capacitor-ready Android build

## Data kompetitif
MPL ID statistics harus disimpan sebagai dataset per season/patch/phase, misalnya:
season, patch, phase, hero, picks, bans, wins, losses, winRate, pickRate, banRate, priority.

Jangan menganggap statistik MPL sebagai counter matrix. Counter matrix dan synergy matrix adalah tactical layer terpisah. Engine menggabungkan keduanya.

Data pada `rich` adalah contoh tactical seed. Untuk produksi, isi seluruh matchup dengan data terverifikasi dari sumber yang sah dan update patch.

## Run
npm install
npm run dev

## Build web
npm run build

## Android
npm run cap:add
npm run cap:sync
npm run cap:open

Lalu build APK melalui Android Studio.

## Catatan
Project ini tidak memasukkan artwork hero resmi berhak cipta. Gunakan asset yang kamu punya lisensinya atau asset resmi yang diizinkan.
