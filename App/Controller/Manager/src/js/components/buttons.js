import { Button, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const LoadingLabel = ( { isLoading, children } ) => (
	<span
		style={ {
			display: 'flex',
			alignItems: 'center',
			gap: '0.5em',
		} }
	>
		{ isLoading && (
			<Spinner
				style={ {
					margin: '0',
					width: '12px',
					height: '12px',
				} }
			/>
		) }
		{ children }
	</span>
);

const getDisabled = ( disabled, isSaving, isProcessing ) =>
	!! disabled || !! isSaving || !! isProcessing;

export const SaveButton = ( {
	isSaving,
	isProcessing = false,
	onClick,
	disabled,
} ) => {
	const isLoading = isProcessing || 'save' === isSaving;
	return (
		<Button
			variant="primary"
			onClick={ onClick }
			disabled={ getDisabled( disabled, isSaving, isProcessing ) }
		>
			<LoadingLabel isLoading={ isLoading }>
				{ __( 'Save Settings', 'unitone' ) }
			</LoadingLabel>
		</Button>
	);
};

export const ResetButton = ( {
	isSaving,
	isProcessing = false,
	onClick,
	disabled,
} ) => {
	const isLoading = isProcessing || 'reset' === isSaving;
	return (
		<Button
			variant="secondary"
			onClick={ onClick }
			disabled={ getDisabled( disabled, isSaving, isProcessing ) }
		>
			<LoadingLabel isLoading={ isLoading }>
				{ __( 'Reset All Settings', 'unitone' ) }
			</LoadingLabel>
		</Button>
	);
};

export const LoadingButton = ( {
	label,
	isLoading,
	onClick,
	disabled,
	variant = 'primary',
} ) => (
	<Button
		variant={ variant }
		onClick={ onClick }
		disabled={ !! disabled || !! isLoading }
	>
		<LoadingLabel isLoading={ isLoading }>{ label }</LoadingLabel>
	</Button>
);
