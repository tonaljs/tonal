test-ci:
	make bootstrap
	./scripts/test.sh

bootstrap:
	npm install
	./node_modules/.bin/lerna bootstrap
