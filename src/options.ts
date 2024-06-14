import defu from 'defu';

export type GeneralOptions<T = any> = {
  initialValue?: T;
  required?: boolean;
  description?: string;
  short?: string;
};

export type OptionType = 'boolean' | 'positional' | 'array' | 'string';

export class Options<T = any> {
  // This field is used to identify if field is an Option
  __option__ = true;
  static name: string;
  type: OptionType;
  options: T;
  refKey: string = '';

  constructor(options: T, type: OptionType) {
    this.options = options;
    this.type = type;
  }
}

export type BooleanOptions = GeneralOptions<boolean>;

export class BooleanOption extends Options<BooleanOptions> {
  constructor(
    public name: string,
    options?: BooleanOptions,
  ) {
    super(
      defu(options, {
        initialValue: false,
        required: false,
      }),
      'boolean',
    );
  }
}

export class PositionalOption extends Options<GeneralOptions> {
  constructor(
    public name: string,
    options?: GeneralOptions,
  ) {
    super(
      defu(options, {
        initialValue: undefined,
        required: true,
      }),
      'positional',
    );
  }
}

export class ArrayOption extends Options<GeneralOptions> {
  constructor(
    public name: string,
    options?: GeneralOptions,
  ) {
    super(
      defu(options, {
        initialValue: [],
        required: false,
      }),
      'array',
    );
  }
}

export class StringOption extends Options<GeneralOptions> {
  constructor(
    public name: string,
    options?: GeneralOptions,
  ) {
    super(
      defu(options, {
        initialValue: '',
        required: false,
      }),
      'string',
    );
  }
}

export const options = {
  boolean: (name: string, options?: BooleanOptions) =>
    new BooleanOption(name, options) as unknown as boolean,
  positional: (name: string, options?: GeneralOptions) =>
    new PositionalOption(name, options) as unknown as string,
  array: <T = any>(name: string, options?: GeneralOptions) =>
    new ArrayOption(name, options) as unknown as T[],
  string: (name: string, options?: GeneralOptions) =>
    new StringOption(name, options) as unknown as string,
};
