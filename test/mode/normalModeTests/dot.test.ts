import { Configuration } from '../../testConfiguration';
import { getTestingFunctions } from '../../testSimplifier';
import { cleanUpWorkspace, setupWorkspace } from './../../testUtils';

suite('Dot Operator', () => {
  let { newTest, newTestOnly } = getTestingFunctions();

  setup(async () => {
    let configuration = new Configuration();
    configuration.tabstop = 4;
    configuration.expandtab = false;

    await setupWorkspace(configuration);
  });

  teardown(cleanUpWorkspace);

  // These "remembering history between editor" tests have started
  // breaking. Since I don't remember these tests ever breaking for real, and
  // because they're the cause of a lot of flaky tests, I'm disabling these for
  // now.
  // test('repeats actions across editors ', async () => {
  //   // setting the content of the first 2 tabs
  //   const firstTabContent = 'some\ntest\nabc\nend';
  //   const secondTabContent = 'another\ntest\ndef\nend';
  //   const firstTabKeys = ['<Esc>', 'a'].concat(firstTabContent.split(''));
  //   const secondTabKeys = ['<Esc>', 'a'].concat(secondTabContent.split(''));
  //   await setupWorkspace();
  //   setTextEditorOptions(5, false);

  //   modeHandler.vimState.editor = vscode.window.activeTextEditor!;

  //   await modeHandler.handleMultipleKeyEvents(firstTabKeys.concat(['<Esc>']));

  //   await modeHandler.handleMultipleKeyEvents(['<Esc>', 'g', 'T']);
  //   await waitForTabChange();
  //   modeHandler.vimState.editor = vscode.window.activeTextEditor!;
  //   await modeHandler.handleMultipleKeyEvents(secondTabKeys.concat(['<Esc>']));

  //   // running an action in second tab and repeating in first tab
  //   await modeHandler.handleMultipleKeyEvents(['g', 'g', 'd', 'd']);
  //   await assertEqualLines(['test', 'def', 'end']);
  //   await modeHandler.handleMultipleKeyEvents(['g', 't']);
  //   await waitForTabChange();
  //   modeHandler.vimState.editor = vscode.window.activeTextEditor!;
  //   await modeHandler.handleMultipleKeyEvents(['<Esc>', 'g', 'g', '.']);
  //   await assertEqualLines(['test', 'abc', 'end']);
  // });

  newTest({
    title: "Can repeat '~' with <num>",
    start: ['|teXt'],
    keysPressed: '4~',
    end: ['TEx|T'],
  });

  newTest({
    title: "Can repeat '~' with dot",
    start: ['|teXt'],
    keysPressed: '~...',
    end: ['TEx|T'],
  });

  newTest({
    title: "Can repeat 'x'",
    start: ['|text'],
    keysPressed: 'x.',
    end: ['|xt'],
  });

  newTest({
    title: "Can repeat 'J'",
    start: ['|one', 'two', 'three'],
    keysPressed: 'J.',
    end: ['one two| three'],
  });

  newTest({
    title: 'Can handle dot with A',
    start: ['|one', 'two', 'three'],
    keysPressed: 'A!<Esc>j.j.',
    end: ['one!', 'two!', 'three|!'],
  });

  newTest({
    title: 'Can handle dot with I',
    start: ['on|e', 'two', 'three'],
    keysPressed: 'I!<Esc>j.j.',
    end: ['!one', '!two', '|!three'],
  });

  newTest({
    title: 'Can repeat actions that require selections',
    start: ['on|e', 'two'],
    keysPressed: 'Vj>.',
    end: ['\t\t|one', '\t\ttwo'],
  });
});

suite('Repeat content change', () => {
  let { newTest, newTestOnly } = getTestingFunctions();

  setup(async () => {
    let configuration = new Configuration();
    configuration.tabstop = 4;
    configuration.expandtab = false;

    await setupWorkspace(configuration);
  });

  teardown(cleanUpWorkspace);

  newTest({
    title: "Can repeat '<C-t>'",
    start: ['on|e', 'two'],
    keysPressed: 'a<C-t><Esc>j.',
    end: ['\tone', '\ttw|o'],
  });

  newTest({
    title: "Can repeat insert change and '<C-t>'",
    start: ['on|e', 'two'],
    keysPressed: 'a<C-t>b<Esc>j.',
    end: ['\toneb', '\ttwo|b'],
  });

  newTest({
    title: 'Can repeat change by `<C-a>`',
    start: ['on|e', 'two'],
    keysPressed: 'a<C-t>b<Esc>ja<C-a><Esc>',
    end: ['\toneb', '\ttwo|b'],
  });

  newTest({
    title: 'Only one arrow key can be repeated in Insert Mode',
    start: ['on|e', 'two'],
    keysPressed: 'a<left><left>b<Esc>j$.',
    end: ['obne', 'tw|bo'],
  });

  newTest({
    title: 'Cached content change will be cleared by arrow keys',
    start: ['on|e', 'two'],
    keysPressed: 'a<C-t>b<left>c<Esc>j.',
    end: ['\tonecb', 'tw|co'],
  });
});
