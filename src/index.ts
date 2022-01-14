import * as ts from 'typescript';
import path from 'path';

export const install = (options: ts.CompilerOptions = {}) => {
  expect.extend({
    toCompile(filePath: string) {
      const program = ts.createProgram([filePath], {
        maxNodeModuleJsDepth: 1,
        ...options,
      });

      const diagnosticts = ts.getPreEmitDiagnostics(program);

      const errorDiagnostics = diagnosticts.find(
        (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
      );

      const expandTip = this.expand
        ? ''
        : '\n\nUse --expand to show full file paths';

      if (!errorDiagnostics) {
        return {
          pass: true,
          message: () => {
            const fileName = this.expand ? filePath : path.basename(filePath);

            const hint = this.utils.matcherHint(
              'toCompile',
              `'${fileName}'`,
              '',
              {
                isNot: this.isNot,
              }
            );

            const expected = this.utils.printExpected(
              `${fileName} produces a compilation error`
            );
            const received = this.utils.printReceived(
              `${fileName} compiled successfully`
            );

            return `${hint}\n\nExpected: ${expected}\nReceived: ${received}${expandTip}`;
          },
        };
      }

      return {
        pass: false,
        message: () => {
          const message = errorDiagnostics.messageText.toString();
          const file = errorDiagnostics.file;
          const fileName = this.expand
            ? file?.fileName || ''
            : path.basename(file?.fileName || '');

          const lineAndChar = file?.getLineAndCharacterOfPosition(
            errorDiagnostics.start || 0
          );

          const line = (lineAndChar?.line || 0) + 1;
          const character = (lineAndChar?.character || 0) + 1;

          const hint = this.utils.matcherHint('toCompile', `'${fileName}'`, '');

          const expected = this.utils.printExpected('No compilation errors');
          const received = this.utils.printReceived(
            `${message} (${fileName}:${line}:${character})`
          );

          return `${hint}\n\nExpected: ${expected}\nReceived: ${received}${expandTip}`;
        },
      };
    },
  });
};

export default { install };
