import { colorText, createGradient, stringWidth } from 'coloid';
import { mainSymbols } from 'figures';
import { Cli, CommandFactory } from './cli.ts';

const indent = (text: string, repeat = 2) => `${' '.repeat(repeat)}${text}`;

const sectionTitle = (cli: Cli, text: string, center = true) => {
  const offset = process.stdout.columns - 2 - stringWidth(text);
  const titleLeft = createGradient(
    [cli.meta.color as string, 'white'],
    mainSymbols.lineBold.repeat(offset / 2),
  );
  const titleRight = createGradient(
    ['white', cli.meta.color as string],
    mainSymbols.lineBold.repeat(offset / 2),
  );

  if (offset < 0 || !center) {
    return `\n${colorText(mainSymbols.lineBold.repeat(5), cli.meta.color)} ${text}`;
  } else if (offset) {
    return `\n${titleLeft} ${text} ${titleRight}`;
  }
};

export const getHelpMenu = (cli: Cli) => {
  let lines = [];
  const title = `${cli.meta.appName} - v${cli.meta.version}`;

  lines.push(
    sectionTitle(cli, title),
    indent(colorText(`${mainSymbols.pointer} ${cli.meta.description}`, 'gray')),
    `\n${indent(`${colorText('$', cli.meta.color)} ${cli.meta.binaryName} <command> [arguments]`)} \n`,
  );

  const categories = getCategories(cli);

  lines.push(sectionTitle(cli, 'Commands'));
  for (const cmd of categories.without) {
    lines.push(
      indent(
        `${cli.meta.binaryName} ${cmd.paths.join(' ')} ${getArgumentsString(cmd)} \n ${indent(colorText(cmd.meta.description, 'gray'))}`,
      ),
    );
  }

  for (const category in categories.with) {
    lines.push(sectionTitle(cli, category, false));
    for (const cmd of categories.with[category]) {
      lines.push(
        indent(
          `${cli.meta.binaryName} ${cmd.paths.join(' ')} ${getArgumentsString(cmd)} \n ${indent(colorText(cmd.meta.description, 'gray'))}`,
        ),
      );
    }
  }

  return lines.join('\n');
};

export const getArgumentsString = (cmd: CommandFactory) => {
  const options = Object.entries(cmd.options)
    .map(([key, value]) => value)
    .sort((a, b) => {
      return a.type === 'positional' ? -1 : 1;
    });

  const args = options.map((e: any) => {
    return e.type === 'positional'
      ? `${e.options.required ? '<' : '['}${
          e.name
        }${e.options.required ? '>' : ']'}`
      : `--${e.name}${e.options.short ? `,-${e.options.short}` : ''}`;
  });

  return args.join(' ');
};

export const getCategories = (cli: Cli) => {
  const categories = cli.commands.map((e) => e.meta.category).filter(Boolean);
  const _categories: Record<string, CommandFactory[]> = {};

  for (const category of categories) {
    _categories[category] = cli.commands.filter(
      (e) => e.meta.category === category,
    );
  }

  const without = cli.commands.filter(
    (e) => !e.meta.category || e.meta.category === '',
  );

  return {
    with: _categories,
    without,
  };
};

export const getCommandHelpMenu = (cli: Cli, command: CommandFactory) => {
  let lines = [];

  lines.push(
    sectionTitle(cli, command.paths.join(' ')),
    indent(
      colorText(`${mainSymbols.pointer} ${command.meta.description}`, 'gray'),
    ),
    `\n${indent(`${colorText('$', cli.meta.color)} ${cli.meta.binaryName} ${command.paths.join(' ')} ${getArgumentsString(command)}`)} \n`,
  );

  if (Object.keys(command.options).length > 0) {
    lines.push(sectionTitle(cli, 'Options', false));
    for (const key in command.options) {
      const option = command.options[key];
      const name =
        option.type === 'positional'
          ? option.name
          : `--${option.name}${option.options.short ? `, -${option.options.short}` : ''}`;

      lines.push(
        indent(
          `${name} ${colorText(
            option.options.required ? '(required)' : '(optional)',
            cli.meta.color,
          )} \n ${indent(colorText(option.options.description, 'gray'), 4)}`,
        ),
      );
    }
  }

  if (command.meta.details) {
    lines.push(
      sectionTitle(cli, 'Details', false),
      `\n${command.meta.details}`,
    );
  }

  if (command.meta.examples.length > 0) {
    lines.push(sectionTitle(cli, 'Examples', false));
    for (const example of command.meta.examples) {
      lines.push(
        indent(
          `\n${colorText('$', cli.meta.color)} ${cli.meta.binaryName} ${example[1]} \n ${indent(colorText(example[0], 'gray'))}`,
        ),
      );
    }
  }
  lines.push('');

  return lines.join('\n');
};
