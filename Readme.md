# KPT tool

## Install
```sh
git clone https://github.com/yoshiyuki-mizogami/kpt-tool.git
```

## Create heroku app
```sh
cd kpt-tool
heroku apps:create [app-name]
```

## Initialize Postgresql
```sh
heroku addons:create heroku-postgresql:hobby-dev
```

## Build app
```sh
git push heroku master
```

KPTツールが立ち上がります

## 許可IPの設定
`ALLOW_IP_LIST`変数に、対象IPを;で区切って入力

```sh
# 192.168.0.1,192.168.0.2を許可したい場合
heroku config:set ALLOW_IP_LIST="192.168.0.1;192.168.0.2"
```

## Help
アプリ画面からF1で操作方法が表示されます

