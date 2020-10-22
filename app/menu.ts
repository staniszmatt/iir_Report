/* eslint-disable new-cap */
/* eslint-disable no-new */
/* eslint @typescript-eslint/ban-ts-ignore: off */
import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
  MenuItem
} from 'electron';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    } else {
      this.setupProductionEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupProductionEnvironment() {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      if (props.misspelledWord) {
        const menu = new Menu();

        // Add each spelling suggestion
        // eslint-disable-next-line no-restricted-syntax
        for (const suggestion of props.dictionarySuggestions) {
          menu.append(
            new MenuItem({
              label: suggestion,
              click: () =>
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.mainWindow!.webContents.replaceMisspelling(suggestion)
            })
          );
        }

        // Allow users to add the misspelled word to the dictionary
        if (props.misspelledWord) {
          menu.append(
            new MenuItem({
              label: 'Add to dictionary',
              click: () =>
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.mainWindow!.webContents.session.addWordToSpellCheckerDictionary(
                  props.misspelledWord
                )
            })
          );
        }

        menu.popup();
      } else {
        Menu.buildFromTemplate([
          {
            label: 'Cut',
            accelerator: 'Ctrl+X',
            role: 'cut'
          },
          {
            label: 'Copy',
            accelerator: 'Ctrl+C',
            role: 'copy'
          },
          {
            label: 'Paste',
            accelerator: 'Ctrl+V',
            role: 'paste'
          },
          {
            label: 'Select All',
            accelerator: 'Ctrl+A',
            role: 'selectAll'
          }
        ]).popup({ window: this.mainWindow });
      }
    });
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      if (props.misspelledWord) {
        const menu = new Menu();

        // Add each spelling suggestion
        // eslint-disable-next-line no-restricted-syntax
        for (const suggestion of props.dictionarySuggestions) {
          menu.append(
            new MenuItem({
              label: suggestion,
              click: () =>
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.mainWindow!.webContents.replaceMisspelling(suggestion)
            })
          );
        }

        // Allow users to add the misspelled word to the dictionary
        if (props.misspelledWord) {
          menu.append(
            new MenuItem({
              label: 'Add to dictionary',
              click: () =>
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.mainWindow!.webContents.session.addWordToSpellCheckerDictionary(
                  props.misspelledWord
                )
            })
          );
        }

        menu.popup();
      } else {
        const { x, y } = props;

        Menu.buildFromTemplate([
          {
            label: 'Inspect element',
            click: () => {
              this.mainWindow.webContents.inspectElement(x, y);
            }
          },
          { type: 'separator' },
          {
            label: 'Cut',
            accelerator: 'Ctrl+X',
            role: 'cut'
          },
          {
            label: 'Copy',
            accelerator: 'Ctrl+C',
            role: 'copy'
          },
          {
            label: 'Paste',
            accelerator: 'Ctrl+V',
            role: 'paste'
          },
          {
            label: 'Select All',
            accelerator: 'Ctrl+A',
            role: 'selectAll'
          }
        ]).popup({ window: this.mainWindow });
      }
    });
  }

  buildDarwinTemplate() {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Electron',
      submenu: [
        {
          label: 'About ElectronReact',
          selector: 'orderFrontStandardAboutPanel:'
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide ElectronReact',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:',
          role: 'redo'
        },
        { type: 'separator' },
        {
          label: 'Cut',
          accelerator: 'Command+X',
          selector: 'cut:',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
          role: 'selectAll'
        }
      ]
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          }
        }
      ]
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          }
        }
      ]
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' }
      ]
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://electronjs.org');
          }
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal(
              'https://github.com/electron/electron/tree/master/docs#readme'
            );
          }
        },
        {
          label: 'Community Discussions',
          click() {
            shell.openExternal('https://www.electronjs.org/community');
          }
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          }
        }
      ]
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateDefault: any = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            }
          }
        ]
      },
      {
        label: '&Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'Ctrl+Z',
            selector: 'undo:',
            role: 'undo'
          },
          {
            label: 'Redo',
            accelerator: 'Ctrl+Y',
            selector: 'redo:',
            role: 'redo'
          },
          { type: 'separator' },
          {
            label: 'Cut',
            accelerator: 'Ctrl+X',
            selector: 'cut:',
            role: 'cut'
          },
          {
            label: 'Copy',
            accelerator: 'Ctrl+C',
            selector: 'copy:',
            role: 'copy'
          },
          {
            label: 'Paste',
            accelerator: 'Ctrl+V',
            selector: 'paste:',
            role: 'paste'
          },
          {
            label: 'Select All',
            accelerator: 'Ctrl+A',
            selector: 'selectAll:',
            role: 'selectAll'
          }
        ]
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  }
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  }
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  }
                }
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  }
                }
              ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click() {
              shell.openExternal('https://electronjs.org');
            }
          },
          {
            label: 'Documentation',
            click() {
              shell.openExternal(
                'https://github.com/electron/electron/tree/master/docs#readme'
              );
            }
          },
          {
            label: 'Community Discussions',
            click() {
              shell.openExternal('https://www.electronjs.org/community');
            }
          },
          {
            label: 'Search Issues',
            click() {
              shell.openExternal('https://github.com/electron/electron/issues');
            }
          }
        ]
      }
    ];

    return templateDefault;
  }
}
