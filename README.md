# PexnetHub

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.4.

This is a multi-project Angular workspace that includes:
- **pexnet-hub**: The main hub application
- **pexnet-wordle**: A Wordle game implementation (submodule)

## Submodules

This project includes the PexNet Wordle game as a git submodule. The submodule is located in `projects/pexnet-wordle/`.

### Working with Submodules

When cloning this repository, use the `--recursive` flag to also clone the submodule:

```bash
git clone --recursive https://github.com/pexilo/pexnet-hub.git
```

If you've already cloned the repository, initialize and update the submodule:

```bash
git submodule init
git submodule update
```

To update the submodule to the latest version:

```bash
git submodule update --remote
```

## Development server

### 🚀 Quick Start (Recommended)

To start both the hub and Wordle game servers simultaneously:

```bash
npm run start:both
```

This will start:
- **Main hub** on `http://localhost:4200` 
- **Wordle game** on `http://localhost:4201`

Then click the 🌍 **Wordle** icon in the header to play the game in fullscreen mode!

### Individual Servers

#### Main Hub Application

To start only the main hub development server:

```bash
npm start
# or
ng serve
```

#### Wordle Game

To start only the Wordle game development server:

```bash
npm run start:wordle
# or
ng serve pexnet-wordle
```

Once either server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building the Projects

### Build Main Hub

```bash
npm run build
# or
ng build pexnet-hub
```

### Build Wordle Game

```bash
npm run build:wordle
# or
ng build pexnet-wordle
```

## Running Tests

### Test Main Hub

```bash
npm test
# or
ng test pexnet-hub
```

### Test Wordle Game

```bash
npm run test:wordle
# or
ng test pexnet-wordle
```

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
