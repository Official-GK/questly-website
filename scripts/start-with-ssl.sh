#!/bin/bash

# Kill any existing processes
pkill -f firebase
pkill -f local-ssl-proxy
pkill -f vite

# Start Firebase emulators
firebase emulators:start &

# Wait for emulators to start
sleep 5

# Start SSL proxies for each emulator
local-ssl-proxy --source 9443 --target 9099 --cert .cert/cert.pem --key .cert/key.pem &  # Auth
local-ssl-proxy --source 8443 --target 8080 --cert .cert/cert.pem --key .cert/key.pem &  # Firestore
local-ssl-proxy --source 9999 --target 9199 --cert .cert/cert.pem --key .cert/key.pem &  # Storage

# Wait for proxies to start
sleep 2

# Start Vite dev server
npm run dev:https
