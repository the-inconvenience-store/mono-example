module.exports = {
    'backendQuery': {
        input: { target: 'http://localhost:5074/swagger/v1/swagger.json' },
        output: {
            workspace: './packages/api-orval',
            target: 'gen/apis',
            schemas: 'gen/models',
            client: 'react-query',
            httpClient: 'fetch',
            mode: 'tags-split',
            mock: {
                indexMockFiles: true
            },
            // baseUrl: 'http://localhost:5074',
            urlEncodeParameters: true,
            override: {
                mutator: {
                    path: 'src/custom-fetch.ts',
                    name: 'customFetch'
                }
            },
            prettier: true
        }
    },
    backendZod: {
        input: { target: 'http://localhost:5074/swagger/v1/swagger.json' },
        output: {
            workspace: './packages/api-orval',
            mode: 'tags-split',
            client: 'zod',
            target: 'gen/apis',
            schemas: 'gen/models',
            fileExtension: '.zod.ts',
            override: {
                zod: {
                    generate: {
                        param: true,
                        body: true,
                        response: false,
                        query: true,
                        header: true,
                    }
                }
            },
            prettier: true
        },
    },
};