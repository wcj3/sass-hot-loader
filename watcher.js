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
    // Event listeners. Only utilizing add & change but others are kept
    // for notifications
    watcher
      .on('add', filePath => this.sassMeUp(filePath, socket))
      .on(
        'change',
        filePath => this.sassMeUp(filePath, socket) && console.log(`File ${filePath} has been changed`),
      )
      .on('unlink', filePath => console.log(`File ${filePath} has been removed`));
    watcher
      .on('addDir', filePath => console.log(`Directory ${filePath} has been added`))
      .on('unlinkDir', filePath => console.log(`Directory ${filePath} has been removed`))
      .on('error', error => console.log(`Watcher error: ${error}`))
      .on('ready', () => console.log('Initial scan complete. Ready for changes'))
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
          // Process with Postcss & autoprefixer, send response via Socket
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
