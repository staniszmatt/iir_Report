/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint global-require: off, no-console: off */
/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'mssql/msnodesqlv8';
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import fs from 'fs';
import MenuBuilder from './menu';
import getWorkOrderData from './api/getWorkOrderData';
import updateLinkWorkOrderToAPE from './api/updateLinkWorkOrderToAPE';
import updateRemoveLink from './api/updateRemoveLink';
import postIIRReport from './api/postIIRReport';
import updateIIRReport from './api/updateIIRReport';
import emailer from './api/emailer';
import pjson from './package.json';

function saveUpdaterLogs() {
  const testLog = log.transports.file.readAllLogs();
  console.log('testLog: ', testLog[0].lines);

  const fileLocation = `\\\\AMR-FS1\\Users\\TearDownUpdaterLogs\\TearDownUpdaterLogs.txt`;

  fs.writeFileSync(fileLocation, JSON.stringify(testLog[0].lines));
}

export default class AppUpdater {
  static default: any;

  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;

    autoUpdater
      .checkForUpdatesAndNotify()
      .then(() => {
        saveUpdaterLogs();
        // eslint-disable-next-line no-useless-return
        return;
      })
      .catch(err => {
        console.log('catch err: ', err);
      });
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    backgroundColor: '#FFF',
    titleBarStyle: 'default',
    width: 1024,
    height: 728,
    icon: path.join(__dirname, 'resources', 'png', 'aeropartsicon1Jkicon.png'),
    webPreferences:
      process.env.NODE_ENV === 'development' || process.env.E2E_BUILD === 'true'
        ? {
            nodeIntegration: true,
            // Need to figure out how the Content-Security-Policy will work for this app before enabling.
            // worldSafeExecuteJavaScript: true,
            // contextIsolation: true,
            enableRemoteModule: true,
            spellcheck: true
          }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js'),
            // Need to figure out how the Content-Security-Policy will work for this app before enabling.
            // worldSafeExecuteJavaScript: true,
            // contextIsolation: true,
            enableRemoteModule: true,
            spellcheck: true
          }
  });

  mainWindow.maximize();

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  createWindow();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
// Pass App version
ipcMain.on('app_version', event => {
  const pversion = pjson.version;
  event.sender.send('app_version', { version: pversion });
});

// API calls
ipcMain.on('asynchronous-message', async (event, arg) => {
  let requestToSend: any = () => {};
  let switchFail = false;

  switch (arg.request) {
    case 'emailer':
      requestToSend = emailer;
      break;
    case 'getWorkOrderData':
      requestToSend = getWorkOrderData;
      break;
    case 'updateLinkWorkOrderToAPE':
      requestToSend = updateLinkWorkOrderToAPE;
      break;
    case 'updateRemoveLink':
      requestToSend = updateRemoveLink;
      break;
    case 'postIIRReport':
      requestToSend = postIIRReport;
      break;
    case 'updateIIRReport':
      requestToSend = updateIIRReport;
      break;
    default:
      switchFail = true;
      break;
  }
  if (switchFail) {
    event.sender.send('asynchronous-reply', {
      error: {
        switchFail: `No Request found for ${arg.request}`
      }
    });
    return;
  }
  try {
    const data = await requestToSend(arg);
    event.sender.send('asynchronous-reply', data);
  } catch (err) {
    event.sender.send('asynchronous-reply', err);
  }
});
