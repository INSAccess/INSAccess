#!/bin/bash
set -e

FRONTEND_DIR="frontend"
BACKEND_DIR="backend"
VITE_API_URL="https://edt.insa-rouen.fr"
VITE_GIT_VERSION="0.4.6"
#"https://edt.insa-rouen.fr"

echo "[1] Cleaning previous build..."
rm -rf $FRONTEND_DIR/build

echo "[2] Installing frontend dependencies..."
cd "$FRONTEND_DIR"
npm install --legacy-peer-deps

echo "[3] Building frontend"
export NODE_OPTIONS="--max_old_space_size=4096"
export GENERATE_SOURCEMAP=false
export VITE_API_URL="$VITE_API_URL"
export VITE_GIT_VERSION="$VITE_GIT_VERSION"
npm run build

cd ..

echo "[4] Preparing backend static directories..."
mkdir -p $BACKEND_DIR/staticfiles/static
mkdir -p $BACKEND_DIR/core/templates

echo "[5] Cleaning old static files in backend..."
rm -rf $BACKEND_DIR/staticfiles/static/*

echo "[6] Copying new static files"
rsync -av --exclude='*.map' "$FRONTEND_DIR/build/static/" "$BACKEND_DIR/staticfiles/static/"

echo "[7] Copying index.html to Django templates..."
cp "$FRONTEND_DIR/build/index.html" "$BACKEND_DIR/core/templates/index.html"

echo "[8] Copying extra assets including robots.txt"
rsync -av --exclude='*.map' "$FRONTEND_DIR/build/"*.json \
    "$FRONTEND_DIR/build/"*.ico \
    "$FRONTEND_DIR/build/"*.png \
    "$FRONTEND_DIR/build/"*.svg \
    "$FRONTEND_DIR/build/"*.webmanifest \
    "$FRONTEND_DIR/build/robots.txt" \
    "$BACKEND_DIR/staticfiles/static/" 2>/dev/null || true

echo "Done"
