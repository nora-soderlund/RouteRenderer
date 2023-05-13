const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "bundle.mjs",
        path: path.resolve(__dirname, "dist"),
        library: "RouteRenderer",
        libraryTarget: "umd",
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    }
};
