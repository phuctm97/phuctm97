# Contributing

## Requirements

- [pnpm] `v9`

- [Node.js] `v20`

- [Visual Studio Code]

- [Google Chrome]

## Scripts

- Install dependencies

  ```
  pnpm install
  ```

- Clean outputs

  ```
  pnpm clean
  ```

- Format code

  ```
  pnpm format
  ```

- Typecheck code

  ```
  pnpm tsc
  ```

- Lint code

  ```
  pnpm lint
  ```

- Build code

  ```
  pnpm build
  ```

- Run code in development mode

  ```
  pnpm dev
  ```

- Run code in production mode

  ```
  pnpm start
  ```

## Visual Studio Code Tips

### Debug

[Debugging in Visual Studio Code](https://code.visualstudio.com/docs/editor/debugging) is supported and has great developer experiences, e.g. [breakpoints](https://code.visualstudio.com/docs/editor/debugging#_breakpoints), [logpoints](https://code.visualstudio.com/docs/editor/debugging#_logpoints), [data inspection](https://code.visualstudio.com/docs/editor/debugging#_data-inspection), [etc.](https://code.visualstudio.com/docs/editor/debugging#_advanced-breakpoint-topics)

See [Develop](#develop) for specific instructions on how to debug various scenarios in Visual Studio Code.

<!-- prettier-ignore -->
> [!NOTE]
> Due to lazy compilation, Visual Studio Code may temporarily display _Unbound breakpoint_ icons in source files until they are successfully compiled.

### Develop

Instead of running `pnpm dev` in CLI, developing in Visual Studio Code is supported and has better developer experiences.

To develop in Visual Studio Code:

1. Select the _Run and Debug_ icon in the _Activity Bar_ navigation

2. Select the _Next.js_ option in the _Run and Debug_ dropdown

3. Click the _Start Debugging_ button

Visual Studio Code will automatically start the Next.js development server and open the Next.js development URL in Google Chrome for debugging.

<!-- prettier-ignore -->
> [!IMPORTANT]
> If Google Chrome is running, it must be quit (`Command/Ctrl+Q`) before it can be opened for debugging.

### Run Scripts

Instead of running [scripts](#scripts) in CLI, running scripts in Visual Studio Code is supported and has better developer experiences.

To run scripts in Visual Studio Code

1. Open the _Command Pallete_ (`Command/Ctrl+Shift+P`)

2. Filter on _Run Task_ to see various task-related commands:

   - _Tasks: Run Build Task_ － Run build script
   - _Tasks: Run Test Task_ － Run test script
   - _Tasks: Run Task_ － Run script (`pnpm clean`, `pnpm format`, etc.)

[pnpm]: https://pnpm.io
[node.js]: https://nodejs.org
[visual studio code]: https://code.visualstudio.com
[google chrome]: https://www.google.com/chrome
