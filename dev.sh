#!/usr/bin/env bash
# ========================================================
# Velora UI Dev Server Launcher
# Domain: http://velora-ui.test (Port 5175)
# ========================================================

set -e

BUN_BIN="$HOME/.bun/bin/bun"
if ! command -v "$BUN_BIN" &> /dev/null; then
  BUN_BIN="bun"
fi

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "================================================="
echo "   🚀 Menjalankan Velora UI Admin Template       "
echo "   🌐 Akses: http://velora-ui.test               "
echo "================================================="

cd "$DIR" && "$BUN_BIN" run dev
