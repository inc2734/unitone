import clsx from 'clsx';

import {
	__experimentalVStack as VStack,
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	__experimentalItemGroup as ItemGroup,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
	Button,
	FlexItem,
	Dropdown,
	RangeControl,
} from '@wordpress/components';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { Icon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { parallax as iconParallax } from './icons';
import { cleanEmptyObject } from '../utils';

export function hasParallaxValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.parallax;

	return (
		defaultValue !== unitone?.parallax && undefined !== unitone?.parallax
	);
}

function resetParallaxFilter( attributes ) {
	if ( null != attributes?.unitone?.parallax ) {
		attributes.unitone.parallax = undefined;
	}

	return attributes;
}

export function resetParallax( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetParallaxFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsParallaxDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.parallax' );
}

function renderShadowToggle() {
	return ( { onToggle, isOpen } ) => {
		const toggleProps = {
			onClick: onToggle,
			className: clsx( { 'is-open': isOpen } ),
			'aria-expanded': isOpen,
		};

		return (
			<Button { ...toggleProps }>
				<HStack justify="flex-start">
					<Icon
						className="block-editor-global-styles__toggle-icon"
						icon={ iconParallax }
						size={ 24 }
					/>
					<FlexItem>{ __( 'Parallax', 'unitone' ) }</FlexItem>
				</HStack>
			</Button>
		);
	};
}

function ParallaxPopover( { speed, onChangeSpeed } ) {
	const popoverProps = {
		placement: 'left-start',
		offset: 36,
		shift: true,
	};

	return (
		<Dropdown
			popoverProps={ popoverProps }
			className="block-editor-global-styles__shadow-dropdown"
			renderToggle={ renderShadowToggle() }
			renderContent={ () => (
				<DropdownContentWrapper paddingSize="medium">
					<div className="block-editor-global-styles__shadow-popover-container">
						<VStack spacing={ 4 }>
							<Heading level={ 5 }>
								{ __( 'Parallax', 'unitone' ) }
							</Heading>

							<RangeControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Speed', 'unitone' ) }
								value={ speed }
								initialPosition={ 0 }
								step={ 1 }
								min={ -5 }
								max={ 5 }
								onChange={ onChangeSpeed }
								allowReset
							/>
						</VStack>
					</div>
				</DropdownContentWrapper>
			) }
		/>
	);
}

export function ParallaxEdit( {
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.parallax;
	}, [] );

	return (
		<ItemGroup isBordered isSeparated>
			<ParallaxPopover
				speed={ parseFloat(
					unitone?.parallax?.speed ?? defaultValue ?? 0
				) }
				onChangeSpeed={ ( newAttribute ) => {
					const newUnitone = {
						...unitone,
						parallax: {
							...unitone?.parallax,
							speed: newAttribute || undefined,
						},
					};

					setAttributes( {
						unitone: cleanEmptyObject( newUnitone ),
					} );
				} }
			/>
		</ItemGroup>
	);
}

export function useParallaxBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.parallax;
		},
		[ name ]
	);

	if ( ! hasBlockSupport( name, 'unitone.parallax' ) ) {
		return settings;
	}

	const newParallax = {
		...defaultValue,
		...attributes?.unitone?.parallax,
	};

	if ( null == newParallax ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-parallax-speed': newParallax?.speed,
		},
	};
}
