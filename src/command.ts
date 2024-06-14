export type Meta = {
  description?: string;
  usage?: string;
  examples?: Array<Array<string>>;
  category?: string;
  details?: string;
};

export class MetaFactory {
  meta: {
    description: string;
    usage: string;
    examples: Array<Array<string>>;
    category: string;
    details: string;
  } = {
    description: '',
    usage: '',
    examples: [],
    category: '',
    details: '',
  };

  constructor() {}

  setMeta(meta: Meta) {
    this.meta.description = meta.description ?? '';
    this.meta.usage = meta.usage ?? '';
    this.meta.examples = meta.examples ?? [];
    this.meta.category = meta.category ?? '';
    this.meta.details = meta.details ?? '';
  }
}

export type Command = {
  new (): BaseCommand;
  paths?: Array<string>;
  meta?: Meta;
};

export abstract class BaseCommand {
  declare ['constructor']: Command;

  static paths?: Array<string>;
  static meta?: Meta;

  abstract run(): Promise<void> | void;
}
