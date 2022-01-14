declare namespace jest {
  interface Matchers<R> {
    toCompile(): R;
  }
}
