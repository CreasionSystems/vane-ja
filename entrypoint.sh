#!/bin/sh
set -e

# SearXNG signs its image-proxy URLs and cookies with secret_key. Any value
# baked into the image is public, so each container gets its own:
# SEARXNG_SECRET when set, otherwise a fresh random one. It is written into
# settings.yml because sudo resets the environment, so an exported variable
# would never reach SearXNG.
random_secret() {
  od -An -N32 -tx1 /dev/urandom | tr -d ' \n'
}
case "${SEARXNG_SECRET:-}" in
  '')
    SEARXNG_SECRET=$(random_secret)
    ;;
  *[!A-Za-z0-9_-]*)
    echo "SEARXNG_SECRET may only contain letters, digits, _ and -; using a random key instead"
    SEARXNG_SECRET=$(random_secret)
    ;;
esac
sed -i "s|^\([[:space:]]*secret_key:\).*|\1 '$SEARXNG_SECRET'|" /etc/searxng/settings.yml

echo "Starting SearXNG..."

sudo -H -u searxng bash -c "cd /usr/local/searxng/searxng-src && export SEARXNG_SETTINGS_PATH='/etc/searxng/settings.yml' && export FLASK_APP=searx/webapp.py && /usr/local/searxng/searx-pyenv/bin/python -m flask run --host=0.0.0.0 --port=8080" &
SEARXNG_PID=$!

echo "Waiting for SearXNG to be ready..."
sleep 5

COUNTER=0
MAX_TRIES=30
until curl -s http://localhost:8080 > /dev/null 2>&1; do
  COUNTER=$((COUNTER+1))
  if [ $COUNTER -ge $MAX_TRIES ]; then
    echo "Warning: SearXNG health check timeout, but continuing..."
    break
  fi
  sleep 1
done

if curl -s http://localhost:8080 > /dev/null 2>&1; then
  echo "SearXNG started successfully (PID: $SEARXNG_PID)"
else
  echo "SearXNG may not be fully ready, but continuing (PID: $SEARXNG_PID)"
fi

cd /home/vane
echo "Starting Vane..."

exec node server.js