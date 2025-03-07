// This config is used when running `server.js`.

import lwc from '@lwc/rollup-plugin';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import simpleRollupConfig from'./rollup.config.js';

const ENV = process.env.NODE_ENV ?? 'development';


export default [
  // Client-only build.
  simpleRollupConfig({ watch: false }),

  // Client build to rehydrate after SSR.
  {
    input: 'src/entry-client-ssr.js',
    output: {
      file: 'dist/entry-rehydrate.js',
      format: 'cjs',
      inlineDynamicImports: true,
    },
    plugins: [
      lwc(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(ENV),
        'import.meta.env.SSR': 'false',
        preventAssignment: true,
      }),
    ],
    watch: {
      exclude: ["node_modules/**"]
    }
  },

  // Component compiled with SSRv2. For import during server-side rendering.
  {
    input: 'src/app.js',
    output: {
      file: 'dist/app-v2.js',
      format: 'esm',
      inlineDynamicImports: true,
    },
    external: [
      '@lwc/ssr-runtime',
    ],
    plugins: [
      alias({
        entries: [{
          find: 'lwc',
          replacement: '@lwc/ssr-runtime',
        }],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'import.meta.env.SSR': 'true',
        preventAssignment: true,
      }),
      lwc({
        targetSSR: true,
        ssrMode: 'sync',
      }),
    ].filter(Boolean),
    watch: {
      exclude: ["node_modules/**"]
    }
  },

  // Component compiled with SSRv1. For import during server-side rendering.
  {
    input: 'src/app.js',
    output: {
      file: 'dist/app-v1.js',
      format: 'esm',
      inlineDynamicImports: true,
    },
    external: [
      '@lwc/engine-server'
    ],
    plugins: [
      alias({
        entries: [{
          find: 'lwc',
          replacement: '@lwc/engine-server',
        }],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'import.meta.env.SSR': 'true',
        preventAssignment: true,
      }),
      lwc(),
    ].filter(Boolean),
    watch: {
      exclude: ["node_modules/**"]
    }
  },
];
