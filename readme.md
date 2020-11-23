# RU

С помощью этого приложения можно почистить свою группу от неактивных юзеров. Которые забанены на сайте или не были онлайн больше трёх месяцев. Базируется на модуле `puppeteer`.

## Как работает.

Нужно заполнить `env` файл.

```sh
PASSWORD=test
LOGIN=test
PUBLIC=test
COUNT=test
```

В учётной записи должна быть отключена двойная аутентификация, что позволит puppeteer'у залогиниться без проблем.

Адрес паблика должен быть без домена и дополнительных параметров. Например `https://vk.com/worldofwarcraft?from=frg` из этой ссылки нужно только  `worldofwarcraft`.

`Count` это количество пользователей которых нужно проверить единовременно. Т.к. сам `puppeteer` работает как браузер, то он ограничен скоростью браузера соответственно.

## Как запустить.

Для запуска необходимо открыть консоль и ввести последовательно команды.

```sh
npm i
npm run start
```

Для работы у вас должна быть установлена платформа Node Js.
https://nodejs.org/en/



# EN

You can use this app to clear your group of inactive users. Who are banned from the site or have not been online for more than three months. Based on the `puppeteer ` module.

## How it work

You need to fill in the ` env` file.

```sh
PASSWORD=test
LOGIN=test
PUBLIC=test
COUNT=test
```

Multi-factor authentication must be disabled in the account, which will allow puppeteer to log in without problems.

The group address must be without a domain and `GET` parameters. Example `https://vk.com/worldofwarcraft?from=frg` from this link, you only need to  `worldofwarcraft`.

`Count`  is the number of users that need to be checked at the same time.since `puppeteer` itself works as a browser, it is limited by the browser speed.

## How to launch.

To get started, open the console and enter the following commands.

```sh
npm i
npm run start
```

To work, you must have the Node Js platform installed.
https://nodejs.org/en/