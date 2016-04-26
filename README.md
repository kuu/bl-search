# bl-search

## Prerequisite
shell, git, node


## Install
```
$ git clone git@github.com:kuu/bl-search.git
$ cd bl-search
$ npm install
```

## Configure
```
$ mkdir config
$ touch config/default.json
```
Edit `config/default.json` as follows:
```
{
  "api": {
    "key": {Your Ooyala API Key},
    "secret": {Your Ooyala API Secret}
  }
}
```

## Build & Run
```
$ npm start
Open http://localhost:8080 with your browser.
```
