const envPaths = ['', `.${process.env.NODE_ENV}`]
  .map((name) => `.env${name}`)
  .map((name) => `${process.cwd()}/../../${name}`);

Object.freeze(envPaths);

export default envPaths;
