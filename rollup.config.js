import pick                from 'lodash.pick';
import babel               from '@rollup/plugin-babel';
import generatePackageJson from 'rollup-plugin-generate-package-json';

let {main, module, name} = require('./package.json');

export default {
  input: 'src/index.js',
  output: [{
    format: 'umd',
    file: main,
    name
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
        [main, module] = [main, module].map((type) => type.replace('dist/', ''));
        return Object.assign(_package, {main, module});
      }
    })
  ]
};
