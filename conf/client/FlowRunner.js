import cp from 'child_process';

export default class TestRunner {
  constructor() {
    if (process.env.NODE_SKIP_FLOW) {
      return function () {};
    }

    return function () {
      this.plugin('watch-run', (w, cb) => cp.exec('npm run flow -s', (err, stdout, stderr) => {
        if (err) {
          console.error('Type check is failed');
          console.log(stdout);
        } else console.log('Type check is completed');
        return cb(null);
      }));
    };
  }
}

