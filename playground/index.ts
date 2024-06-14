import { BaseCommand, Meta } from '../src';
import { createCli } from '../src/cli.ts';
import { options } from '../src/options.ts';

class TestCommand extends BaseCommand {
  static paths = ['test'];

  static meta: Meta = {
    description:
      'This command will setup a new package in your local directory.',
    details: `
This command will setup a new package in your local directory.

If the \`-p,--private\` or \`-w,--workspace\` options are set, the package will be private by default.

If the \`-w,--workspace\` option is set, the package will be configured to accept a set of workspaces in the \`packages/\` directory.

If the \`-i,--install\` option is given a value, Yarn will first download it using \`yarn set version\` and only then forward the init call to the newly downloaded bundle. Without arguments, the downloaded bundle will be \`latest\`.

The initial settings of the manifest can be changed by using the \`initScope\` and \`initFields\` configuration values. Additionally, Yarn will generate an EditorConfig file whose rules can be altered via \`initEditorConfig\`, and will initialize a Git repository in the current directory.
    `,
    examples: [
      [`Create a new package in the local directory`, `init`],
      [`Create a new private package in the local directory`, `init -p`],
      [
        `Create a new package and store the Yarn release inside`,
        `init -i=latest`,
      ],
      [
        `Create a new private package and defines it as a workspace root`,
        `init -w`,
      ],
    ],
  };

  name = options.positional('name', {
    description: 'The name of the package',
    required: true,
  });

  package = options.string('package', {
    description: 'The package manager to use',
    required: true,
    short: 'p',
  });

  isTest = options.boolean('test', {
    description: 'Run the test suite',
    short: 't',
    initialValue: true,
  });

  number = options.number('number', {
    description: 'A number option',
    required: true,
    short: 'n',
  });

  async run() {
    console.log(
      `Hello, ${this.name}! You are using ${this.package} package manager and your test suite is ${this.isTest ? 'enabled' : 'disabled'}. The number is ${this.number}.`,
    );
  }
}

class HelloCommand extends BaseCommand {
  static paths = ['hello'];
  static meta = {
    description: 'Prints a hello message',
    category: 'Greeting',
  };

  async run() {
    console.log('Hello, World!');
  }
}

class GoodbyeCommand extends BaseCommand {
  static paths = ['goodbye'];
  static meta = {
    description: 'Prints a goodbye message',
    category: 'Greeting',
  };

  arr = options.array<string | number>('arr', {
    description: 'An array option',
    required: true,
    short: 'a',
  });

  async run() {
    console.log(this.arr);
  }
}

class AddCommand extends BaseCommand {
  static paths = ['add'];
  static meta = {
    description: 'Adds two numbers',
    category: 'Math',
  };

  num1 = options.string('num1', {
    description: 'The first number',
    required: true,
  });

  num2 = options.string('num2', {
    description: 'The second number',
    required: true,
  });

  async run() {
    console.log(`The sum is: ${this.num1 + this.num2}`);
  }
}

class SubtractCommand extends BaseCommand {
  static paths = ['subtract'];
  static meta = {
    description: 'Subtracts two numbers',
    category: 'Math',
  };

  num1 = options.string('num1', {
    description: 'The first number',
    required: true,
  });

  num2 = options.string('num2', {
    description: 'The second number',
    required: true,
  });

  async run() {
    console.log(`The difference is: ${Number(this.num1) - Number(this.num2)}`);
  }
}

const cli = createCli({
  appName: 'Kurogashi',
  description: 'Beautiful color gradients in terminal output',
  version: '1.0.03',
  binaryName: 'kuro',
  color: 'yellow',
});

cli.use([
  TestCommand,
  HelloCommand,
  GoodbyeCommand,
  AddCommand,
  SubtractCommand,
]);
cli.run();
