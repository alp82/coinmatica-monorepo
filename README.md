# Dockerize Howto

SSH key for server hosting (e.g. Hetzner):
```shell
ssh-keygen -t rsa -m pem -b 4096 -C "ci@coinmatica.net" -N ""
```

`next.config.mjs`:
```javascript
export default defineNextConfig({
  // [...]
  experimental: {
    externalDir: true,
  },
  output: 'standalone',
  // [...]
})
```

Then check contents of:
* `docker-compose.yml`
* `coinmatica-telegram/Dockerfile`