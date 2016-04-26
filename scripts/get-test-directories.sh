#!/bin/sh
set -e

TEST_DIRS=""

for f in modules/*; do
  if [ -n "$TEST_ONLY" ] && [ `basename $f` != "$TEST_ONLY" ]; then
    continue
  fi

  if [ -d "$f/test" ]; then
    TEST_DIRS="$TEST_DIRS $f/test"
  fi
done

echo $TEST_DIRS
