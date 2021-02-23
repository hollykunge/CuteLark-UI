import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { Box } from '../Box';
import { Chevron } from '../Chevron';

const defaultItemsPerPageLabel = () => 'Items per page:';

const defaultShowingResultsLabel = ({ count, current, itemsPerPage }) =>
  `Showing results ${ current + 1 } - ${ Math.min(current + itemsPerPage, count) } of ${ count }`;


export function Pagination({
  count,
  current = 0,
  itemsPerPage = 25,
  itemsPerPageLabel = defaultItemsPerPageLabel,
  showingResultsLabel = defaultShowingResultsLabel,
  onSetItemsPerPage,
  onSetCurrent,
  divider,
  ...props
}) {
  const itemsPerPageOptions = [25, 50, 100].filter((i) => i <= count);
  const hasItemsPerPageSelection = itemsPerPageOptions.length > 1;
  const currentPage = Math.floor(current / itemsPerPage);
  const pages = Math.ceil(count / itemsPerPage);
  const displayedPages = useMemo(() => {
    if (pages <= 7) {
      // 0 1 2 3 4 5 6
      return Array.from({ length: pages }, (_, i) => i);
    }

    if (currentPage < 5) {
      // 0 1 2 3 4 ... N
      return [0, 1, 2, 3, 4, '⋯', pages - 1];
    }

    if (currentPage > pages - 5) {
      // 0 ... N-4 N-3 N-2 N-1 N
      return [0, '⋯', pages - 5, pages - 4, pages - 3, pages - 2, pages - 1];
    }

    // 0 ... x-1 x x-2 ... N
    return [0, '⋯', currentPage - 1, currentPage, currentPage + 1, '⋯', pages - 1];
  }, [pages, currentPage]);

  const renderingContext = { count, pages, current, currentPage, itemsPerPage };

  const handleSetItemsPerPageLinkClick = (itemsPerPageOption) => () => {
    onSetItemsPerPage && onSetItemsPerPage(itemsPerPageOption);
  };

  const handleSetPageLinkClick = (page) => () => {
    onSetCurrent && onSetCurrent(page * itemsPerPage);
  };

  return <Box is='nav' rcx-pagination rcx-pagination--divider={divider} {...props}>
    {hasItemsPerPageSelection && (
      <Box rcx-pagination__left>
        <Box is='span' rcx-pagination__label>{itemsPerPageLabel(renderingContext)}</Box>
        <Box is='ol' rcx-pagination__list>
          {itemsPerPageOptions.map((itemsPerPageOption) =>
            <Box key={itemsPerPageOption} is='li' rcx-pagination__list-item>
              <Box
                is='button'
                rcx-pagination__link
                tabIndex={ itemsPerPage === itemsPerPageOption ? -1 : 0 }
                disabled={itemsPerPage === itemsPerPageOption}
                onClick={handleSetItemsPerPageLinkClick(itemsPerPageOption)}
              >
                {itemsPerPageOption}
              </Box>
            </Box>,
          )}
        </Box>
      </Box>
    )}
    <Box rcx-pagination__right>
      <Box is='span' rcx-pagination__label>{showingResultsLabel(renderingContext)}</Box>
      <Box is='ol' rcx-pagination__list>
        <Box is='li' rcx-pagination__list-item>
          <Box is='button' rcx-pagination__back disabled={currentPage === 0} onClick={handleSetPageLinkClick(currentPage - 1)}>
            <Chevron left size='x16' />
          </Box>
        </Box>
        {displayedPages.map((page, i) => (
          <Box key={i} is='li' rcx-pagination__list-item>
            {page === '⋯'
              ? '⋯'
              : <Box
                is='button'
                rcx-pagination__link
                disabled={currentPage === page}
                onClick={handleSetPageLinkClick(page)}
              >
                {page + 1}
              </Box>}
          </Box>
        ))}
        <Box is='li' rcx-pagination__list-item>
          <Box is='button' rcx-pagination__forward disabled={currentPage === pages - 1} onClick={handleSetPageLinkClick(currentPage + 1)}>
            <Chevron right size='x16' />
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>;
}

Pagination.defaultProps = {
  current: 0,
  itemsPerPage: 25,
  itemsPerPageLabel: defaultItemsPerPageLabel,
  showingResultsLabel: defaultShowingResultsLabel,
};

Pagination.propTypes = {
  count: PropTypes.number.isRequired,
  current: PropTypes.number,
  itemsPerPage: PropTypes.oneOf([25, 50, 100]),
};
