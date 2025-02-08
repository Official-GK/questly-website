#!/bin/bash

# Kill any existing processes
pkill -f firebase
pkill -f local-ssl-proxy

# Start Firebase emulators
firebase emulators:start &

# Wait for emulators to start
sleep 5

# Start SSL proxies for each emulator
local-ssl-proxy --source 9099 --target 9099 &  # Auth
local-ssl-proxy --source 8080 --target 8080 &  # Firestore
local-ssl-proxy --source 9199 --target 9199 &  # Storage

# Keep script running
wait
