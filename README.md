This is adapted from https://github.com/exiled-apes/candy-machine-mint. That repo uses create-react-app, this uses Next.js.

I had to do some funky stuff to get things to work:

1. `Unexpected token 'export'`—fixed by using `next-transpile-modules` in `next.config.js`. See [here](https://craigglennie.com/blog/2020-10-13/fixing-unexpected-token-export-in-nextjs) for more details.
2. `@project-serum/anchor` imports some stuff that only works in Node (e.g. `fs`). Fixed by doing some webpack stuff in `next.config.js`. See [here](https://stackoverflow.com/questions/64926174/module-not-found-cant-resolve-fs-in-next-js-application) and [here](https://github.com/project-serum/anchor/issues/244) for more details.
3. Made `AppDynamic` to render things solely on the client. Was running into a different `Unexpected token 'export'` error otherwise.
