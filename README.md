1) Подготовка к работе

- запустить React-приложение из папки frontend
- запустить DRF-сервер из папки backend
- если вы не хотите использовать тестовую бд, удалите файл с ней и все миграции, создайте суперпользователя
- при создании нового суперпользователя возможно придётся указать тип пользователя вручную. Укажите тип "MFR" через терминал или с помощью редактора БД

2) Работа без авторизации

- откройте приложение, введите № техники. Для тестовой БД доступны №№111, 555, 333
- при вводе несуществующего номера вы получите соответсвующее оповещение

3) Работа в качестве администратора

- откройте ссылку авторизации в правом верхнем углу
- используйте логин/пароль "admin" если работаете с тестовой БД, или используйте данные созданого вами суперпользователя
- на главной странице вам будут доступны все объекты БД - машины, ТО и рекламации. Используйте фильтры, чтобы найти нужные записи
- внизу страницы будет блок управления записями, доступный пользователям с типом "MFR" - представитель производителя, с его помощью вы можете добавить новые записи или изменить уже имеющиеся, в том числе справочники и профили клиентов и сервисных организаций. Обратите внимание, что профили и учётные записи пользователей - разные сущности. В данном случае для редактирования доступна только справочная информация, но не учётные данные для системы
- в правом верхнем углу вы найдёте две ссылки - выход из системы и админ-панель. Ссылка для перехода в админ-панель видна только пользователям со статусом суперпользователя, а так же защищена от прямого перехода. Перейдите в админ-панель
- в админ-панели продублирован блок управления записями, а так же находятся две кнопки-ссылки для управления учётными данными пользователей - создания новых записей и измененния имеющихся
- обратите внимание, что при редактировании записи пароль назначается отдельно. Назначить новый пароль и изменить данные пользователя "в один заход" не удастся
- пользователь, имеющий статус суперпользователя, не сможет отнять данный статус сам у себя, но сможет лишить прав администратора других пользователей
- все ссылки в админ-панели защищены от прямого перехода
- при создании пользователя с типом "Конечный клиент" или "Сервисная компания", автоматически на основании введённых вами данных в полях "Название в профиле" и "Описание в профиле" будет создан соответствующий справочник, который можно привязывать к основым моделям

4) Работа в качестве пользователя

- авторизуйтесь как любой пользователь с типом "Конечный клиент" или "Сервисная компания". Вы можете создать такого пользователя через админ-панель или изменить пароль одному из имеющихся
- для пользователей с типом "Конечный клиент" подборка записей производится следующим образом: все машины, у которых профиль, связанный с пользователем, указан как "клиент", а так же все ТО и рекламации, у которых в поле "машина" указана техника пользователя
- для пользователей с типом "Сервисная компания" подборка всех записей производится по наличию профиля, связанного с пользователем в поле "сервисная компания"
- для пользователей с типом "Конечный клиент" внизу в блоке управления будут доступны функции создания и редактирования ТО
- для пользователей с типом "Сервисная компания" внизу в блоке управления будут доступны функции создания и редактирования ТО и рекламаций
- для всех пользователей доступна справочная информация, которая доступна по ссылкам в таблицах
- при клике на серийный номер техники будет открыта страница с 3-мя таблицами - таблица для выбраной машины, ТО и рекламации будут отобраны по критерию наличия этой техники в поле "машина"

5) Безопасность

- для всех страниц используется разграничение по правам. Это касается как отображения отдельных элементов в зависимости от типа пользователя и наличия у него прав администратора, так и защиты от прямых переходов. При недостатке прав пользователю отобразится "страница 403"
- для всех запросов к API имеется защита от прямых запросов. Для идентификации используется система токенов. Сымитировать несанкционированный запрос можно через Postman

6) Улучшения

- в настоящий момент в коде много дублирований и рудиментов, с обновлениями код станет более изящным и читабельным
- обращения к document по возможности будут заменены инструментами React, чтобы поведение сложноструктурированных страниц стало более предсказуемым
- приму правки/советы по дизайну. Чувствую что приложение выглядит не очень стильно, но навыков дизайна интерфейсов не имею, поэтому как улучшить внешний вид приложения имею весьма расплывчатое представление
- не было критериев для пароля/логина, хотя их можно внедрить с помощью регулярных выражений
- было заявлено, чтобы у пользователей с типом "Конечный клиент" или "Сервисная компания" была возможность редактирования записей, но не было задано ограничений по этому процессу, в результате могут возникать ситуации, когда пользователь, представитель одной сервисной компании, создаёт рекламацию и помещает в поле "сервисная компания", другую компанию. Или при редактировании меняет другую компанию на свою. Поэтому готов изменить поведение, если будут заданы чёткие критерии, например, что удалять можно только "свои" записи или что при редактировании поле "сервисная компания" неизменяемо
- журнал логов для администрации, который позволял бы отслеживать действия пользователей и откатывать их действия
- интеграция с почтой