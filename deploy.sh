#!/usr/bin/env sh

set -e

yarn build
cd dist
echo > .nojekyll

git init
git checkout -B main
git add -A
git commit -m 'deploy'

git push -f git@github.com:ikr7/curves.git main:gh-pages

cd -
