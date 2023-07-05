// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// import packageJson from '../../package.json';

export const environment = {
  appVersion: '001-dev', //packageJson.version + '-dev',
  production: false,
  API_URL: 'https://191.101.233.242:8080'
};
