test-ci:
	make bootstrap
	npm test

bootstrap:
	npm install
	./node_modules/.bin/lerna bootstrap
