import { useMemo } from '@wordpress/element';

export const useResponsiveGridCSS = ( {
	clientId,
	mdBreakpoint,
	smBreakpoint,
} ) =>
	useMemo( () => {
		const selector = `[data-unitone-client-id="${ clientId }"]`;

		const buildCSS = ( breakpoint, size ) => {
			const prefix = `--unitone--${ size }`;

			return `@media not all and (min-width: ${ breakpoint }) {
				${ selector }[data-unitone-layout~="-columns\\:${ size }\\:columns"] {
					--unitone--active--columns: var(${ prefix }-columns);
				}

				${ selector }[data-unitone-layout~="-columns\\:${ size }\\:min"] {
					--unitone--active--column-min-width: var(${ prefix }-column-min-width);
				}

				${ selector }[data-unitone-layout~="-columns\\:${ size }\\:free"] {
					--unitone--active--grid-template-columns: var(${ prefix }-grid-template-columns);
				}

				${ selector }[data-unitone-layout~="-rows\\:${ size }\\:rows"] {
					--unitone--active--rows: var(${ prefix }-rows);
				}

				${ selector }[data-unitone-layout~="-rows\\:${ size }\\:free"] {
					--unitone--active--grid-template-rows: var(${ prefix }-grid-template-rows);
				}

				${ selector } > * {
					--unitone--active--grid-column: var(${ prefix }-grid-column);
					--unitone--active--grid-row: var(${ prefix }-grid-row);
					--unitone--active--align-self: var(${ prefix }-align-self);
					--unitone--active--justify-self: var(${ prefix }-justify-self);
				}
			}`;
		};

		return [
			buildCSS( mdBreakpoint, 'md' ),
			buildCSS( smBreakpoint, 'sm' ),
		]
			.filter( Boolean )
			.join( '\n' );
	}, [ clientId, mdBreakpoint, smBreakpoint ] );
