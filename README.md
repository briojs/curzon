## curzon

[![npm version](https://img.shields.io/npm/v/curzon?color=yellow)](https://npmjs.com/package/curzon)
[![npm downloads](https://img.shields.io/npm/dm/curzon?color=yellow)](https://npmjs.com/package/curzon)
[![bundle size](https://img.shields.io/bundlephobia/minzip/curzon?color=yellow)](https://bundlephobia.com/package/curzon)
[![license](https://img.shields.io/github/license/briojs/curzon?color=yellow)](https://github.com/briojs/curzon/blob/main/LICENSE)

### Install

```sh
# npm
npm install curzon

# yarn
yarn add curzon

# pnpm
pnpm install curzon

# bun
bun install curzon
```

### Usage

```ts
class HelloCommand extends BaseCommand {
  static paths = ['test', 'hello'];

  static meta: Meta = {
    description: 'This command will say hello to you.',
  };

  name = options.positional('name');

  async run() {
    console.log(`helooooooo ${this.name}!`);
  }
}

const cli = createCli({
  appName: 'Greeting Tool!',
  description: 'Tool for greeting people.',
  version: '1.0.03',
  binaryName: 'greet',
  color: 'yellow',
});

cli.use([HelloCommand]);

cli.run();
```

### Root command
This can be useful when you want to create a Posix-like tool.

```ts
class RootCommand extends BaseCommand {
  static meta: Meta = {
    description: 'This is the root command.',
  };

  async run() {
    console.log('This is the root command.');
  }
}

const cli = createCli({
  appName: 'Greeting Tool!',
  description: 'Tool for greeting people.',
  version: '1.0.03',
  binaryName: 'greet',
  color: 'yellow',
});

cli.run({
  rootCommand: RootCommand,
});
```

By default, help menu will be shown for the root command, if any other command is not specified. 
Normally help menu for the whole cli would be shown.

### Paths

Commands are matched using `paths` property. 

```ts
class HelloCommand extends BaseCommand {
  static paths = ['test', 'hello'];

  async run() {
    console.log('Hello!');
  }
}

class TestCommand extends BaseCommand {
  static paths = ['test'];

  async run() {
    console.log('Test!');
  }
}
```

```shell
$ greet test hello # Hello!
```

```shell
$ greet test # Test!
```

#### With positional arguments

```ts
class TestCommand extends BaseCommand {
  static paths = ['test', 'hello'];

  async run() {
    console.log(`Hello test!`);
  }
}
```

```ts
class HelloCommand extends BaseCommand {
  static paths = ['test'];

  name = options.positional('name');

  async run() {
    console.log(`Hello ${this.name}!`);
  }
}
```

Positional arguments will work with `HelloCommand` only if they don't match the `paths` of `TestCommand`.

```shell
$ greet test hello # Hello test!
```

```shell
$ greet test john # Hello john!
```

### Theme

You can specify a theme color for your CLI in the `createCLI`. 

### Options

Available options:
- `boolean`
```ts
class HelloCommand extends BaseCommand {
  static paths = ['test', 'hello'];

  test = options.boolean('test', {
      short: 't',
  });

  async run() {}
}
```

```shell
$ greet test hello --test # or -t
```

- `positional`
```ts
class HelloCommand extends BaseCommand {
  static paths = ['test', 'hello'];

  name = options.positional('name');

  async run() {}
}
```

```shell
$ greet test hello john
```

> [!NOTE]
> Order of positional arguments corresponds to the order of their declaration in the class.

- `string`
```ts
class HelloCommand extends BaseCommand {
  static paths = ['test', 'hello'];

  name = options.string('name', {
      short: 'n',
  });

  async run() {}
}
```

```shell
$ greet test hello --name john # or -n john, or --name="john"
```

- `number`
```ts
class HelloCommand extends BaseCommand {
  static paths = ['test', 'hello'];

  age = options.number('age', {
      short: 'a',
  });

  async run() {}
}
```

```shell
$ greet test hello --age 20 # or -a 20
```

Number is parsed using `parseFloat` function and then checked if it's not `NaN`.

- `array`
```ts
class HelloCommand extends BaseCommand {
  static paths = ['test', 'hello'];

  names = options.array('names', {
      short: 'n',
  });

  async run() {}
}
```

```shell
$ greet test hello --names john --names alice # or -n john -n alice
```

Published under the [MIT](https://github.com/briojs/curzon/blob/main/LICENSE) license.
Made by [@malezjaa](https://github.com/briojs)
and [community](https://github.com/briojs/curzon/graphs/contributors) 💛
<br><br>
<a href="https://github.com/briojs/curzon/graphs/contributors">
<img src="https://contrib.rocks/image?repo=briojs/curzon" />
</a>

