// This config is used when running the dev server with live reload.

import lwc from '@lwc/rollup-plugin';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const __ENV__ = process.env.NODE_ENV ?? 'development';

export default (args) => ({
  input: 'src/entry-client.js',
  output: {
    file: 'dist/entry-client.js',
    format: 'esm',
    inlineDynamicImports: true,
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(__ENV__),
      'import.meta.env.SSR': 'false',
      'process.env.SKIP_LWC_VERSION_MISMATCH_CHECK': 'false',
      preventAssignment: true,
    }),
    lwc(),
    args.watch &&
      serve({
        open: false,
        port: 3000,
      }),
    args.watch && livereload(),
  ],
});
