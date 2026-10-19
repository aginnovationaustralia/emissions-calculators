/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-node-env-from-browser-entries',
      comment:
        'Browser-facing entry points must not reach NodeEnvironment (or other Node execution code), even transitively via calculator barrels.',
      severity: 'error',
      from: {
        path: '(^|/)(browser\\.ts|fullcam/index\\.ts|calculators/.+/browser\\.ts)$',
      },
      to: {
        path: 'calculators/execution/node',
        reachable: true,
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
  },
};
