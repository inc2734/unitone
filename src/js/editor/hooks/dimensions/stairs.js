import clsx from 'clsx';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { SpacingSizeControl } from '../components';
import { cleanEmptyObject } from '../utils';

const leftIcon = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M7.35043 7.65095C7.35426 7.6474 7.35827 7.64406 7.36217 7.64059C7.37144 7.63228 7.38022 7.6235 7.38979 7.61573C7.50467 7.51241 7.65001 7.44165 7.8124 7.42515L7.88905 7.42169L13.4893 7.42169C13.9033 7.42184 14.2392 7.75752 14.2392 8.17161C14.2392 8.58573 13.9034 8.92138 13.4893 8.92153L9.64577 8.92153L17.4081 16.6838L16.3474 17.7445L8.60996 10.0071L8.61066 13.8002C8.61066 14.2143 8.27479 14.5499 7.86074 14.5501C7.44652 14.5501 7.11082 14.2144 7.11082 13.8002L7.11012 8.20062L7.11427 8.12328C7.11589 8.10736 7.11995 8.09192 7.12255 8.07632C7.12492 8.06198 7.12764 8.04772 7.13084 8.03351C7.13814 8.00147 7.1479 7.97061 7.15915 7.94028C7.16453 7.92565 7.1701 7.91112 7.17642 7.89678C7.18966 7.867 7.20513 7.83874 7.22199 7.81115C7.23301 7.793 7.24382 7.77466 7.25652 7.75729C7.26102 7.75117 7.26495 7.74463 7.26964 7.73865C7.28858 7.71433 7.30943 7.69057 7.33179 7.66821C7.3378 7.6622 7.34426 7.65671 7.35043 7.65095Z" />
	</svg>
);

const rightIcon = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M17.349 7.35043C17.3526 7.35426 17.3559 7.35827 17.3594 7.36217C17.3677 7.37144 17.3765 7.38022 17.3843 7.38979C17.4876 7.50467 17.5583 7.65001 17.5749 7.8124L17.5783 7.88905V13.4893C17.5782 13.9033 17.2425 14.2392 16.8284 14.2392C16.4143 14.2392 16.0786 13.9034 16.0785 13.4893V9.64577L8.31617 17.4081L7.25551 16.3474L14.9929 8.60996L11.1998 8.61066C10.7857 8.61066 10.4501 8.27479 10.4499 7.86074C10.4499 7.44652 10.7856 7.11082 11.1998 7.11082L16.7994 7.11012L16.8767 7.11427C16.8926 7.11589 16.9081 7.11995 16.9237 7.12255C16.938 7.12492 16.9523 7.12764 16.9665 7.13084C16.9985 7.13814 17.0294 7.1479 17.0597 7.15915C17.0744 7.16453 17.0889 7.1701 17.1032 7.17642C17.133 7.18966 17.1613 7.20513 17.1888 7.22199C17.207 7.23301 17.2253 7.24382 17.2427 7.25652C17.2488 7.26102 17.2554 7.26495 17.2614 7.26964C17.2857 7.28858 17.3094 7.30943 17.3318 7.33179C17.3378 7.3378 17.3433 7.34426 17.349 7.35043Z" />
	</svg>
);

const upDownIcon = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M19.749 7.35047C19.7526 7.35429 19.7559 7.35831 19.7594 7.36221C19.7677 7.37148 19.7765 7.38025 19.7842 7.38983C19.8876 7.50471 19.9583 7.65005 19.9748 7.81243L19.9783 7.88908V13.4893C19.9781 13.9034 19.6425 14.2392 19.2284 14.2392C18.8142 14.2392 18.4786 13.9034 18.4784 13.4893V9.6458L11.2465 16.8778C11.1251 16.9992 10.9716 17.0663 10.8135 17.087C10.8034 17.0885 10.7933 17.0886 10.7831 17.0898C10.7504 17.0927 10.7179 17.0952 10.6851 17.0939C10.6542 17.0933 10.6239 17.0893 10.5932 17.0849C10.584 17.0834 10.5748 17.0826 10.5656 17.0808C10.408 17.052 10.2577 16.9765 10.1423 16.8481L4.44196 10.5014L3.94063 9.94342L5.05654 8.94077L5.55786 9.49872L10.7376 15.2654L17.3929 8.61L13.5998 8.61069C13.1857 8.61069 12.8501 8.27483 12.8499 7.86077C12.8499 7.44656 13.1856 7.11085 13.5998 7.11085L19.1994 7.11016L19.2767 7.11431C19.2926 7.11593 19.3081 7.11999 19.3237 7.12259C19.338 7.12496 19.3523 7.12768 19.3665 7.13088C19.3985 7.13817 19.4294 7.14794 19.4597 7.15919C19.4743 7.16456 19.4889 7.17014 19.5032 7.17645C19.533 7.18969 19.5612 7.20517 19.5888 7.22203C19.607 7.23305 19.6253 7.24386 19.6427 7.25656C19.6488 7.26106 19.6553 7.26499 19.6613 7.26968C19.6856 7.28862 19.7094 7.30947 19.7318 7.33182C19.7378 7.33784 19.7433 7.3443 19.749 7.35047Z" />
	</svg>
);

const downUpIcon = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M19.749 16.7342C19.7526 16.7304 19.7559 16.7264 19.7594 16.7225C19.7677 16.7132 19.7765 16.7045 19.7842 16.6949C19.8876 16.58 19.9583 16.4347 19.9748 16.2723L19.9783 16.1956V10.5954C19.9781 10.1813 19.6425 9.84551 19.2284 9.84548C18.8142 9.84548 18.4786 10.1813 18.4784 10.5954V14.4389L11.2465 7.20695C11.1251 7.08552 10.9716 7.01846 10.8135 6.99772C10.8034 6.99619 10.7933 6.99608 10.7831 6.99496C10.7504 6.99201 10.7179 6.98947 10.6851 6.99081C10.6542 6.99144 10.6239 6.99538 10.5932 6.99979C10.584 7.00131 10.5748 7.00207 10.5656 7.00394C10.408 7.0327 10.2577 7.10821 10.1423 7.23665L4.44196 13.5833L3.94063 14.1413L5.05654 15.1439L5.55786 14.586L10.7376 8.81935L17.3929 15.4747L13.5998 15.474C13.1857 15.474 12.8501 15.8099 12.8499 16.2239C12.8499 16.6382 13.1856 16.9739 13.5998 16.9739L19.1994 16.9746L19.2767 16.9704C19.2926 16.9688 19.3081 16.9647 19.3237 16.9621C19.338 16.9598 19.3523 16.957 19.3665 16.9538C19.3985 16.9465 19.4294 16.9368 19.4597 16.9255C19.4743 16.9202 19.4889 16.9146 19.5032 16.9083C19.533 16.895 19.5612 16.8795 19.5888 16.8627C19.607 16.8517 19.6253 16.8409 19.6427 16.8282C19.6488 16.8237 19.6553 16.8197 19.6613 16.815C19.6856 16.7961 19.7094 16.7753 19.7318 16.7529C19.7378 16.7469 19.7433 16.7404 19.749 16.7342Z" />
	</svg>
);

export function hasStairsValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.stairs;

	return defaultValue !== unitone?.stairs && undefined !== unitone?.stairs;
}

export function hasStairsUpValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.stairsUp;

	return (
		defaultValue !== unitone?.stairsUp && undefined !== unitone?.stairsUp
	);
}

export function resetStairsFilter() {
	return {
		stairs: undefined,
	};
}

export function resetStairs( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetStairsFilter() )
		),
	} );
}

export function resetStairsUpFilter() {
	return {
		stairsUp: undefined,
	};
}

export function resetStairsUp( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetStairsUpFilter() )
		),
	} );
}

export function isStairsSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.stairs' );
}

export function getStairsEditLabel( {
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		__unstableUnitoneSupports?.stairs?.label ||
		__( 'Stairs grid', 'unitone' )
	);
}

export function StairsEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.stairs;
	}, [] );

	return (
		<SpacingSizeControl
			label={ label }
			value={ unitone?.stairs ?? defaultValue }
			onChange={ ( newValue ) => {
				if ( null != newValue ) {
					// RangeControl returns Int, SelectControl returns String.
					// So cast Int all values.
					newValue = String( newValue );
				}

				const newUnitone = {
					...unitone,
					stairs:
						newValue || ( null == defaultValue ? undefined : '' ),
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function getStairsUpEditLabel( { __unstableUnitoneSupports } ) {
	return (
		__unstableUnitoneSupports?.stairsUp?.label ||
		__( 'Stairs climbing direction', 'unitone' )
	);
}

export function StairsUpEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.stairsUp;
	}, [] );

	return (
		<ToggleGroupControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			isBlock
			label={ label }
			value={ unitone?.stairsUp ?? defaultValue }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					stairsUp: newValue || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		>
			<ToggleGroupControlOptionIcon
				label={ __( 'Left', 'unitone' ) }
				value="left"
				icon={ leftIcon }
			/>

			<ToggleGroupControlOptionIcon
				label={ __( 'Right', 'unitone' ) }
				value="right"
				icon={ rightIcon }
			/>

			<ToggleGroupControlOptionIcon
				label={ __( 'Up-Down', 'unitone' ) }
				value="up-down"
				icon={ upDownIcon }
			/>

			<ToggleGroupControlOptionIcon
				label={ __( 'Down-Up', 'unitone' ) }
				value="down-up"
				icon={ downUpIcon }
			/>
		</ToggleGroupControl>
	);
}

export function withStairsBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isStairsSupportDisabled( { name } ) ) {
		return settings;
	}

	const newStairs = {
		stairs: attributes?.unitone?.stairs,
		stairsUp: attributes?.unitone?.stairsUp,
	};

	if ( null == newStairs?.stairs && null == newStairs?.stairsUp ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				{
					[ `-stairs:${ newStairs?.stairs }` ]: !! newStairs?.stairs,
					[ `-stairs-up:${ newStairs?.stairsUp }` ]:
						!! newStairs?.stairsUp && !! newStairs?.stairs,
				}
			),
		},
	};
}
