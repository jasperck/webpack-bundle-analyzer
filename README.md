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
        analyzerMode: 'json',
        defaultSizes: 'gzip',
        generateStatsFile: true
    })
  ]
}
```

Analyzer will generate a JSON report containing chunks data converted from bytes into appropriate units according
to the [filesize](https://www.npmjs.com/package/filesize) provided API. 

## Result

```js
[
  {
    "label": "scripts/Drawer.js",
    "statSize": "13.67 KB",
    "parsedSize": "7.16 KB",
    "gzipSize": "2.56 KB",
    "chunkNames": [
      "Drawer"
    ]
  },
  {
    "label": "scripts/Checkout.js",
    "statSize": "113.11 KB",
    "parsedSize": "47.43 KB",
    "gzipSize": "14.62 KB",
    "chunkNames": [
      "Checkout"
    ]
  }
]
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
