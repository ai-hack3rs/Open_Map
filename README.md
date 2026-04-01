# OpenMaps SaaS (Android)

Google-Maps-style Android app built on **free/open APIs**:

- **Map rendering**: OpenStreetMap raster tiles (via MapLibre)
- **Place search (geocoding)**: Nominatim (OpenStreetMap)
- **Routing**: OSRM public demo server

This repo is structured to be **SaaS-ready** (feature gating + account/subscription interfaces), but ships with **local stub implementations** so it runs without paid services.

## Requirements

- Android Studio (recommended)
- JDK 17
- Android SDK installed via Android Studio

## Run

From the project root:

```bash
./gradlew :app:installDebug
```

Or open the folder in Android Studio and press Run.

If `./gradlew` downloads Gradle on first run, that’s expected (this repo bootstraps Gradle into `./.gradle-dist/`).

## GitHub Actions (build + release)

- **CI**: runs on every push/PR, builds `assembleDebug`, uploads the debug APK as an artifact.
- **Release**: push a tag like `v0.1.0` to build `assembleRelease` + `bundleRelease` and publish a GitHub Release with the APK/AAB attached.
- **Signed release setup (Option C)**: add these GitHub repository secrets:
  - `ANDROID_KEYSTORE_BASE64` (base64 of your `.jks` file)
  - `ANDROID_KEYSTORE_PASSWORD`
  - `ANDROID_KEY_ALIAS`
  - `ANDROID_KEY_PASSWORD`

## Notes on “free APIs”

- **OpenStreetMap tiles** are community infrastructure; do not abuse them. For production SaaS, host your own tiles or use a free-tier map provider.
- **Nominatim** usage policy is strict; for production, host your own Nominatim or use a provider.
- **OSRM demo server** is for testing; for production, host your own OSRM.

## What’s included

- Map view with zoom/rotate
- My-location button (runtime permission flow)
- Search bar (Nominatim) + result list
- Tap-to-drop pin
- Route from current location to selected place (OSRM) + polyline overlay
- “SaaS” layer (interfaces + in-memory implementation):
  - Account state
  - Feature flags (e.g., routing requires “Pro”)

