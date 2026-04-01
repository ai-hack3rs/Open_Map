#!/usr/bin/env bash
set -euo pipefail

APP_ID="com.openmaps.saas"
OUT_FILE="${1:-openmaps-crash.log}"

echo "[1/3] Checking adb device connection..."
adb devices

echo "[2/3] Clearing previous logcat buffer..."
adb logcat -c

echo "[3/3] Capturing logs to ${OUT_FILE}"
echo "Open the app now. After it crashes, press Ctrl+C here."
echo

adb logcat -v threadtime | tee "${OUT_FILE}"

