import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import postcss from 'rollup-plugin-postcss';
import svg from 'rollup-plugin-svg';

const common = {
  format: 'iife',
  plugins: [
    postcss({extract: true,}),
    svg(),
    sourcemaps(),
    resolve(),
    commonjs(),
  ]
};

const main = Object.assign({}, common, {
  entry: 'src/main.js',
  dest: 'public/index.js',
  sourceMap: true,
  external: [
    'facets-js',
    'react',
    'react-dom'
  ],
  globals: {
    'facets-js': 'Facets',
    'react':'React',
    'react-dom':'ReactDOM'
  },
});
const fts = Object.assign({}, common, {
  sourceMap: true,
  entry: 'fts/Facets.js',
  moduleName: 'Facets',
  dest: 'public/Facets_.js',
});

const bundle = false?fts:main;
console.log('Bundling '+bundle.entry+' to '+bundle.dest+', format='+bundle.format);

export default bundle;
