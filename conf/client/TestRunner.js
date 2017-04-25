import cp from 'child_process';

export default class TestRunner {
  constructor(){
    if (process.env.NODE_SKIP_TESTS) {
      return function (){}
    }

    return function() {
      this.plugin("watch-run", function (w, cb) {
        return cp.exec('npm run test -s', function (err, stdout, stderr) {
          if (err) {
            console.error('Tests are failed');
            console.log(stdout);
          }
          else console.log('Tests are completed');
          return cb(null);
        });
      });
    };
  }
}

