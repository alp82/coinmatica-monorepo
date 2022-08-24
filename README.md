# Dockerize Howto

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