import { BaseCommand, Meta } from '../src';
import { createCli } from '../src/cli.ts';
import { options } from '../src/options.ts';

class HelloCommand extends BaseCommand {
  static paths = ['test', 'hello'];

  static meta: Meta = {
    description: 'This command will say hello to you.',
  };

  port = options.number('port', {
    defaultValue: 3000,
    description: 'Port to run the server on',
    short: 'p',
  });

  host = options.string('host', {
    defaultValue: 'localhost',
    description: 'Host to run the server on',
    short: 'h',
  });

  key = options.string('key', {
    description: 'Path to TLS key',
  });

  cert = options.string('cert', {
    description: 'Path to TLS cert',
  });

  passphrase = options.string('passphrase', {
    description: 'Passphrase used for TLS key or keystore',
  });

  ca = options.string('ca', {
    description: 'Path to root CA certificate',
  });

  dhParamsFile = options.string('dh.params.file', {
    description: 'Path to Diffie Hellman parameters',
  });

  serverName = options.string('server.name', {
    description: 'Server name for SNI',
  });

  open = options.boolean('open', {
    description: 'Open the server in the default browser',
    short: 'o',
  });

  lowMemoryMode = options.boolean('low.memory', {
    description:
      'This sets OPENSSL_RELEASE_BUFFERS to 1. It reduces overall performance but saves some memory.',
    short: 'lw',
  });

  requestCert = options.boolean('request.cert', {
    description:
      'If set to true, the server will request a client certificate. Default is false.',
    defaultValue: false,
  });

  async run() {
    console.log(this);
  }
}

const cli = createCli({
  appName: 'Kurogashi',
  description: 'Beautiful color gradients in terminal output',
  version: '1.0.03',
  binaryName: 'kuro',
  color: 'yellow',
});

cli.use([HelloCommand]);

cli.run();
