import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  preserveSymlinks: true,
  input: ['ValidateForm.js'],
  output: {
    file: 'dist/ValidateForm.min.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    terser(),
  ],
};
