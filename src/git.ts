import * as cp from 'child_process';

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
    const relativeTime = millisecondsToRelativeTime(Number(epoch));
    const gitBlameLine = `${name}, ${relativeTime} ago: ${message}`;

    return gitBlameLine ?? '';
  } catch (error) {
    return 'uncommited line';
  }
}

function millisecondsToRelativeTime(milliseconds: number): string {
  const YEARS = 31536000000;
  const MONTHS = 2592000000;
  const DAYS = 86400000;
  const HOURS = 3600000;
  const MINUTES = 60000;


  switch (true) {
    case milliseconds > YEARS:
      return `${Math.floor(milliseconds / YEARS)} years`;
    case milliseconds > MONTHS:
      return `${Math.floor(milliseconds / MONTHS)} months`;
    case milliseconds > DAYS:
      return `${Math.floor(milliseconds / DAYS)} days`;
    case milliseconds > HOURS:
      return `${Math.floor(milliseconds / HOURS)} hours`;
    case milliseconds > MINUTES:
      return `${Math.floor(milliseconds / MINUTES)} minutes`;
    default:
      return `${milliseconds} seconds`;
  }
}

function epochToRelativeTime(epoch: number): string {
  const YEARS = 31536000;
  const MONTHS = 2592000;
  const DAYS = 86400;
  const HOURS = 3600;
  const MINUTES = 60;

  const seconds = Math.floor((new Date().getTime() - epoch * 1000) / 1000);

  switch (true) {
    case seconds > YEARS:
      return `${Math.floor(seconds / YEARS)} years`;
    case seconds > MONTHS:
      return `${Math.floor(seconds / MONTHS)} months`;
    case seconds > DAYS:
      return `${Math.floor(seconds / DAYS)} days`;
    case seconds > HOURS:
      return `${Math.floor(seconds / HOURS)} hours`;
    case seconds > MINUTES:
      return `${Math.floor(seconds / MINUTES)} minutes`;
    default:
      return `${seconds} seconds`;
  }
}