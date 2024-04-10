/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { SNAPSHOT_WEBSITE_URL, TWITTER_HANDLE_TO_SNAPSHOT } from './constants';
import { GetProposalsOptions, ProposalData } from './types';

export const generateGetProposalsQuery = (
  snapshotNames: string[],
  options: GetProposalsOptions,
) => {
  return `query Proposals {
  proposals (
    first: ${options.first},
    skip: 0,
    where: {
      space_in: [${snapshotNames.map((name) => {
        return `"${name}"`;
      })}],
      state: "active"
    },
    orderBy: "end",
    orderDirection: asc
  ) {
    id
    title
    body
    end
    author
    space {
      id
    }
  }
}`;
};

export const getProposalUrl = (snapshotName: string, proposalId: string) => {
  return `${SNAPSHOT_WEBSITE_URL}/#/${snapshotName}/proposal/${proposalId}`;
};

export const getUserUrl = (userId: string) => {
  return `${SNAPSHOT_WEBSITE_URL}/#/profile/${userId}`;
};

export const getSnapshotFromTwitterHandle = (handle: string) => {
  return TWITTER_HANDLE_TO_SNAPSHOT[handle.toLowerCase()];
};

export const getDaysUntil = (dateInMs: number) => {
  const currentDate = new Date();

  // Set the time of the current date to 00:00:00 for accurate day difference calculation
  currentDate.setHours(0, 0, 0, 0);

  // Create a new date object for the target date, also set to 00:00:00
  const targetDate = new Date(dateInMs);
  targetDate.setHours(0, 0, 0, 0);

  // Calculate the difference in milliseconds
  const differenceInMillis = targetDate.getTime() - currentDate.getTime();

  // Convert the difference from milliseconds to days
  const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);

  return Math.round(differenceInDays);
};

export const getEndsInLabel = (daysUntil: number) => {
  if (daysUntil < 0) {
    return '-';
  }

  if (daysUntil === 0) {
    return 'Ends today';
  }

  if (daysUntil === 1) {
    return 'Ends in 1 day';
  }

  return `Ends in ${daysUntil} days`;
};

export const getProposalAuthor = (proposal: ProposalData) => {
  return (
    proposal.author.resolvedAddress ??
    `${proposal.author.address.slice(0, 6)}...${proposal.author.address.slice(Math.max(0, proposal.author.address.length - 4))}`
  );
};

// TODO: generic function inside twitter module
export const getSnapshotUsernameNodes = (usernameNodes: Element[]) => {
  return usernameNodes
    .map((node) => {
      const anchor = node.querySelector('a');

      if (!anchor) {
        return;
      }
      const anchorRect = anchor.getBoundingClientRect();

      // for some reason there are some tweets that are not visible on the screen, they have height 0 but in DOM they are almost the same as normal tweet, they have 0 height
      if (anchorRect.height === 0) {
        return;
      }

      const handle = anchor.getAttribute('href')?.replace('/', '');
      if (!handle) {
        return;
      }
      const snapshotName = getSnapshotFromTwitterHandle(handle);
      if (!snapshotName) {
        return;
      }

      return {
        snapshotName,
        top: anchorRect.top + window.scrollY,
      };
    })
    .filter(Boolean);
};