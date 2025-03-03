# AngularTodoList

目前暫時使用localStorage當作資料儲存點，之後則會使用Firebase Database來儲存資料。

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.5.

## TODO

- [x] 刪除資料時需要一個確認dialog
- [x] 令todos可以被排序
  - [x] 在資料庫內對todo加上createAt項目
  - [x] 撰寫排序邏輯
- [ ] 令todo有一個截止日期時間
  - [ ] 在資料庫內對todo加上dueDate項目
  - [ ] 渲染dueDate
  - [ ] 在editor dialog加上可以修改dueDate的欄位，或考慮使用分開的dialog
- [x] 將資料暫存到LocalStorage，以儲存未登入者的資料
  - [x] 在todo.service.ts裡建立CRUDStrategies來使得CRUDFunction在使用者登入與未登入的狀態下使用不同函數
  - [x] 修改CRUD函數使其符合CRUDStrategies的要求，未登入 => localStorage，登入 => firebase
    - [x] Create
    - [x] Read
    - [x] Update
    - [x] Delete
- [ ] 修改todo item可以被點擊的區域，使其更加容易被點擊
- [ ] 建立auth，依照不同用戶在firebase建立資料
- [ ] 初始化資料，依照是否登入決定從後端要資料或LocalStorage
- [ ] 設定一個提醒氣泡，提醒未登入用戶若未登入則資料有可能遺失
- [ ] 美化todo editor dialog的布局與樣式
- [ ] 避免呼叫 updateTodoItem()，當todo沒有被修改時
- [ ] 暫時提高了"maximumError": "1.5MB"，在angular.json裡面(從1MB=>1.5MB)
  - [ ] 尋找減少bundle大小的方法
- [ ] 統一mat-card的寫法，讓未完成與完成者共用部分邏輯

## Prettier

執行Prettier：

```bash
npx prettier . --write
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
