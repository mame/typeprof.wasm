# typeprof.wasm

## How to build a custom ruby.wasm

```
$ cd wasm-build
$ ./build.sh
$ cp ruby.wasm ../public
```

## How to build vscode-rbs-syntax

```
$ git clone https://github.com/soutaro/vscode-rbs-syntax.git
$ cd vscode-rbs-syntax
$ npm install
$ npm run package
$ cp rbs-syntax-*.vsix ../public/
```

## How to preview

The preview mode loads typeprof from public/typeprof directory.

```
$ npm install
$ git clone https://github.com/ruby/typeprof.git public/typeprof
$ npm run dev
```

## How to build

```
$ npm run build
```