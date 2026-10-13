# SplitSense

A mobile rowing journal for athletes, built with Expo and React Native for iOS and Android. Version 0.1 is an early local-first prototype.

## What works

- Opening welcome screen with Log In, Create Account, Google, and Apple options.
- Demo email/password forms, password visibility toggle, and clearly marked social sign-in previews. No authentication details are saved or transmitted; these screens do not create accounts or protect local data. Use Explore the demo to enter the app, or Return to sign-in in Profile.

- Home dashboard with weekly sessions, distance, training time, and a personal goal.
- Erg, water, and strength workout logging with date, duration, effort, and notes.
- Automatic average split per 500 m, optional stroke rate, and water-session BoatFeel ratings.
- Filtered training history, session details, and confirmed workout deletion.
- Exact-distance erg personal bests for 2K, 5K, and 6K, plus recent erg pace history.
- Editable athlete profile and optional, clearly marked example workouts.
- Device-local persistence. Loading and saving failures are surfaced without overwriting unreadable data.

## Run on your phone

Install Node.js 24 LTS on your computer and Expo Go on your phone. In this project folder:

```sh
npm ci
npm start
```

Connect your phone and computer to the same Wi-Fi. Scan the development QR code with your iPhone camera or Expo Go on Android. Use the Expo Go version compatible with this project's SDK. See [Expo environment setup](https://docs.expo.dev/get-started/set-up-your-environment/).

For a browser preview, run `npm run web`. For the iOS simulator, run `npm run ios` after installing Xcode; Android emulation requires Android Studio.

## Checks

```sh
npm run typecheck
npm test
npx expo export --platform web
```

## Expo cloud builds

The local Expo project is configured. It has not been registered to a personal Expo account or submitted to either app store. No paid services are enabled.

When ready, sign in using `npx eas-cli@latest login` and link the project with `npx eas-cli@latest init`. Select your own account and create the SplitSense project. This will add your EAS project ID to app.json. Choose permanent iOS and Android application identifiers before releasing.

`eas.json` includes preview and production profiles. An Android preview APK can be built with `npx eas-cli@latest build --platform android --profile preview`. iOS device distribution requires Apple signing setup. The development-client profile requires adding `expo-dev-client` with `npx expo install expo-dev-client` before use.

## Data and scope

Training is saved only on the current device/browser, using AsyncStorage. There is no cloud backup; uninstalling the app or clearing browser storage can remove it. Storage is not encrypted, so do not use notes for sensitive information. Workouts are manually logged; there is no live GPS, device sync, team backend, or video analysis yet.

SplitSense Coach is labeled as planned. This version contains no AI calls, API keys, subscriptions, or checkout. Before adding those features, implement authenticated cloud storage, private per-athlete access, server-side AI requests, and subscription entitlements.

Example sessions are optional and visibly marked. Remove them in Profile; personal workouts remain intact. Compare similar workouts when assessing pace trends.

## Next milestones

Dependency audit on the starter reports 22 inherited findings (15 high, 7 moderate), in build-tool dependency chains including braces, node-forge, and uuid. Compatible automatic fixes were applied; remaining fixes suggested by npm would downgrade Expo or React Native incompatibly. Review these upstream advisories and update compatible packages before production release. No claim of production security readiness is made for this prototype.

1. Test on physical iPhone and Android devices with athletes.
2. Add workout editing and data export.
3. Add accounts and private cloud backup.
4. Add post-workout analysis with athlete-controlled sharing.
5. Add coach/team tools and paid coaching once validated.
