import * as ts from 'typescript';

const programs: Record<string, ts.Program> = {};

export const install = (options: ts.CompilerOptions = {}) => {
  expect.extend({
    toCompile(filePath: string) {
      if (!programs[filePath]) {
        programs[filePath] = ts.createProgram([filePath], {
          maxNodeModuleJsDepth: 1,
          ...options,
        });
      }

      const program = programs[filePath];

      const diagnosticts = ts.getPreEmitDiagnostics(program);

      const errorDiagnostics = diagnosticts.find(
        (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
      );

      const successResult = {
        pass: true,
        message: () => `Expected ${filePath} to produce a compile error`,
      };

      const errorResult = {
        pass: false,
        message: () =>
          `Expected ${filePath} to be compiled successfully, but got ${errorDiagnostics?.messageText}.`,
      };

      return errorDiagnostics ? errorResult : successResult;
    },
  });
};

export default { install };
