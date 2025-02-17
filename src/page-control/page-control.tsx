/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from 'react';
import { getOverrides } from '../helpers/overrides';
import { StyledRoot, StyledDot } from './styled-components';
import { SIZE, KIND } from './constants';
import type { PageControlProps } from './types';

const MAX_DOTS = 5;

const PageControl = ({
  currentPage,
  numPages,
  onPageChange,
  kind = KIND.default,
  disabled = false,
  'aria-label': ariaLabel,
  overrides = {},
}: PageControlProps) => {
  const [Root, RootProps] = getOverrides(overrides.Root, StyledRoot);
  const [Dot, DotProps] = getOverrides(overrides.Dot, StyledDot);

  const isOverflow = numPages > MAX_DOTS;

  function isActive(i: number) {
    return i === currentPage;
  }

  function isVisible(i: number) {
    if (!isOverflow) return true;
    // if current page is one of first three pages, first five page dots are visible
    if (currentPage < 3) {
      return i < 5;
    }
    // if current page is one of last three pages, last five page dots are visible
    if (numPages - currentPage < 4) {
      return i > numPages - 6;
    }
    // otherwise, page must be within 2 of the current page for dot to be visible
    return i >= currentPage - 2 && i <= currentPage + 2;
  }

  function getSize(i: number) {
    if (!isOverflow) return SIZE.large;

    if (currentPage < 3) {
      if (i < 3) {
        return SIZE.large;
      }
      if (i === 3) {
        return SIZE.medium;
      }
      return SIZE.small;
    }

    if (numPages - currentPage < 4) {
      if (i > numPages - 4) {
        return SIZE.large;
      }
      if (i === numPages - 4) {
        return SIZE.medium;
      }
      return SIZE.small;
    }

    if (i >= currentPage - 1 && i <= currentPage + 1) {
      return SIZE.large;
    }
    if (i === currentPage - 2 || i === currentPage + 2) {
      return SIZE.medium;
    }
    return SIZE.small;
  }

  const name = React.useId();

  return (
    <Root $kind={kind} role="radiogroup" aria-label={ariaLabel || 'page control'} {...RootProps}>
      {Array.from({ length: numPages }, (_, i) => {
        const page = i + 1;
        return (
          <Dot
            $active={isActive(page)}
            $kind={kind}
            $disabled={disabled}
            $isVisible={isVisible(page)}
            $size={getSize(page)}
            checked={isActive(page)}
            key={page}
            aria-label={`page ${page}`}
            name={name}
            onChange={() => onPageChange({ nextPage: page })}
            tabIndex={isActive(page) ? 0 : -1}
            type="radio"
            {...DotProps}
          />
        );
      })}
    </Root>
  );
};
export default PageControl;
