# Настройка Google Sheets и Google Apps Script для RSVP-анкеты

Эта инструкция объясняет, как подключить форму RSVP с сайта к Google Sheets через Google Apps Script.

## Что получится в итоге

Форма на сайте будет отправлять данные в Google Apps Script Web App. Скрипт примет JSON, проверит обязательные поля и запишет строку в Google Sheets.

В таблицу будут записываться поля:

| submitted_at | guest_name | attendance_status | partner_name | source |
| --- | --- | --- | --- | --- |
| дата отправки | имя гостя | статус присутствия | имя пары | источник заявки |

## 1. Создайте Google Sheets

1. Откройте https://sheets.google.com.
2. Создайте новую таблицу.
3. Назовите ее, например: `RSVP Wedding`.
4. Создайте или переименуйте первый лист в `RSVP`.
5. В первой строке добавьте колонки строго в таком порядке:

```text
submitted_at | guest_name | attendance_status | partner_name | source
```

Можно также оставить лист пустым: Apps Script из файла `google-apps-script.js` сам добавит заголовки, если лист пустой.

## 2. Скопируйте Spreadsheet ID

Spreadsheet ID находится в ссылке на Google Sheets.

Пример ссылки:

```text
https://docs.google.com/spreadsheets/d/1AbCDefGhIJkLmNoPqRsTuVwXyZ1234567890/edit#gid=0
```

В этом примере Spreadsheet ID:

```text
1AbCDefGhIJkLmNoPqRsTuVwXyZ1234567890
```

Скопируйте только часть между `/d/` и `/edit`.

## 3. Создайте проект Google Apps Script

1. Откройте https://script.google.com.
2. Нажмите `New project`.
3. Назовите проект, например: `Wedding RSVP API`.
4. Удалите стандартный код из файла `Code.gs`.
5. Откройте локальный файл проекта `google-apps-script.js`.
6. Скопируйте весь код из `google-apps-script.js` и вставьте его в `Code.gs` в Google Apps Script.

## 4. Укажите Spreadsheet ID и название листа

В Google Apps Script найдите верхнюю часть кода:

```javascript
const SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'RSVP';
```

Замените `PASTE_YOUR_SPREADSHEET_ID_HERE` на ID вашей таблицы:

```javascript
const SPREADSHEET_ID = '1AbCDefGhIJkLmNoPqRsTuVwXyZ1234567890';
const SHEET_NAME = 'RSVP';
```

Если лист называется не `RSVP`, измените `SHEET_NAME`. Рекомендуется оставить `RSVP`, чтобы не менять структуру.

## 5. Проверьте код Apps Script

В проекте Apps Script должен быть код с такими функциями:

```javascript
function doPost(e) { ... }
function jsonResponse(payload, statusCode) { ... }
```

`doPost(e)` нужен обязательно. Именно эту функцию Google Apps Script вызывает, когда сайт отправляет POST-запрос.

Скрипт делает следующее:

1. Принимает JSON из формы.
2. Читает поля `submitted_at`, `guest_name`, `attendance_status`, `partner_name`, `source`.
3. Проверяет, что имя гостя заполнено.
4. Проверяет, что статус присутствия один из разрешенных вариантов.
5. Если выбран статус `Буду с парой/семьей`, проверяет имя пары.
6. Открывает Google Sheets по `SPREADSHEET_ID`.
7. Находит лист `RSVP` или создает его.
8. Добавляет заголовки, если лист пустой.
9. Записывает новую строку.
10. Возвращает JSON-ответ `{ "ok": true }`.

## 6. Опубликуйте Apps Script как Web App

1. В Google Apps Script нажмите `Deploy`.
2. Выберите `New deployment`.
3. Нажмите на иконку шестеренки рядом с `Select type`.
4. Выберите `Web app`.
5. В поле `Description` напишите, например: `RSVP form endpoint`.
6. В поле `Execute as` выберите `Me`.
7. В поле `Who has access` выберите `Anyone`.
8. Нажмите `Deploy`.
9. Google попросит выдать разрешения. Разрешите доступ к таблицам.
10. После публикации скопируйте `Web app URL`.

URL будет похож на это:

```text
https://script.google.com/macros/s/AKfycbx_your_deployment_id/exec
```

## 7. Вставьте Web App URL на сайт

Откройте файл `script.js` и найдите объект `config` в самом верху файла.

Найдите строку:

```javascript
googleAppsScriptUrl: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
```

Замените ее на URL, который вы получили при публикации Web App:

```javascript
googleAppsScriptUrl: 'https://script.google.com/macros/s/AKfycbx_your_deployment_id/exec',
```

После этого форма на сайте начнет отправлять данные в Google Sheets.

## 8. Проверьте отправку формы

1. Откройте сайт через локальный сервер или на хостинге.
2. Заполните поле `Имя и фамилия`.
3. Выберите статус присутствия.
4. Если выбираете `Буду с парой/семьей`, появится поле для имени пары. Оно обязательно.
5. Нажмите `Отправить`.
6. Если все настроено правильно, появится сообщение:

```text
Спасибо! Ваш ответ сохранён
```

7. Откройте Google Sheets и проверьте, что появилась новая строка.

## 9. Важные места в проекте

### Файл `script.js`

Здесь меняются основные настройки сайта:

```javascript
const config = {
  weddingDate: '2026-08-23T16:00:00+03:00',
  weddingDateLabel: '23 августа 2026',
  yandexMapsUrl: 'https://yandex.ru/maps/?text=...',
  yandexMapsEmbedUrl: 'https://yandex.ru/map-widget/v1/?text=...',
  telegramChatUrl: 'https://t.me/your_wedding_chat',
  googleAppsScriptUrl: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
  source: 'wedding-invitation-site'
};
```

Что менять:

- `weddingDate`: дата и время свадьбы для счетчика и календаря.
- `weddingDateLabel`: красивая текстовая дата на странице.
- `yandexMapsUrl`: ссылка на Яндекс.Карты для кнопки.
- `yandexMapsEmbedUrl`: ссылка на встроенную Яндекс.Карту.
- `telegramChatUrl`: ссылка на Telegram-чат гостей.
- `googleAppsScriptUrl`: URL опубликованного Apps Script Web App.
- `source`: техническая метка, которая попадет в Google Sheets.

### Файл `google-apps-script.js`

Здесь меняются настройки Google Sheets:

```javascript
const SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'RSVP';
```

Что менять:

- `SPREADSHEET_ID`: ID вашей Google Sheets таблицы.
- `SHEET_NAME`: название листа, куда записывать ответы.

## 10. Если форма не отправляется

Проверьте по порядку:

1. В `script.js` заменен `YOUR_DEPLOYMENT_ID` на реальный Web App URL.
2. Apps Script опубликован именно как `Web app`.
3. В настройке доступа выбрано `Anyone`.
4. В `SPREADSHEET_ID` нет лишних пробелов и указан именно ID, а не вся ссылка.
5. Лист называется `RSVP`, если в коде стоит `const SHEET_NAME = 'RSVP';`.
6. При первом запуске Apps Script выдали разрешения на доступ к Google Sheets.
7. После изменения кода Apps Script создан новый deployment или обновлен существующий deployment.

## 11. Как обновлять Apps Script после изменений

Если вы изменили код в Google Apps Script:

1. Нажмите `Deploy`.
2. Выберите `Manage deployments`.
3. Найдите текущий Web App deployment.
4. Нажмите иконку редактирования.
5. В поле `Version` выберите `New version`.
6. Нажмите `Deploy`.

Обычно Web App URL остается тем же. Если Google выдал новый URL, замените `googleAppsScriptUrl` в `script.js`.

## 12. Безопасность и ограничения

Это простая схема для свадебного приглашения. Она удобна и достаточно практична для RSVP-формы, но не является защищенной серверной авторизацией.

Рекомендации:

- Не храните в форме чувствительные персональные данные.
- Не публикуйте Spreadsheet ID в открытых местах отдельно от сайта.
- Периодически проверяйте таблицу на тестовые или случайные записи.
- После свадьбы можно снять Apps Script Web App с публикации или ограничить доступ.
