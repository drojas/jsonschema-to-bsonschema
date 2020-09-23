const yargs = require('yargs');
const json2bson = require('./index');

const argv = yargs.option('files', {
    alias: 'f',
    type: 'string',
    description: 'Path/pattern to file(s) to convert from JSON schema to BSON (MongoDB) schema. Defaults to "*.json".'
}).option('workingDirectory', {
    alias: 'w',
    type: 'string',
    description: 'Current working directory for dereferencing files.'
}).option('exclude', {
    alias: 'e',
    type: 'string',
    description: '{Include later}'
}).option('outdir', {
    alias: 'o',
    type: 'string',
    description: 'Output directory for the parsed file(s). Defaults to same directory as each of the input files if not specified.'
}).option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Include verbose logs.'
}).option('break', {
    alias: 'b',
    type: 'boolean',
    description: 'Break if any of the JSON schemas is invalid.'
}).options('connectionString', {
    alias: 'c',
    type: 'string',
    description: 'The connection string for deploying the parsed MongoDB validated, dereferenced JSON schemas.'
}).options('deploy', {
    alias: 'd',
    type: 'boolean',
    description: 'Flag to determine whether or not to attempt to deploy the validated schemas to the supplied connection string'
}).options('input', {
    alias: 'i',
    type: 'string',
    description: 'The glob string for the input schemas for deployment to the specified connection string.'
}).options('addIndices', {
    alias: 'a',
    type: 'boolean',
    description:'Attempt to add indices from the MongoDB schemas, extended to add uniqueness etc.'
}).argv;

(async () => {
  try {
    await json2bson.convert(argv.files, argv.outdir, {
      verbose: argv.verbose,
      breakOnSchemaValidationErrors: argv.break,
      cwd: argv.workingDirectory
    })
  } catch (ex) {
    console.error(ex);
  }

  if (!argv.deploy) return;
  try {
    await json2bson.deploy(argv.input, { connectionString: argv.connectionString })
    if (argv.addIndices) {
      await json2bson.addIndices(argv.input);
    };
  } catch (ex) {
    console.error(ex);
  }
})()
