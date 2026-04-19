#!/bin/sh
set -e

CERT_DIR=/etc/nginx/certs

if [ ! -f "$CERT_DIR/server.crt" ]; then
    echo "Generating self-signed certificate for careerbridge-david.duckdns.org ..."
    mkdir -p "$CERT_DIR"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$CERT_DIR/server.key" \
        -out    "$CERT_DIR/server.crt" \
        -subj   "/CN=careerbridge-david.duckdns.org/O=CareerBridge/C=US" \
        -addext "subjectAltName=DNS:careerbridge-david.duckdns.org"
    echo "Certificate generated."
else
    echo "Certificate already exists, skipping generation."
fi

exec nginx -g "daemon off;"
