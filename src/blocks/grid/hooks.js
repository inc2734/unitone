import { useMemo } from '@wordpress/element';

import { getResponsiveQuerySelectors } from '../../js/utils/css-container';

export const useResponsiveGridCSS = ( {
	clientId,
	mdBreakpoint,
	smBreakpoint,
} ) =>
	useMemo( () => {
		const selector = `[data-unitone-client-id="${ clientId }"]`;

		const selectors = getResponsiveQuerySelectors( selector );

		const buildCSS = ( querySelector, query, breakpoint, size ) => {
			const prefix = `--unitone--${ size }`;

			return `${ query } (min-width: ${ breakpoint }) {
				${ querySelector }[data-unitone-layout~="-columns\\:${ size }\\:columns"] {
					grid-template-columns: repeat(var(${ prefix }-columns), 1fr);
				}

				${ querySelector }[data-unitone-layout~="-columns\\:${ size }\\:min"] {
					grid-template-columns: repeat(var(--unitone--column-auto-repeat), minmax(min(var(${ prefix }-column-min-width), 100%), 1fr));
				}

				${ querySelector }[data-unitone-layout~="-columns\\:${ size }\\:free"] {
					grid-template-columns: var(${ prefix }-grid-template-columns);
				}

				${ querySelector }[data-unitone-layout~="-rows\\:${ size }\\:rows"] {
					grid-template-rows: repeat(var(${ prefix }-rows), var(${ prefix }-row-track-size));
				}

				${ querySelector }[data-unitone-layout~="-rows\\:${ size }\\:free"] {
					grid-template-rows: var(${ prefix }-grid-template-rows);
				}

				${ querySelector } {
					--unitone--${ clientId }-${ size }: ;
				}
			}`;
		};

		// Evaluate queries on the grid, then inherit their flags so item placement
		// uses the same container even when the grid itself is a query container.
		// Unique flags keep nested grids from overriding their own item placement.
		// Empty flags enable breakpoint values; missing flags trigger var() fallbacks.
		const itemRules = [
			'grid-column',
			'grid-row',
			'align-self',
			'justify-self',
		].map(
			( property ) => `
				--unitone--responsive-grid-md-${ property }: var(--unitone--${ clientId }-md) var(--unitone--md-${ property });
				--unitone--responsive-grid-sm-${ property }: var(--unitone--${ clientId }-sm) var(--unitone--sm-${ property });
				${ property }: var(--unitone--responsive-grid-sm-${ property }, var(--unitone--responsive-grid-md-${ property }, var(--unitone--${ property })));
			`
		);

		return [
			...[
				[ mdBreakpoint, 'md' ],
				[ smBreakpoint, 'sm' ],
			].flatMap( ( [ breakpoint, size ] ) => [
				buildCSS(
					selectors.media,
					'@media not all and',
					breakpoint,
					size
				),
				buildCSS(
					selectors.container,
					'@container not',
					breakpoint,
					size
				),
			] ),
			`${ selector } > * { ${ itemRules.join( '\n' ) } }`,
		].join( '\n' );
	}, [ clientId, mdBreakpoint, smBreakpoint ] );
