test-ci:
	make bootstrap
	npm run packages-build
	./scripts/test.sh

bootstrap:
	npm install
	./node_modules/.bin/lerna bootstrap
