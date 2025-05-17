import clsx from 'clsx';

import {
	__experimentalVStack as VStack,
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	__experimentalItemGroup as ItemGroup,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
	BaseControl,
	Button,
	FlexItem,
	Dropdown,
} from '@wordpress/components';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSettings } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useMemo, useRef } from '@wordpress/element';
import { shadow as shadowIcon, Icon, check, reset } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasDropShadowValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.dropShadow;

	return (
		defaultValue !== unitone?.dropShadow &&
		undefined !== unitone?.dropShadow
	);
}

export function resetDropShadowFilter() {
	return {
		dropShadow: undefined,
	};
}

export function resetDropShadow( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetDropShadowFilter() )
		),
	} );
}

export function useIsDropShadowDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.dropShadow' );
}

export function getDropShadowEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Drop shadow' );
	const defaultCode = <code>filter:drop-shadow</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.dropShadow?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.dropShadow?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.dropShadow?.code || defaultCode }
		</>
	);
}

const EMPTY_ARRAY = [];

function useShadowPresets( settings ) {
	return useMemo( () => {
		if ( ! settings ) {
			return EMPTY_ARRAY;
		}

		const defaultPresetsEnabled = settings?.defaultPresets;
		const {
			default: defaultShadows,
			theme: themeShadows,
			custom: customShadows,
		} = settings?.presets ?? {};

		const unsetShadow = {
			name: __( 'Unset' ),
			slug: 'unset',
			shadow: 'none',
		};

		const shadowPresets = [
			...( ( defaultPresetsEnabled && defaultShadows ) || EMPTY_ARRAY ),
			...( themeShadows || EMPTY_ARRAY ),
			...( customShadows || EMPTY_ARRAY ),
		];
		if ( shadowPresets.length ) {
			shadowPresets.unshift( unsetShadow );
		}

		return shadowPresets.filter( ( preset ) => {
			const shadow = preset?.shadow?.replace( /\(.*?\)/, 'dummyColor' );
			if ( shadow?.match( ',' ) ) {
				return false;
			}
			if ( shadow?.match( /(\S+?\s){4}/ ) ) {
				return false;
			}
			return true;
		} );
	}, [ settings ] );
}

function ShadowPopoverContainer( { shadow, onShadowChange, settings } ) {
	const shadows = useShadowPresets( settings );

	return (
		<div className="block-editor-global-styles__shadow-popover-container">
			<VStack spacing={ 4 }>
				<Heading level={ 5 }>{ __( 'Drop shadow' ) }</Heading>
				<ShadowPresets
					presets={ shadows }
					activeShadow={ shadow }
					onSelect={ onShadowChange }
				/>
				<div className="block-editor-global-styles__clear-shadow">
					<Button
						variant="tertiary"
						onClick={ () => onShadowChange( undefined ) }
					>
						{ __( 'Clear' ) }
					</Button>
				</div>
			</VStack>
		</div>
	);
}

function ShadowPresets( { presets, activeShadow, onSelect } ) {
	return ! presets ? null : (
		<div
			role="listbox"
			className="block-editor-global-styles__shadow__list"
			aria-label={ __( 'Drop shadows' ) }
		>
			{ presets.map( ( { name, slug, shadow } ) => (
				<ShadowIndicator
					key={ slug }
					label={ name }
					isActive={ shadow === activeShadow }
					type={ slug === 'unset' ? 'unset' : 'preset' }
					onSelect={ () =>
						onSelect( shadow === activeShadow ? undefined : shadow )
					}
					shadow={ shadow }
				/>
			) ) }
		</div>
	);
}

function ShadowIndicator( { type, label, isActive, onSelect, shadow } ) {
	return (
		<div
			role="option"
			aria-label={ label }
			aria-selected={ isActive }
			className={ clsx( 'block-editor-global-styles__shadow__item', {
				'is-active': isActive,
			} ) }
		>
			<Button
				className={ clsx(
					'block-editor-global-styles__shadow-indicator',
					{
						unset: type === 'unset',
					}
				) }
				onClick={ onSelect }
				label={ label }
				style={ { boxShadow: shadow } }
				showTooltip
			>
				{ isActive && <Icon icon={ check } /> }
			</Button>
		</div>
	);
}

function renderToggle( { hasValue, resetValue } ) {
	return ( { onToggle, isOpen } ) => {
		const ref = useRef( undefined );

		const toggleProps = {
			onClick: onToggle,
			className: clsx( { 'is-open': isOpen } ),
			'aria-expanded': isOpen,
			ref,
		};

		const removeButtonProps = {
			onClick: () => {
				if ( isOpen ) {
					onToggle();
				}
				resetValue();
				// Return focus to parent button.
				ref.current?.focus();
			},
			className: clsx(
				'block-editor-global-styles__shadow-editor__remove-button',
				{ 'is-open': isOpen }
			),
			label: __( 'Remove' ),
		};

		return (
			<>
				<Button { ...toggleProps }>
					<HStack justify="flex-start">
						<Icon
							className="block-editor-global-styles__toggle-icon"
							icon={ shadowIcon }
							size={ 24 }
						/>
						<FlexItem>{ __( 'Drop shadow' ) }</FlexItem>
					</HStack>
				</Button>

				{ !! hasValue && (
					<Button
						__next40pxDefaultSize
						size="small"
						icon={ reset }
						{ ...removeButtonProps }
					/>
				) }
			</>
		);
	};
}

function ShadowPopover( {
	hasValue,
	resetValue,
	shadow,
	onShadowChange,
	settings,
} ) {
	const popoverProps = {
		placement: 'left-start',
		offset: 36,
		shift: true,
	};

	return (
		<Dropdown
			popoverProps={ popoverProps }
			className="block-editor-global-styles__shadow-dropdown"
			renderToggle={ renderToggle( { hasValue, resetValue } ) }
			renderContent={ () => (
				<DropdownContentWrapper paddingSize="medium">
					<ShadowPopoverContainer
						shadow={ shadow }
						onShadowChange={ onShadowChange }
						settings={ settings }
					/>
				</DropdownContentWrapper>
			) }
		/>
	);
}

export function DropShadowEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const [ settings ] = useSettings( 'shadow' );

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.dropShadow;
	}, [] );

	const mergedShadowPresets = useShadowPresets( settings ) ?? [];

	const defaultShadow = mergedShadowPresets?.find( ( { slug } ) => {
		return `var:preset|shadow|${ slug }` === defaultValue;
	} )?.shadow;

	const shadow = mergedShadowPresets?.find( ( { slug } ) => {
		return `var:preset|shadow|${ slug }` === unitone?.dropShadow;
	} )?.shadow;

	return (
		<>
			<BaseControl.VisualLabel as="legend">
				{ __( 'Filter', 'unitone' ) }
			</BaseControl.VisualLabel>

			<ItemGroup isBordered isSeparated>
				<ShadowPopover
					label={ label }
					hasValue={ hasDropShadowValue( {
						name,
						attributes: { unitone },
					} ) }
					resetValue={ () => {
						resetDropShadow( {
							attributes: { unitone },
							setAttributes,
						} );
					} }
					shadow={ shadow ?? defaultShadow }
					settings={ settings }
					onShadowChange={ ( newValue ) => {
						const slug = mergedShadowPresets?.find(
							( { shadow: shadowName } ) =>
								shadowName === newValue
						)?.slug;

						const newUnitone = {
							...unitone,
							dropShadow: slug
								? `var:preset|shadow|${ slug }`
								: newValue || undefined,
						};

						setAttributes( {
							unitone: cleanEmptyObject( newUnitone ),
						} );
					} }
				/>
			</ItemGroup>
		</>
	);
}

export function useDropShadowBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.dropShadow;
		},
		[ name ]
	);

	if ( ! hasBlockSupport( name, 'unitone.dropShadow' ) ) {
		return settings;
	}

	const newDropShadow = attributes?.unitone?.dropShadow ?? defaultValue;

	if ( null == newDropShadow ) {
		return settings;
	}

	const slug = newDropShadow?.match( /var:preset\|shadow\|(.+)/ )?.[ 1 ];

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--drop-shadow': !! slug
					? `var(--wp--preset--shadow--${ slug })`
					: newDropShadow,
			},
		},
	};
}
