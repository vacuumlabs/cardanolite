const path = require('path')
const chokidar = require('chokidar')
const fs = require('fs')

const ELECTRON_DIR = 'electron/'
const APP_DIST_DIR = 'app/dist/'

const watcher = chokidar.watch(APP_DIST_DIR)

const withSingleRetry = (func, ...argsAndCallback) => {
  const callback = argsAndCallback[argsAndCallback.length - 1]
  const args = argsAndCallback.slice(0, argsAndCallback.length - 1)
  func(...args, (err, ...results) => {
    if (err) {
      setTimeout(() => {
        func(...args, callback)
      }, 30)
    } else {
      callback(null, ...results)
    }
  })
}

const onCreateUpdate = (filePath) => {
  const newPath = path.resolve(ELECTRON_DIR, path.relative(APP_DIST_DIR, filePath))

  withSingleRetry(fs.mkdir, path.dirname(newPath), { recursive: true }, (err) => {
    if (err) {
      throw err
    } else {
      withSingleRetry(fs.copyFile, filePath, newPath, (err) => {
        if (err) {
          throw err
        }
      })
    }
  })
}

const onRemove = (filePath) => {
  const newPath = path.resolve(ELECTRON_DIR, path.relative(APP_DIST_DIR, filePath))

  withSingleRetry(fs.unlink, newPath, (err) => {
    if (err) {
      throw err
    }

    var dir = path.dirname(newPath)
    var readDir

    readDir = (fpath, err, files) => {
      if (err) {
        throw err
      }

      if (!files.length && path.relative(ELECTRON_DIR, fpath) != '') {
        withSingleRetry(fs.rmdir, fpath, (err) => {
          const parent = path.resolve(fpath, '..')
          if (err) {
            throw err
          }
          fs.readdir(fpath, readDir.bind(null, parent))
        })
      }
    }

    withSingleRetry(fs.readdir, dir, readDir.bind(null, dir))
  })
}

watcher.on('add', onCreateUpdate)
watcher.on('change', onCreateUpdate)
watcher.on('unlink', onRemove)
