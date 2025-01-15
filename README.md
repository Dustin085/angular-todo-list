# AngularTodoList

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.5.

## Prettier
npx prettier . --write

## TODO
- [] 刪除資料時需要一個確認dialog
- [] 對todo加上createAt項目
- [] 對todo加上dueDate項目
  - [] 在editor dialog加上可以修改dueDate的欄位，或考慮使用分開的dialog
- [] 將資料暫存到LocalStorage，以儲存未登入者的資料
- [] 建立auth，依照不同用戶在firebase建立資料
- [] 設定一個提醒氣泡，提醒未登入用戶若未登入則資料有可能遺失

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
