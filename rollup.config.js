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

const entry = 'src/main.js';
const main = Object.assign({}, common, {
  entry: entry,
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
  entry: 'fts/Facets.js',
  moduleName: 'Facets',
  dest: 'public/Facets.js',
});

const bundle = fts;
console.log('Bundling '+bundle.entry+' to '+bundle.dest+', format='+bundle.format);

export default bundle;
