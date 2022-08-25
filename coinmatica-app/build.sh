#!/usr/bin/env bash
cd ../shared
npm install
cd ../coinmatica-app
echo ${PWD}
next build