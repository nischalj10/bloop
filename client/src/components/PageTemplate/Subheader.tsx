import React, { useContext, useMemo } from 'react';
import SearchInput from '../SearchInput';
import { AppNavigationContext } from '../../context/appNavigationContext';
import { splitPath } from '../../utils';
import Breadcrumbs from '../Breadcrumbs';

const Subheader = () => {
  const { navigationHistory, navigateBack } = useContext(AppNavigationContext);

  const breadcrumbs = useMemo(() => {
    const reversedHistory = [...navigationHistory].reverse();
    const lastHomeIndex = reversedHistory.findIndex(
      (n) => n.type === 'repo' && !n.path,
    );
    let historyPart = navigationHistory;
    if (lastHomeIndex > 0) {
      historyPart = reversedHistory.slice(0, lastHomeIndex + 1).reverse();
    }
    if (historyPart.length === 1 && historyPart[0].type === 'repo') {
      return [];
    }
    let resultsInList: boolean;
    return historyPart
      .map((item, i) => {
        const onClick = () => navigateBack(-(historyPart.length - 1 - i));
        if (item.type === 'repo' && !item.path) {
          return {
            label: item.repo!,
            onClick,
          };
        }
        if (
          (item.type === 'repo' || item.type === 'full-result') &&
          item.path
        ) {
          const label = splitPath(item.path);
          return {
            label: label[label.length - 1] || label[label.length - 2],
            onClick,
          };
        }
        if (item.type === 'conversation-result') {
          return {
            label: 'Results',
            onClick,
          };
        }
      })
      .reverse()
      .filter((i): i is { label: string; onClick: () => void } => {
        if (i?.label === 'Results') {
          if (resultsInList) {
            return false; // remove clusters of Results
          }
          resultsInList = true;
        } else {
          resultsInList = false;
        }
        return !!i;
      })
      .reverse();
  }, [navigationHistory]);

  return (
    <div className="w-full bg-gray-800 py-2 pl-8 pr-6 flex items-center justify-between border-b border-gray-700 relative z-40">
      <div className="flex gap-3 items-center overflow-hidden">
        <Breadcrumbs
          pathParts={breadcrumbs}
          path={breadcrumbs.map((b) => b.label).join(',')}
          separator="›"
        />
      </div>
      <div className="w-full max-w-[548px]">
        <SearchInput />
      </div>
      <div />
    </div>
  );
};

export default Subheader;