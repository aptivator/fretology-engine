import pick                from 'lodash.pick';
import babel               from '@rollup/plugin-babel';
import generatePackageJson from 'rollup-plugin-generate-package-json'

let {main, module, name} = require('./package.json');

export default {
  input: 'src/index.js',
  external: ['lodash.setwith'],
  output: [{
    format: 'umd',
    file: main,
    name,
    globals: {
      'lodash.setwith': 'setWith'
    }
  }, {
    format: 'es',
    file: module,
    name
  }],
  plugins: [
    babel({babelHelpers: 'bundled'}),
    generatePackageJson({
      baseContents(packageJson) {
        let fields = ['name', 'version', 'description', 'dependencies', 'peerDependencies'];
        let _package = pick(packageJson, fields);

        return Object.assign(_package, {
          main: main.replace('dist/', ''),
          module: module.replace('dist/', '')
        });
      }
    })
  ]
};
