import { BaseCommand, Meta } from '../src';
import { createCli } from '../src/cli.ts';
import { options } from '../src/options.ts';

class HelloCommand extends BaseCommand {
  static paths = ['test', 'hello'];

  static meta: Meta = {
    description: 'This command will say hello to you.',
  };

  name = options.positional('name');

  'no-tsconfig' = options.boolean('no-tsconfig', {
    initialValue: false,
    description: 'Do not write the tsconfig file',
  });

  async run() {
    console.log(`helooooooo ${this.name} ${this['no-tsconfig']}!`);
  }
}

class GoodbyeCommand extends BaseCommand {
  static paths = ['test', 'goodbye'];

  static meta: Meta = {
    description: 'This command will say goodbye to you.',
  };

  async run() {
    console.log('Goodbye, world!');
  }
}

class ByeCommand extends BaseCommand {
  static paths = ['test', 'goodbye', 'bye'];

  static meta: Meta = {
    description: 'This command will say goodbye byeee to you.',
  };

  pos = options.positional('pos');

  async run() {
    console.log('Goodbye, world!');
  }
}

class WhyCmd extends BaseCommand {
  static paths = ['test', 'goodbye', 'bye', 'why'];

  static meta: Meta = {
    description: 'This command will say whyyyyyy to you.',
  };

  async run() {
    console.log('Goodwhy, world!');
  }
}

class RootCommand extends BaseCommand {
  static meta: Meta = {
    description: `create a new package`,
    details: `This command will setup a new package in your local directory.`,
    examples: [[`Create a new package in the local directory`, `bun init`]],
  };

  pos = options.positional('pos');

  test = options.string('test', {
    required: false,
    description: 'This is a test option',
  });

  number = options.number('number', {
    required: false,
    description: 'This is a number option',
  });

  isTrue = options.boolean('isTrue', {
    required: false,
    description: 'This is a boolean option',
    short: 't',
  });

  array = options.array('array', {
    required: false,
    description: 'This is an array option',
  });

  async run() {
    console.log(`This is the root command: ${this.test}`);
  }
}

const cli = createCli({
  appName: 'Kurogashi',
  description: 'Beautiful color gradients in terminal output',
  version: '1.0.03',
  binaryName: 'kuro',
  color: 'yellow',
});

cli.use([HelloCommand, GoodbyeCommand, ByeCommand, WhyCmd]);

cli.run();
