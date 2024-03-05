import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
  useModulesManager,
  useTranslations,
  Searcher,
  withHistory,
  withModulesManager,
} from '@openimis/fe-core';
import { DEFAULT_PAGE_SIZE, EMPTY_STRING, ROWS_PER_PAGE_OPTIONS } from '../constants';
import GroupIndividualHistoryFilter from './GroupIndividualHistoryFilter';
import { fetchGroupIndividualHistory } from '../actions';

function GroupIndividualHistorySearcher({
  individualId,
}) {
  const modulesManager = useModulesManager();
  const dispatch = useDispatch();
  const { formatDateFromISO, formatMessageWithValues } = useTranslations('individual', modulesManager);

  const fetchingGroupIndividualHistory = useSelector((state) => state.individual.fetchingGroupIndividualHistory);
  const fetchedGroupIndividualHistory = useSelector((state) => state.individual.fetchedGroupIndividualHistory);
  const errorGroupIndividualHistory = useSelector((state) => state.individual.errorGroupIndividualHistory);
  const groupIndividualHistory = useSelector((state) => state.individual.groupIndividualHistory);
  const groupIndividualHistoryPageInfo = useSelector((state) => state.individual.groupIndividualHistoryPageInfo);
  const groupIndividualHistoryTotalCount = useSelector((state) => state.individual.groupIndividualHistoryTotalCount);
  const fetch = (params) => (individualId ? dispatch(fetchGroupIndividualHistory(params)) : null);

  const headers = () => {
    const headers = [
      'individual.firstName',
      'individual.lastName',
      'individual.dob',
      'groupIndividual.individual.role',
      'emptyLabel',
    ];
    return headers;
  };

  const itemFormatters = () => {
    const formatters = [
      (groupIndividualHistory) => groupIndividualHistory.individual.firstName,
      (groupIndividualHistory) => groupIndividualHistory.individual.lastName,
      (groupIndividualHistory) => (
        groupIndividualHistory.individual.dob
          ? formatDateFromISO(modulesManager, groupIndividualHistory.individual.dob)
          : EMPTY_STRING
      ),
      (groupIndividualHistory) => groupIndividualHistory.role,
    ];
    return formatters;
  };

  const rowIdentifier = (groupIndividualHistory) => groupIndividualHistory.id;

  const sorts = () => [
    ['id', true],
    ['dateUpdated', true],
    ['version', true],
  ];

  const defaultFilters = () => {
    const filters = {
    };
    if (individualId !== null && individualId !== undefined) {
      filters.individual_Id = {
        value: individualId,
        filter: `individual_Id: "${individualId}"`,
      };
    }
    return filters;
  };

  const groupIndividualHistoryFilter = (props) => (
    <GroupIndividualHistoryFilter
      intl={props.intl}
      classes={props.classes}
      filters={props.filters}
      onChangeFilters={props.onChangeFilters}
    />
  );

  return (
    <div>
      <Searcher
        module="individual"
        FilterPane={groupIndividualHistoryFilter}
        fetch={fetch}
        items={groupIndividualHistory}
        itemsPageInfo={groupIndividualHistoryPageInfo}
        fetchingItems={fetchingGroupIndividualHistory}
        fetchedItems={fetchedGroupIndividualHistory}
        errorItems={errorGroupIndividualHistory}
        tableTitle={formatMessageWithValues('groupIndividualHistoryList.searcherResultsTitle', {
          groupIndividualHistoryTotalCount,
        })}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        defaultOrderBy="id"
        rowIdentifier={rowIdentifier}
        defaultFilters={defaultFilters()}
        cacheFiltersKey="groupIndividualHistoryFilterCache"
        resetFiltersOnUnmount
      />
    </div>
  );
}

export default withHistory(
  withModulesManager(injectIntl((GroupIndividualHistorySearcher))),
);
