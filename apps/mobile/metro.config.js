const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

// const extraNodeModules = {
//     'modules': path.resolve(path.join(__dirname, '../../node_modules'))
// };

// const watchFolders = [
//     path.resolve(path.join(__dirname, '../../node_modules'))
// ];

// const nodeModulesPaths = [path.resolve(path.join(__dirname, './node_modules'))];

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    // transformer: {
    //     getTransformOptions: async () => ({
    //         transform: {
    //             experimentalImportSupport: true,
    //             inlineRequires: true,
    //         },
    //     }),
    // },
    // resolver: {
    //     extraNodeModules,
    //     nodeModulesPaths
    // },
    // watchFolders
    resolver: {
        unstable_enableSymlinks: true, // this enable the use of Symlinks
        unstable_enablePackageExports: true,

    },
    // this specifies the folder where are located the node_modules for the project
    watchFolders: [path.join(__dirname, '..', '..')],

};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
