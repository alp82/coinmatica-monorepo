# Environment Variables
Add new env vars to:
1. `.env`
2. `Dockerfile`
3. `docker-compose.yml`
4. `/.github/workflows/ci.yml`
5. Remote server `/etc/environment`
6. [github actions](https://github.com/alp82/coinmatica-monorepo/settings/environments/599537452/edit)

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