# gmail-old-notification-remover

This Google App Script for removing older mails from Gmail.

## Install

```
yarn 
```

### clasp

Login with [Google App Script](https://script.google.com/)

```
yarn clasp login
```

Create new App Script

```
yarn clasp create
```

Change `rootDir` of `.clasp.json`:

```json
{
  "scriptId": "<id>",
  "rootDir": "build"
}
```

### deploy

```
yarn run deploy
```

## Usage

Run `cleanupMail` function in Google App script. 

## Changelog

See [Releases page](https://github.com/azu/gmail-old-notification-remover/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/gmail-old-notification-remover/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
