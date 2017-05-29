import chokidar from 'chokidar';
import sass from 'node-sass';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

module.exports = {
  watchYourSass(socket) {
    const watcher = chokidar.watch('../../../../../.styles', {
      persistent: true,
    });

    // Something to use when events are received.
    const log = console.log.bind(console);
    // Add event listeners.
    watcher
      .on('add', filePath => this.sassMeUp(filePath, socket))
      .on(
        'change',
        filePath => this.sassMeUp(filePath, socket) && log(`File ${filePath} has been changed`),
      )
      .on('unlink', filePath => log(`File ${filePath} has been removed`));

    // More possible events.
    watcher
      .on('addDir', filePath => log(`Directory ${filePath} has been added`))
      .on('unlinkDir', filePath => log(`Directory ${filePath} has been removed`))
      .on('error', error => log(`Watcher error: ${error}`))
      .on('ready', () => log('Initial scan complete. Ready for changes'))
      .on('raw', (event, filePath, details) => {
        log('Raw event info:', event, filePath, details);
      });
  },
  sassMeUp(file, socket) {
    sass.render(
      {
        file,
      },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          postcss([autoprefixer]).process(result.css.toString()).then((postResult) => {
            postResult.warnings().forEach((warn) => {
              console.warn(warn.toString());
            });
            socket.emit('file refresh', {
              css: postResult.css.toString(),
              filename: result.stats.entry,
            });
          });
        }
      },
    );
  },
};
