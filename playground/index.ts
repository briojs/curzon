import { BaseCommand, createCli, options } from '../src';

export class AddModuleCommand extends BaseCommand {
  static paths = ['modules', 'add'];

  static meta = {
    description: 'Add a new module to the project',
    examples: [['Add a new module to the project', 'modules add @kurojs/jwt']],
  };

  name = options.positional('name', {
    description: 'Name of the module to add',
    required: true,
  });

  async run() {
    const pkg = await this.fetchPackage();
  }

  async fetchPackage() {
    console.log(this.name);
  }
}

const cli = createCli({
  appName: 'Create Kurogashi',
  binaryName: 'daw',
});

cli.use(AddModuleCommand);

cli.run();
