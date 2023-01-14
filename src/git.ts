import * as cp from 'child_process';
import * as Moment from 'moment';

/*
git terminal commands:
- git blame -L 1,1 src/extension.ts
- git show -s --format=%s 4932a1cc8c64a5b66b775a2e6856355b9316340b
 or
 git show -s --format="%an,%at,%s" 4932a1cc8c64a5b66b775a2e6856355b9316340b
*/

export function getGitLineBlame(workspacePath: string, filePath: string, line: number): string {
  try {

    const gitBlameCommand = `git blame -L ${line},${line} ${filePath}`;
    const gitBlameOutput = cp.execSync(gitBlameCommand,
      { cwd: workspacePath }
    ).toString();
    const gitBlameLineHash = gitBlameOutput.split(' ')[0];

    const gitShowCommand = `git show -s --format="%an,%at,%s" ${gitBlameLineHash}`;
    const gitShowOutput = cp.execSync(gitShowCommand,
      { cwd: workspacePath }
    ).toString();
    // console.log(gitShowOutput);
    const [name, epoch, message] = gitShowOutput.split(',');
    const relativeTime = epochToRelativeTime(Number(epoch));
    const gitBlameLine = `${name}, ${relativeTime}: ${message}`;

    return gitBlameLine ?? '';
  } catch (error) {
    return 'uncommited line';
  }
}

function epochToRelativeTime(epoch: number): string {
  const moment = Moment.unix(epoch);
  return moment.fromNow();
}