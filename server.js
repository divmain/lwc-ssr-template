// eslint-disable no-console

import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import express from 'express';
import * as rollup from 'rollup';
import prettier from 'prettier';
import htmlEntities from 'html-entities';
import engineServer from '@lwc/engine-server';
import ssrRuntime from '@lwc/ssr-runtime';
import lwcRollupPlugin from '@lwc/rollup-plugin';

import rollupConfig from './rollup-server.config.js';
import { formatHTML } from './util/formatHtml.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = 3000;
const app = express();
app.use(express.static('dist'));

const htmlTemplate = ({ ver, markup, prettifiedMarkup, compiledComponentCode, props }) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Server-Rendered Component</title>
    <style>
      .container {
        margin: 16px;
        padding: 16px;
        border-style: solid;
        border-width: 2px;
        border-color: black;
      }
      pre {
        overflow-x: auto;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <h3>Rendered Component (SSR${ver})</h3>
    <div class="container">
      <div id="main">
          ${markup}
      </div>
    </div>
    <hr />
    <h3>Prettified SSR${ver} Markup:</h3>
    <div class="container">
      <pre>${prettifiedMarkup}</pre>
    </div>
    <hr />
    <h3>Compiled Component Code (${ver}):</h3>
    <div class="container">
      <pre>${compiledComponentCode}</pre>
    </div>
  </body>
  <script>
    window.lwcRuntimeFlags = window.lwcRuntimeFlags || {};
    window.lwcRuntimeFlags.ENABLE_LIGHT_DOM_COMPONENTS = true;
  </script>
  <script type="text/javascript">window.APP_PROPS = ${props}</script>
  <script src="/entry-rehydrate.js"></script>
</html>
`;

const rootComponentPropsPath = path.resolve(__dirname, 'src/rootProps.json');
const getCompiledComponentPath = (ver) => path.resolve(__dirname, `./dist/app-${ver}.js`);
const getRootComponentProps = (req) => req.query.props
  ? JSON.parse(req.query.props)
  : JSON.parse(fs.readFileSync(rootComponentPropsPath, 'utf8'));

async function renderMarkup(ver, props) {
  const compiledComponentPath = getCompiledComponentPath(ver);

  const cmp = (await import(`${compiledComponentPath}?cacheBust=${Date.now()}`)).default;
  return ver === 'v1'
    ? engineServer.renderComponent('x-parent', cmp, props)
    : await ssrRuntime.serverSideRenderComponent('x-parent', cmp, props);
}

async function buildResponse(ver, props) {
  const renderedMarkup = renderMarkup(ver, props);

  return htmlTemplate({
    markup: renderedMarkup,
    prettifiedMarkup: htmlEntities.encode(prettier.format(renderedMarkup, {
      parser: 'html',
      htmlWhitespaceSensitivity: 'ignore',
    })),
    compiledComponentCode: htmlEntities.encode(fs.readFileSync(compiledComponentPath, 'utf8')),
    props: JSON.stringify(props),
    ver,
  });
}

app.get('/ssr-v2', async (req, res) => {
  const componentProps = getRootComponentProps(req);
  return res.send(await buildResponse('v2', componentProps));
});

app.get('/ssr-v1', async (req, res) => {
  const componentProps = getRootComponentProps(req);
  return res.send(await buildResponse('v1', componentProps));
});

app.get('/ssr-output.json', async (req, res) => {
  const componentProps = getRootComponentProps(req);
  const markupV1 = await renderMarkup('v1', structuredClone(componentProps));
  const markupV2 = await renderMarkup('v2', structuredClone(componentProps));
  const formattedMarkupV1 = formatHTML(markupV1);
  const formattedMarkupV2 = formatHTML(markupV2);
  const stringifiedProps = JSON.stringify(componentProps, null, 2);

  return res.send(JSON.stringify({
    componentProps,
    markupV1,
    markupV2,
    formattedMarkupV1,
    formattedMarkupV2,
  }));
});

app.get('/ssr-diff', async (req, res) => {
  return res.sendFile(path.resolve(__dirname, './static/diff.html'));
});

app.get('/csr', (req, res) => {
  return res.sendFile(path.resolve(__dirname, './static/csr.html'));
});

app.get('*', (req, res) => {
  return res.sendFile(path.resolve(__dirname, './static/root.html'));
});

app.listen(PORT, () =>
  console.log(`Listening at http://localhost:${PORT}`)
);

(async () => {
  const watcher = await rollup.watch(rollupConfig);
  watcher.on('event', (event) => {
    if (event.code === 'ERROR') {
      console.error(event.error);
    }
    if (event.code === 'START') {
      process.stdout.write('Compiling...');
    }
    if (event.code === 'END') {
      console.log(' done!');
    }
  });
})();
