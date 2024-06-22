import { BaseCommand, createCli, options } from '../src';

export class InitCommand extends BaseCommand {
  static paths = ['init'];

  static meta = {
    name: 'init',
    description: 'Initialize a new Kurogashi project',
  };

  path = options.positional('path', {
    description: 'Path to initialize the project',
    required: false,
  });

  type = options.string('type', {
    description: 'Type of project to initialize <basic|module>',
    defaultValue: 'basic',
    short: 't',
  });

  noInstall = options.boolean('no-install', {
    description: 'Skip installing dependencies',
    defaultValue: false,
  });

  noGit = options.boolean('no-git', {
    description: 'Skip initializing git repository',
    defaultValue: false,
  });

  packageManager = options.string('package-manager', {
    description: 'Package manager to use <npm|yarn|pnpm|bun>',
    short: 'p',
  });

  root = options.string('root', {
    description: 'Root directory of the project',
    short: 'r',
  });

  async run() {
    console.log(this);
  }
}

const cli = createCli({
  appName: 'Create Kurogashi',
  binaryName: 'daw',
});

cli.run({
  rootCommand: InitCommand,
});
