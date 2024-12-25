#!/bin/sh

RB_SYS_STABLE_API_COMPILED_FALLBACK=true bundle install
bundle exec rbwasm build -o ruby.wasm --ruby-version head
