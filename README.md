<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" align="center"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

## Webpack Bundle Analyzer JSON plugin

Analyzer that generates a JSON report containing chunks data converted from bytes into appropriate units according
to the [filesize](https://www.npmjs.com/package/filesize) provided API. 

## Great thanks

Webpack Bundle Analyzer JSON plugin is built on a base of [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) and [@jasperck/webpack-bundle-analyzer](https://www.npmjs.com/package/@jasperck/webpack-bundle-analyzer) plugins.

## Install

```bash
npm install --save-dev webpack-bundle-analyzer-json
```

## Usage (as a plugin)

```js
const BundleAnalyzerJsonPlugin = require('webpack-bundle-analyzer-json').BundleAnalyzerJsonPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerJsonPlugin({
        reportFilename: 'file-path'
    })
  ]
}
```

Analyzer will generate a JSON report containing chunks (.js, .css) data converted from bytes into appropriate units according
to the [filesize](https://www.npmjs.com/package/filesize) provided API. 

## Result

```js
[
  {
    "label": "scripts/Drawer.js",
    "parsedSize": "7.16 KB",
    "gzipSize": "2.56 KB",
    "chunkNames": [
      "Drawer"
    ],
    "statSize": "13.67 KB",
  },
  {
    "label": "scripts/Checkout.js",
    "parsedSize": "47.43 KB",
    "gzipSize": "14.62 KB",
    "chunkNames": [
      "Checkout"
    ],
    "statSize": "113.11 KB",
  },
{
    "label": "Drawer.css",
    "parsedSize": "53.11 KB",
    "gzipSize": "11.03 KB",
    "chunkNames": [
      "Drawer"
    ]
  },
  {
    "label": "Checkout.css",
    "parsedSize": "24.63 KB",
    "gzipSize": "4.97 KB",
    "chunkNames": [
      "Checkout"
    ]
  },
]
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
