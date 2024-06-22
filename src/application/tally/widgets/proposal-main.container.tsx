import { useCallback, useState } from 'react';

import { ErrorBoundary } from 'shared/observability';

import { useTwitterVisibleTallyUsersNodes } from '../hooks';

import { OrganizationProposalsContainer } from './organization-proposals.container';

export const ProposalMainContainer = () => {
  const [hiddenUsers, setHiddenUsers] = useState<string[]>([]);

  const { visibleTallyNodes } = useTwitterVisibleTallyUsersNodes({
    hidden: hiddenUsers,
  });

  const hideTally = useCallback((tallyName: string) => {
    setHiddenUsers((previous) => {
      return [...previous, tallyName];
    });
  }, []);

  return visibleTallyNodes.map(({ name, top }) => {
    return (
      <ErrorBoundary
        key={`${name}at_${top}`}
        exceptionEventName="tally-widget-twitter-main-runtime-error"
      >
        <OrganizationProposalsContainer
          tallyName={name}
          className="absolute"
          top={top - 12}
          onClose={() => {
            hideTally(name);
          }}
        />
      </ErrorBoundary>
    );
  });
};
