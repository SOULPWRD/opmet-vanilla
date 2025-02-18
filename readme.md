# OPMET

This is the implementation of the homework task for the [iblsoft.com](https://www.iblsoft.com/) company.

## Description

The whole app is written in vanilla javascript. It uses a [tiny wrapper](https://github.com/jamesdiacono/ui.js) around [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) for building any web applications of any size.
It also uses an interactive [Replete.js](https://repletejs.org/) environment for [REPL](https://www.youtube.com/watch?v=gIoadGfm5T8) driven development.

In order to run Replete make sure you have [Nodejs](https://nodejs.org/en/download) and [Deno](https://docs.deno.com/runtime/#install-deno) installed locally.

## Conventions

The whole codebase is linted by [JSLint](https://www.jslint.com/). Name of the identifiers are written with _snake_case_ for better readability.

Individual tests and demos exist within the files. There's no separation of concerns. This is called [Whole Modules](https://james.diacono.com.au/whole_modules.html).

It is dependency free.

## Serving index.html

In order to run index.html, run following command `npx serve` in your terminal.

### Enjoy.

