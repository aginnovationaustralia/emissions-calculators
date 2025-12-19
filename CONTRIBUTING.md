# How to Contribute

## Terms and Conditions

By providing a contribution to us, you agree to be bound by the terms and conditions contained in the AIA EAP Open Source Code Contributor Licence Agreement.

All community members are expected to understand and respect out code of conduct. Our code of conduct is based on the Contributor Covenant.

## Open Development

All work on this project takes place on [GitHub](/). Both core maintainers and external contributors send pull requests which go through the same review process.

## Acceptance and review of changes

Hosting this work as an open source project allows transparency into the implementation of the tools, and collaboration on development and improvements. All contributions will need to follow the process outlined here. The primary role of this project is to offer an open source implementation of the reference calculations. Core maintainers will need to ensure that all changes remain consistent with that goal.

### Workflow and Pull Requests

_Before_ submitting a pull request, please make sure the following is done.

1.  Fork the repo and create your branch from `main`, or the relevant release branch if the changes are for a specific upcoming version. A guide on how to fork a repository: https://help.github.com/articles/fork-a-repo/

    Open terminal (e.g. Terminal, iTerm, Git Bash or Git Shell) and type:

    ```sh-session
    $ git clone https://github.com/<your_username>/emissions-calculators
    $ cd emissions-calculators
    $ git checkout -b my_branch
    ```

    Note: Replace `<your_username>` with your GitHub username

1.  This repo uses [pnpm](https://pnpm.io/) for running development scripts. If you haven't already done so, please follow their installation [instructions](https://pnpm.io/installation).

    To check your version of Python and ensure it's installed you can type:

    ```sh
    python --version
    ```

1.  Make sure you have a compatible version of `node` installed. The current minimum required version is `v22.19.0`. To help manage your `node` version, you might want to consider using [nvm](https://www.nvmnode.com).

    ```sh
    node -v
    ```

1.  Run `pnpm install`.

    ```sh
    pnpm install
    ```

1.  Run `pnpm build` to transpile TypeScript to JavaScript and type check the code

    ```sh
    pnpm build
    ```

1.  If you've added code that should be tested, add tests.

    ```sh
    pnpm test
    ```

1.  Once you're happy with your changes and all tests are passing, [open a pull request](https://github.com/aginnovationaustralia/emissions-calculators/compare) and fill in the template, providing as much detail and context as you can.

#### Changelog entries

All changes functional changes to the repo require a changelog entry containing the names of the packages affected, a description of the change, and the number of and link to the pull request. Try to match the structure of the existing entries.

For significant changes to the documentation and things like cleanup, refactoring, and dependency updates, the "Chore & Maintenance" section of the changelog can be used.

You can add or edit the changelog entry in the GitHub web interface once you have opened the pull request and know the number and link to it.

#### Testing

Code that is written needs to be tested to ensure that it achieves the desired behaviour. Tests either fall into a unit test or an integration test.

##### Unit tests

Some of the code within the repo have a test file alongside the code file in the same directory, with a filename like `<filename>.spec.ts` directory. This is where unit tests reside in. If the scope of your work only requires a unit test, this is where you will write it in. Tests here usually don't require much of any setup.

##### Integration tests

Tests with a wider scope can be located in a dedicated test folder. This is useful for things like checking the results of a full calculation. These tests are essential for maintaining the correctness of the tools here. These tests will sometimes require more detailed inputs or other setup resources.

For now all tests can be executed by invoking `pnpm test`.

## Bugs

### Where to Find Known Issues

We will be using GitHub Issues for our public bugs. We will keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new issue, try to make sure your problem doesn't already exist.

### Reporting New Issues

The best way to get your bug fixed is to provide a reduced test case. Please provide a public repository with a runnable example.

## Code Conventions

- Where possible, coding styles and standards are captured and enforced with tools (eslint and prettier)
- If something has been unclear we should capture it with new eslint rules
- If you're ensure, try to maintain consistent with the style of existing surrounding code

## License

By contributing to this project, you agree that your contributions will be licensed under its [Create Commons license](./LICENSE).

## Publishing a new release

The process to publish packages is wrapped up with a few top level commands:

```bash
pnpm run version:bump
pnpm run publish:dry
pnpm run publish:packages
```

This will require you to authenticate, then will publish the new version to the NPM registry.
