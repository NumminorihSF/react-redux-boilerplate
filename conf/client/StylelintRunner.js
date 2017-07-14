import cp from 'child_process';

export default class TestRunner {
  constructor() {
    if (process.env.NODE_SKIP_STYLELINT) {
      return function () {};
    }

    return function () {
      this.plugin('watch-run', (w, cb) => cp.exec('npm run stylelint -s', (err, stdout, stderr) => {
        if (err) {
          console.error('Style lint is failed');
          console.log(stdout);
        } else console.log('Style lint is completed');
        return cb(null);
      }));
    };
  }
}

