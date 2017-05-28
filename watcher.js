import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import sass from 'node-sass';

module.exports = {
  watcher(socket) {
    const watcher = chokidar.watch('../../../../../.styles', {
      persistent: true,
    });

    // Something to use when events are received.
    const log = console.log.bind(console);
    // Add event listeners.
    watcher
      .on('add', filePath => this.sassIt(filePath, socket))
      .on(
        'change',
        filePath => this.sassIt(filePath, socket) && log(`File ${filePath} has been changed`),
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
  sassIt(file, socket) {
    sass.render(
      {
        file,
      },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          socket.emit('file refresh', { css: result.css.toString(), filename: result.stats.entry });
        }
      },
    );
  },
};
