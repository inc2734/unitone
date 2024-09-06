import clsx from 'clsx';

import {
	Button,
	ColorIndicator,
	Dropdown,
	FlexItem,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
	__experimentalHStack as HStack,
	__experimentalItem as Item,
} from '@wordpress/components';

import { __experimentalColorGradientControl as ColorGradientControl } from '@wordpress/block-editor';

const LabeledColorIndicator = ( { colorValue, label } ) => (
	<HStack justify="flex-start">
		<ColorIndicator
			className="block-editor-panel-color-gradient-settings__color-indicator"
			colorValue={ colorValue }
		/>
		<FlexItem
			className="block-editor-panel-color-gradient-settings__color-name"
			title={ label }
		>
			{ label }
		</FlexItem>
	</HStack>
);

const renderToggle =
	( _settings ) =>
	( { onToggle, isOpen } ) => {
		const { colorValue, label } = _settings;

		const toggleProps = {
			onClick: onToggle,
			className: clsx(
				'block-editor-panel-color-gradient-settings__dropdown',
				{ 'is-open': isOpen }
			),
			'aria-expanded': isOpen,
		};

		return (
			<Button { ...toggleProps }>
				<LabeledColorIndicator
					colorValue={ colorValue }
					label={ label }
				/>
			</Button>
		);
	};

export default function ( {
	colors,
	disableCustomColors,
	disableCustomGradients,
	enableAlpha,
	gradients,
	settings,
	...props
} ) {
	let popoverProps;

	return (
		<>
			{ settings.map( ( setting, index ) => {
				const controlProps = {
					clearable: false,
					colorValue: setting.colorValue,
					colors,
					disableCustomColors,
					disableCustomGradients,
					enableAlpha,
					gradientValue: setting.gradientValue,
					gradients,
					label: setting.label,
					onColorChange: setting.onColorChange,
					onGradientChange: setting.onGradientChange,
					showTitle: false,
					...setting,
				};
				const toggleSettings = {
					colorValue: setting.gradientValue ?? setting.colorValue,
					label: setting.label,
				};

				return (
					setting && (
						<Item key={ index } setting={ setting } { ...props }>
							<Dropdown
								popoverProps={ popoverProps }
								className="block-editor-tools-panel-color-gradient-settings__dropdown"
								renderToggle={ renderToggle( toggleSettings ) }
								renderContent={ () => (
									<DropdownContentWrapper paddingSize="none">
										<div className="block-editor-panel-color-gradient-settings__dropdown-content">
											<ColorGradientControl
												{ ...controlProps }
											/>
										</div>
									</DropdownContentWrapper>
								) }
							/>
						</Item>
					)
				);
			} ) }
		</>
	);
}
