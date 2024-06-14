import { coloid, colorText } from 'coloid';
import { Command, Meta, MetaFactory } from './command.ts';
import { getCommandHelpMenu, getHelpMenu } from './menu.ts';
import { BooleanOption, PositionalOption } from './options.ts';
import { parseRawArgs } from './parser.ts';

export type CliMeta = {
  appName?: string;
  binaryName?: string;
  description?: string;
  version?: string;
  color?:
    | 'black'
    | 'red'
    | 'green'
    | 'yellow'
    | 'blue'
    | 'magenta'
    | 'cyan'
    | 'white'
    | 'orange';
};

export type CommandFactoryOptions = BooleanOption | PositionalOption;

export class CommandFactory {
  public readonly paths: Array<string> = [];
  private readonly _meta: MetaFactory = new MetaFactory();
  public run: (() => Promise<void> | void) | undefined;
  public options: Record<string, CommandFactoryOptions> = {};
  // @ts-expect-error Error
  public command: CommandFactory;
  public subcommands: CommandFactory[] = [];
  public __do_not__: boolean = false;

  constructor() {}

  setMeta(meta: Meta) {
    this._meta.setMeta(meta);
  }

  get meta() {
    return this._meta.meta;
  }

  addPath(path: string) {
    this.paths.push(path);
  }

  addOption(key: string, option: CommandFactoryOptions) {
    option.refKey = key;

    this.options[option.name] = option;
  }

  async setRun(run: () => Promise<void> | void) {
    this.run = run;
  }
}

export class Cli {
  commands: CommandFactory[] = [];
  _temp: Command[] = [];

  constructor(public meta: CliMeta = {}) {
    this.meta = {
      ...meta,
      color: meta.color || 'cyan',
    };
  }

  use(input: Command | Command[]) {
    const _use = (input: Command) => {
      this._temp.push(input);
    };

    if (Array.isArray(input)) {
      for (const command of input) {
        _use(command);
      }
    } else {
      _use(input);
    }
  }

  register() {
    this._temp = this._temp.sort((a, b) => {
      // @ts-expect-error TODO: Fix this
      return a.paths?.length - b.paths?.length;
    });

    for (const input of this._temp) {
      const command = new input();

      const commandFactory = new CommandFactory();

      if (input.meta) {
        commandFactory.setMeta(input.meta);
      }

      if (input.paths) {
        for (const path of input.paths) {
          commandFactory.addPath(path);
        }
      }

      for (const key in command) {
        // @ts-expect-error Error
        if (command[key].__option__) {
          // @ts-expect-error Error
          commandFactory.addOption(key, command[key]);
        }
      }

      commandFactory.setRun(
        command.run ??
          (async () => {
            coloid.error('Command not implemented');
          }),
      );

      if (commandFactory.paths.length === 1) {
        commandFactory.command = commandFactory;

        this.commands.push(commandFactory);
      } else {
        const parent = this.commands.find((command) => {
          return command;
        });

        if (parent) {
          parent.subcommands.push(commandFactory);
        } else {
          this.commands.push(commandFactory);
        }
      }
    }
  }

  async run(rawArgs?: string[]) {
    try {
      this.register();

      const args = rawArgs || process.argv.slice(2);
      const rootCommand = new CommandFactory();

      rootCommand.addPath('');

      rootCommand.subcommands = this.commands;
      rootCommand.__do_not__ = true;

      const command = this.resolveCommand(rootCommand, args);

      if (args.includes('--help') || args.includes('-h')) {
        this.showHelp(command);
        return;
      }

      if (args.includes('--version') || args.includes('-v')) {
        this.showVersion();
        return;
      }

      if (command?.__do_not__) {
        this.showHelp();
      }

      if (command) {
        await this.runCommand(command, args);
      } else {
        coloid.error('Command not found');
      }
    } catch (error) {
      coloid.error(error);
    }
  }

  async runCommand(command: CommandFactory, args: string[]) {
    const parsedArgs = parseRawArgs(args);

    // remove the command name from the positional arguments
    parsedArgs._ = parsedArgs._.slice(command.paths.length);

    const pos = parsedArgs._;

    const options = Object.entries(command.options).map(([key, value]) => {
      return value;
    });
    const positionals = options.filter((e) => e.type === 'positional');

    if (pos.length > positionals.length) {
      const extra = pos.slice(positionals.length);
      coloid.error(
        `Extra positional arguments: ${colorText(extra.join(', '), this.meta.color)}`,
      );
      return;
    }

    for (const key in command.options) {
      const option = command.options[key];
      const posIndex = positionals.findIndex((e) => e.name === key);
      let shortValue = option.options.short && parsedArgs[option.options.short];
      let value =
        option.type === 'positional'
          ? pos[posIndex]
          : // @ts-expect-error Error
            parsedArgs[key] || parsedArgs[option.options.short];

      if (shortValue && parsedArgs[key] && option.type !== 'array') {
        coloid.error(
          `Option ${colorText(key, this.meta.color)} and ${colorText(option.options.short, this.meta.color)} cannot be used together as they are the same option.`,
        );
        return;
      }

      if (option.type === 'boolean' && value) {
        value = Boolean(value);
      }

      if (option.type === 'array') {
        value = Array.isArray(value) ? value : [value];
        if (shortValue) {
          value = [
            ...value,
            ...(Array.isArray(shortValue) ? shortValue : [shortValue]),
          ];
        }
      }

      if (option.type === 'number' && value) {
        value = Number.parseFloat(value);

        if (Number.isNaN(value)) {
          coloid.error(
            `Option ${colorText(key, this.meta.color)} must be a number`,
          );
          return;
        }
      }

      if (value === undefined && option.options.initialValue !== undefined) {
        value = option.options.initialValue;
      }

      if (option.type === 'string' && Array.isArray(value)) {
        value = value.at(-1);
      }

      if (option.options.required && !value) {
        coloid.error(
          `${option.type === 'positional' ? 'Positional argument' : 'Option'} ${colorText(key, this.meta.color)} is required`,
        );
        return;
      }

      command.options[key] = value;
      // @ts-expect-error Error
      command[option.refKey] = value;
    }

    await command.run?.();
  }

  showHelp(command?: CommandFactory) {
    if (command) {
      const helpMenu = getCommandHelpMenu(this, command);

      return console.log(helpMenu);
    }

    const helpMenu = getHelpMenu(this);

    console.log(helpMenu);
  }

  showVersion() {
    let message = '';

    if (this.meta.appName) {
      message += `${this.meta.appName} running on`;
    }

    if (this.meta.version) {
      message += ` ${colorText('v' + this.meta.version, this.meta.color)}`;
    } else {
      throw new Error('Version is required');
    }

    coloid.info(message);
  }

  resolveCommand(
    cmd: CommandFactory,
    args: string[],
  ): CommandFactory | undefined {
    if (cmd.paths.length === 0) {
      return cmd;
    }

    const [path, ...rest] = args;

    const subcommand = cmd.subcommands.find((command) => {
      return command.paths.includes(path);
    });

    if (subcommand) {
      return this.resolveCommand(subcommand, rest);
    }

    return cmd;
  }
}

export const createCli = (meta?: CliMeta) => {
  return new Cli(meta);
};
