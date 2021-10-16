# candy-machine-mint-nextjs

## Overview

This is adapted from https://github.com/exiled-apes/candy-machine-mint. That repo uses create-react-app, this uses Next.js.

I had to do some funky stuff to get things to work:

1. `Unexpected token 'export'`—fixed by using `next-transpile-modules` in `next.config.js`. See [here](https://craigglennie.com/blog/2020-10-13/fixing-unexpected-token-export-in-nextjs) for more details.
2. `@project-serum/anchor` imports some stuff that only works in Node (e.g. `fs`). Fixed by doing some webpack stuff in `next.config.js`. See [here](https://stackoverflow.com/questions/64926174/module-not-found-cant-resolve-fs-in-next-js-application) and [here](https://github.com/project-serum/anchor/issues/244) for more details.
3. Made `AppDynamic` to render things solely on the client. Was running into a different `Unexpected token 'export'` error otherwise.

## How to set things up

1. Go through all the [prerequisite steps](https://docs.metaplex.com/create-candy/introduction) (e.g. install CL tools)
2. Create the candy machine (see below)
3. Update environment variables to use candy machine info

## Creating the candy machine

NOTE: these instructions assume an alias of `candy-machine='ts-node /Users/mlim/Documents/software/crypto/solana/metaplex/js/packages/cli/src/candy-machine-cli.ts'`

### 1. Prepare NFT assets

See [the docs](https://docs.metaplex.com/create-candy/prepare-assets) for instructions, and [my repo](https://github.com/arcticmatt/candy-machine-example-assets/blob/main/assets/0.json) for example assets. The example assets provided in the docs are out of date, and don't work.

### 2. Upload assets

```
$ candy-machine upload collection-bigger-images -k ~/my_solana_wallet1.json --env devnet

Beginning the upload for 2 (png+json) pairs
started at: 1634250076160
wallet public key: 3sdsSwWWjjGA7HpPBQfGaXRE2HqmdKicMXHRapqLAu4L
Processing file: 0
manifest {
  name: 'Simple NFT #1',
  image: 'image.png',
  symbol: '',
  properties: { files: [ [Object] ], creators: [ [Object] ] }
}
initializing config
initialized config for a candy machine with publickey: 4f1vgAbpAf6LQT9t3rEQvben7cdLFnHvryJQFKRCmYER
manifest {
  name: 'Simple NFT #2',
  image: 'image.png',
  symbol: '',
  properties: { files: [ [Object] ], creators: [ [Object] ] }
}
Writing indices 0-1
Done. Successful = true.
ended at: 2021-10-14T22:21:54.223Z. time taken: 00:00:38
```

Doing this also populates the cache file (`.cache/devnet-temp`). You can view the contents of the cache by using `cat`, or use the following command for more readable info:

```
$ candy-machine show -k ~/my_solana_wallet1.json
wallet public key: 3sdsSwWWjjGA7HpPBQfGaXRE2HqmdKicMXHRapqLAu4L
No machine found
...Config...
authority:  3sdsSwWWjjGA7HpPBQfGaXRE2HqmdKicMXHRapqLAu4L
symbol:
sellerFeeBasisPoints:  0
creators:
3sdsSwWWjjGA7HpPBQfGaXRE2HqmdKicMXHRapqLAu4L at 100 %
maxSupply:  0
retainAuthority:  true
maxNumberOfLines:  2
```

If you try to upload again (e.g. because you change the asset metadata), it won't do anything. In order to upload new metadata, you need to run `rm .cache/devnet-temp` and then upload again.

### 3. Verify

```
$ candy-machine verify -k ~/my_solana_wallet1.json
```

If the upload went well, then verification should succeed.

NOTE: for a while, I was running into issues because the assets I was uploading were too small. See this [issue](https://github.com/metaplex-foundation/metaplex/issues/638) for more details.


### 4. Create the candy machine

```
$ candy-machine create_candy_machine --keypair ~/my_solana_wallet1.json --sol-treasury-account $SOLADDRMAIN --price 1
```

Now, `candy-machine show` should show the candy machine info (in addition to the config, which should already be showing):

```
$ candy-machine show -k ~/my_solana_wallet1.json
wallet public key: 3sdsSwWWjjGA7HpPBQfGaXRE2HqmdKicMXHRapqLAu4L
...Candy Machine...
Key: Cz3WS81qjfVyWujVp751B5F5pmqPeKFULYThBBWRMQU4
authority:  3sdsSwWWjjGA7HpPBQfGaXRE2HqmdKicMXHRapqLAu4L
wallet:  HYQQEHWzAgjFVRZVfndSmEH2X58BKCewC8DfzyRxmmLu
tokenMint:  null
config:  27BGWFgLumNoFrQfP7p932UjsJRv8xhXdciYutumt6jK
uuid:  27BGWF
price:  1000000000
itemsAvailable:  2
goLiveDate:  2021-10-14T23:48:23.000Z
...Config...
authority:  3sdsSwWWjjGA7HpPBQfGaXRE2HqmdKicMXHRapqLAu4L
symbol:
sellerFeeBasisPoints:  10
creators:
3sdsSwWWjjGA7HpPBQfGaXRE2HqmdKicMXHRapqLAu4L at 100 %
maxSupply:  0
retainAuthority:  true
maxNumberOfLines:  2
```

### 5. Update `goLiveDate`

You need to do this, otherwise the frontend (this repo) doesn't work.

```
$ candy-machine update_candy_machine -k ~/my_solana_wallet1.json -d "now"
```

Replace `"now"` with the actual date you want.

**Ok, now the UI should work!**


## Questions

1. How can you implement reveals?
2. How can you limit the number of NFTs an individual can mint?

## Resources

- https://docs.metaplex.com/
- https://hackmd.io/@levicook/HJcDneEWF
