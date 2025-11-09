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
				${ selector } > * {
					grid-column: var(${ prefix }-grid-column);
					grid-row: var(${ prefix }-grid-row);
				}

				${ selector }[data-unitone-layout~="-columns\\:${ size }\\:columns"] {
					grid-template-columns: repeat(var(${ prefix }-columns), 1fr);
				}

				${ selector }[data-unitone-layout~="-columns\\:${ size }\\:min"] {
					grid-template-columns: repeat(var(--unitone--column-auto-repeat), minmax(min(var(${ prefix }-column-min-width), 100%), 1fr));
				}

				${ selector }[data-unitone-layout~="-columns\\:${ size }\\:free"] {
					grid-template-columns: var(${ prefix }-grid-template-columns);
				}

				${ selector }[data-unitone-layout~="-rows\\:${ size }\\:rows"] {
					grid-template-rows: repeat(var(${ prefix }-rows), 1fr);
				}

				${ selector }[data-unitone-layout~="-rows\\:${ size }\\:free"] {
					grid-template-rows: var(${ prefix }-grid-template-rows);
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
