#!/bin/bash

# Setup the Environment variables for the REST Server

#1. Set up the card to be used
export COMPOSER_CARD=admin@meat-tracking-network

#2. Set up the namespace usage    always |  never
export COMPOSER_NAMESPACES=never

#3. Set up the REST server Authhentcation    true | false
export COMPOSER_AUTHENTICATION=true

#4. Set up the Passport strategy provider
export COMPOSER_PROVIDERS='{
  "github": {
    "provider": "github",
    "module": "passport-github",
    "clientID": "80e29c9678dd05c382c2",
    "clientSecret": "b8f0b77942c99ce463c502c3d4ffa87049733256",
    "authPath": "/auth/github",
    "callbackURL": "/auth/github/callback",
    "successRedirect": "/",
    "failureRedirect": "/"
  }
}'

#5. Execute the REST server
composer-rest-server -p 443
