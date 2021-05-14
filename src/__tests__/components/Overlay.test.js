import React from 'react';

import Menu from '../../components/Menu';
import Overlay, { getPlacement } from '../../components/Overlay';

import { getMenu, render, screen, waitFor } from '../helpers';

const TestComponent = (props) => (
  <Overlay referenceElement={document.createElement('div')} {...props}>
    {(menuProps) => (
      <Menu {...menuProps} id="menu-id">
        This is the menu
      </Menu>
    )}
  </Overlay>
);

describe('<Overlay>', () => {
  it('renders children when `isMenuShown=true`', () => {
    render(<TestComponent isMenuShown />);
    expect(getMenu(screen)).toBeInTheDocument();
  });

  it('does not render children when `isMenuShown=false`', () => {
    render(<TestComponent isMenuShown={false} />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('updates the positioning type', async () => {
    // Uses absolute positioning by default.
    const { rerender } = render(<TestComponent isMenuShown />);

    // Wait for component to finish multiple renders.
    await waitFor(() => {
      expect(getMenu(screen)).toHaveStyle('position: absolute');
    });

    rerender(<TestComponent isMenuShown positionFixed />);
    await waitFor(() => {
      expect(getMenu(screen)).toHaveStyle('position: fixed');
    });
  });
});

describe('Overlay placement', () => {
  it('computes the placement string', () => {
    const permutations = [
      { props: { align: 'right', dropup: false }, received: 'bottom-end' },
      { props: { align: 'left', dropup: false }, received: 'bottom-start' },
      { props: { align: 'justify', dropup: false }, received: 'bottom-start' },
      { props: { align: 'foo', dropup: false }, received: 'bottom-start' },
      { props: { align: 'right', dropup: true }, received: 'top-end' },
      { props: { align: 'left', dropup: true }, received: 'top-start' },
      { props: { align: 'justify', dropup: true }, received: 'top-start' },
      { props: { align: 'foo', dropup: true }, received: 'top-start' },
    ];

    permutations.forEach(({ props, received }) => {
      expect(getPlacement(props)).toBe(received);
    });
  });
});
