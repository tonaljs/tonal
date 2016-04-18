import babel from 'rollup-plugin-babel';

export default {
  moduleName: 'noteMidi',
  entry: 'index.js',
  dest: 'dist/index.js',
  format: 'umd',
  plugins: [ babel() ]
};
