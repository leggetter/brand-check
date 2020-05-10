Check what assets are available when creating a brand:

Presently checks:

- Twitter handle
- GitHub org
- Domains: .com .io and .co

## Usage

You'll need a RAPID API account and have subscribed to the Domainr API.

Create a .env file and add your RAPID API Key:

```
$ echo "RAPID_API_KEY=YOUR API KEY HERE" > .env
```

Install dependencies:

```
$ npm install
```

### Run as a command

```
$ node index.js brand
performing brand checks for brand
{
  brand: 'brand',
  twitter: { available: false },
  github: { available: true },
  dotcom: { available: false, status: 'active' },
  dotio: { available: false, status: 'active' },
  dotco: { available: false, status: 'marketed priced transferable active' }
}
```

### Run as an API

Install dependencies and run

```
$ npm start

Your app is listening on port 3000
```

## License

MIT