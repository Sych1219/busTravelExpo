module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            ["nativewind/babel"],
            [
                'module-resolver',
                {
                    root: ['./src'],
                    alias: {
                        '@assets': './src/assets',
                        '@components': './src/components',
                        '@config': './src/config',
                        '@models': './src/models',
                        '@navigator': './src/navigator',
                        '@pages': './src/pages',
                        '@utils': './src/utils',
                    },
                },
            ],
        ],
    };
};
