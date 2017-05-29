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
    // Event listeners. Only utilizing add & change but others are kept for notifications
    watcher
      .on('add', filePath => this.sassMeUp(filePath, socket))
      .on(
        'change',
        filePath => this.sassMeUp(filePath, socket))
      )
      .on('unlink', filePath => log(`File ${filePath} has been removed`));
    watcher
      .on('addDir', filePath => log(`Directory ${filePath} has been added`))
      .on('unlinkDir', filePath => log(`Directory ${filePath} has been removed`))
      .on('error', error => log(`Watcher error: ${error}`))
      .on('ready', () => log('Initial scan complete. Ready for changes'))
  },
  sassMeUp(file, socket) {
    console.log(`${file} has been modified`);
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
