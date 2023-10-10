const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    target: 'node',
    node: {
        __dirname: true,
    },
    output:{
        library: {
          type: 'commonjs2'
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    externals: [nodeExternals()],
    resolve: {
        extensions: ['.ts', '.js'],
    },
};