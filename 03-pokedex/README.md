<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Execute in dev mode

1. Clone the repository
2. Install nest (id not installed)
```
$ npm i -g @nestjs/cli
```
3. Execute
```
$ npm ci
```
4. Run DB
```
$ docker-compose up -d
```
5. Copy the __.env.template__ file and rename it to __.env__:
```
$ cp .env.template .env
```
6. Fill the env variables at __.env__ file
7. Start the app in watch mode:
```
$ npm run start:dev
```
