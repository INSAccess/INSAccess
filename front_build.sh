#!/bin/bash
set -e

FRONTEND_DIR="frontend"
BACKEND_DIR="backend"
REACT_APP_API_URL="http://192.168.1.25:8000"

echo "[1] Cleaning previous build..."
rm -rf $FRONTEND_DIR/build


echo "[3] Installing frontend dependencies..."
cd "$FRONTEND_DIR"
npm install --legacy-peer-deps

echo "[4] Building frontend"
export NODE_OPTIONS="--max_old_space_size=4096"
export GENERATE_SOURCEMAP=false
export REACT_APP_API_URL="$REACT_APP_API_URL"
npm run build

cd ..

echo "[5] Preparing backend static directories..."
mkdir -p $BACKEND_DIR/staticfiles/static
mkdir -p $BACKEND_DIR/core/templates

echo "[6] Cleaning old static files in backend..."
rm -rf $BACKEND_DIR/staticfiles/static/*

echo "[7] Copying new static files"
rsync -av --exclude='*.map' "$FRONTEND_DIR/build/static/" "$BACKEND_DIR/staticfiles/static/"

echo "[8] Copying index.html to Django templates..."
cp "$FRONTEND_DIR/build/index.html" "$BACKEND_DIR/core/templates/index.html"

echo "[9] Copying extra assets "
rsync -av --exclude='*.map' "$FRONTEND_DIR/build/"*.json "$FRONTEND_DIR/build/"*.ico \
    "$FRONTEND_DIR/build/"*.png "$FRONTEND_DIR/build/"*.svg "$FRONTEND_DIR/build/"*.webmanifest \
    "$BACKEND_DIR/staticfiles/" 2>/dev/null || true

echo "Done"
