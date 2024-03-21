import classnames from 'classnames';

import {
	registerFormatType,
	insertObject,
	useAnchor,
} from '@wordpress/rich-text';

import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Popover, ToggleControl } from '@wordpress/components';
import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const name = 'unitone/br';
const title = __( 'Line break per screen size', 'unitone' );

const settings = {
	name,
	title,
	tagName: 'span',
	className: 'unitone-br',
	attributes: {
		class: 'class',
	},
	interactive: true,
	contentEditable: false,
	edit: Edit,
};

const DEFAULT_OBJECT_SETTINGS = {
	type: name,
	innerHTML: '<br />',
};

function InlineUI( { value, onChange, activeObjectAttributes, contentRef } ) {
	const className =
		value.replacements.slice()?.[ value.start ]?.attributes?.class;

	const isDisableDesktop = () =>
		!! className?.match( /unitone-br--disable:desktop/ );
	const isDisableTablet = () =>
		!! className?.match( /unitone-br--disable:tablet/ );
	const isDisableMobile = () =>
		!! className?.match( /unitone-br--disable:mobile/ );

	const [ disableDesktop, setDisableDesktop ] = useState(
		isDisableDesktop()
	);
	const [ disableTablet, setDisableTablet ] = useState( isDisableTablet() );
	const [ disableMobile, setDisableMobile ] = useState( isDisableMobile() );

	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings,
	} );

	const onChangeDesktop = useCallback( ( newSetting ) => {
		setDisableDesktop( ! newSetting );

		// @todo 全部 disable にしちゃうと完全に見えなくなってしまうので、2つ disable のときは disable にできないようにする
		const newReplacements = value.replacements.slice();

		newReplacements[ value.start ] = {
			...DEFAULT_OBJECT_SETTINGS,
			attributes: {
				...activeObjectAttributes,
				class: classnames( {
					'unitone-br--disable:desktop': ! newSetting,
					'unitone-br--disable:tablet': disableTablet,
					'unitone-br--disable:mobile': disableMobile,
				} ),
			},
		};

		onChange( {
			...value,
			replacements: newReplacements,
		} );
	}, [] );

	const onChangeTablet = useCallback( ( newSetting ) => {
		setDisableTablet( ! newSetting );

		// @todo 全部 disable にしちゃうと完全に見えなくなってしまうので、2つ disable のときは disable にできないようにする
		const newReplacements = value.replacements.slice();

		newReplacements[ value.start ] = {
			...DEFAULT_OBJECT_SETTINGS,
			attributes: {
				...activeObjectAttributes,
				class: classnames( {
					'unitone-br--disable:desktop': disableDesktop,
					'unitone-br--disable:tablet': ! newSetting,
					'unitone-br--disable:mobile': disableMobile,
				} ),
			},
		};

		onChange( {
			...value,
			replacements: newReplacements,
		} );
	}, [] );

	const onChangeMobile = useCallback( ( newSetting ) => {
		setDisableMobile( ! newSetting );

		// @todo 全部 disable にしちゃうと完全に見えなくなってしまうので、2つ disable のときは disable にできないようにする
		const newReplacements = value.replacements.slice();

		newReplacements[ value.start ] = {
			...DEFAULT_OBJECT_SETTINGS,
			attributes: {
				...activeObjectAttributes,
				class: classnames( {
					'unitone-br--disable:desktop': disableDesktop,
					'unitone-br--disable:tablet': disableTablet,
					'unitone-br--disable:mobile': ! newSetting,
				} ),
			},
		};

		onChange( {
			...value,
			replacements: newReplacements,
		} );
	}, [] );

	return (
		<Popover
			placement="bottom"
			shift={ true }
			focusOnMount={ false }
			anchor={ popoverAnchor }
			className="block-editor-format-toolbar__image-popover"
		>
			<div
				style={ {
					width: '260px',
					padding: '16px',
				} }
			>
				<ToggleControl
					label={ __( 'Line breaks when on the desktop', 'unitone' ) }
					checked={ ! disableDesktop }
					onChange={ onChangeDesktop }
				/>

				<ToggleControl
					label={ __( 'Line breaks when on the tablet', 'unitone' ) }
					checked={ ! disableTablet }
					onChange={ onChangeTablet }
				/>

				<ToggleControl
					label={ __( 'Line breaks when on the mobile', 'unitone' ) }
					checked={ ! disableMobile }
					onChange={ onChangeMobile }
					__nextHasNoMarginBottom
				/>
			</div>
		</Popover>
	);
}

function Edit( {
	value,
	onChange,
	onFocus,
	isObjectActive,
	activeObjectAttributes,
	contentRef,
} ) {
	return (
		<>
			<RichTextToolbarButton
				icon={
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M18.0224 5.25C18.4366 5.25 18.7724 5.58579 18.7724 6V15C18.7724 15.4142 18.4366 15.75 18.0224 15.75L18.0112 15.7499L18 15.75H10.0784V19L4.5 14.8349L10.0784 10.6699V14.25H17.2724V6C17.2724 5.58579 17.6082 5.25 18.0224 5.25Z"
							fill="currentColor"
						/>
					</svg>
				}
				title={ title }
				onClick={ () => {
					const newValue = insertObject(
						value,
						{
							...DEFAULT_OBJECT_SETTINGS,
						},
						value.end,
						value.end
					);
					newValue.start = newValue.end - 1;
					onChange( newValue );

					onFocus();
				} }
				isActive={ isObjectActive }
			/>

			{ isObjectActive && (
				<InlineUI
					value={ value }
					onChange={ onChange }
					activeObjectAttributes={ activeObjectAttributes }
					contentRef={ contentRef }
				/>
			) }
		</>
	);
}

registerFormatType( settings.name, settings );
