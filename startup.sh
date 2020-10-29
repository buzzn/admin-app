#!/usr/bin/sh
echo 'switch folder'
cd ../core

echo 'set envs'
source env.sh

echo 'start redis'
redis-server

echo 'start puma'
cd ../core
bundle exec puma