import { Notice, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { Icon, check, close } from '@wordpress/icons';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import { ResetButton, SaveButton } from '../components/buttons';
import { withMinDelay } from '../utils/utils';

export default function () {
	const [ settingsSaving, setSettingsSaving ] = useState( false );
	const [ licenseStatus, setLicenseStatus ] = useState( undefined );
	const [ licenseError, setLicenseError ] = useState( '' );
	const [ remotePatternsSaving, setRemotePatternsSaving ] = useState( false );
	const [ licenseKey, setLicenseKey ] = useState( '' );
	const [ hasSavedLicenseKey, setHasSavedLicenseKey ] = useState( false );
	const [ isLicenseKeyTouched, setIsLicenseKeyTouched ] = useState( false );

	const loadLicenseStatus = ( { force } ) => {
		return apiFetch( {
			path: addQueryArgs( '/unitone/v1/license-status', {
				force: Number( force ),
			} ),
		} ).then( ( options ) => {
			if ( ! [ 'true', 'false' ].includes( options ) ) {
				throw new Error(
					__(
						'Could not verify the license. Please try again shortly.',
						'unitone'
					)
				);
			}
			setLicenseStatus( 'true' === options );
		} );
	};

	const handleError = ( error ) => {
		setLicenseStatus( null );
		setLicenseError(
			error?.message ||
				__(
					'Could not verify the license. Please try again shortly.',
					'unitone'
				)
		);
	};

	const resetRemotePattenrsCache = ( action ) => {
		setRemotePatternsSaving( action );

		return apiFetch( {
			path: '/unitone/v1/remote-block-patterns',
			method: 'DELETE',
		} ).finally( () => {
			setRemotePatternsSaving( false );
		} );
	};

	const saveSettings = () => {
		setSettingsSaving( 'save' );
		setLicenseStatus( undefined );
		setLicenseError( '' );

		if ( ! isLicenseKeyTouched ) {
			loadLicenseStatus( { force: true } )
				.then( () => resetRemotePattenrsCache( 'save' ) )
				.catch( handleError )
				.finally( () => setSettingsSaving( false ) );
			return;
		}

		withMinDelay(
			apiFetch( {
				path: '/unitone/v1/settings',
				method: 'POST',
				data: {
					'license-key': licenseKey || null,
				},
			} )
		)
			.then( () => {
				setHasSavedLicenseKey( !! licenseKey );
				setLicenseKey( '' );
				setIsLicenseKeyTouched( false );
				return loadLicenseStatus( { force: true } );
			} )
			.then( () => resetRemotePattenrsCache( 'save' ) )
			.catch( handleError )
			.finally( () => setSettingsSaving( false ) );
	};

	const resetSettings = () => {
		setSettingsSaving( 'reset' );
		setLicenseError( '' );

		withMinDelay(
			apiFetch( {
				path: '/unitone/v1/settings',
				method: 'POST',
				data: {
					'license-key': null,
				},
			} )
		)
			.then( () => {
				setLicenseKey( '' );
				setHasSavedLicenseKey( false );
				setIsLicenseKeyTouched( false );
				setLicenseStatus( false );
				return resetRemotePattenrsCache( 'reset' );
			} )
			.catch( handleError )
			.finally( () => setSettingsSaving( false ) );
	};

	useEffect( () => {
		loadLicenseStatus( { force: false } ).catch( handleError );
	}, [] );

	useEffect( () => {
		let isMounted = true;

		apiFetch( { path: '/unitone/v1/license-key' } )
			.then( ( response ) => {
				if ( isMounted ) {
					setHasSavedLicenseKey( !! response?.has_license_key );
				}
			} )
			.catch( () => {
				if ( isMounted ) {
					setHasSavedLicenseKey( false );
				}
			} );

		return () => {
			isMounted = false;
		};
	}, [] );

	return (
		<div
			data-unitone-layout="decorator -padding:2"
			style={ {
				'--unitone--background-color': 'white',
				'--unitone--color': '#111',
			} }
		>
			<div data-unitone-layout="stack -gap:2">
				<h2>{ __( 'License', 'unitone' ) }</h2>
				{ licenseError && (
					<Notice status="error" isDismissible={ false }>
						{ licenseError }
					</Notice>
				) }
				<div
					data-unitone-layout="stack -divider:stripe -gap:2"
					style={ {
						'--unitone--divider-color':
							'var(--unitone--color--light-gray)',
					} }
				>
					<div
						data-unitone-layout="with-sidebar -sidebar:left"
						style={ { '--unitone--sidebar-width': '20em' } }
					>
						<div>
							<h3>{ __( 'License Key', 'unitone' ) }</h3>
						</div>
						<div data-unitone-layout="stack">
							<p>
								{ __(
									'If your license key is valid, you will be able to use unitone more conveniently.',
									'unitone'
								) }
							</p>
							<div
								data-unitone-layout="with-sidebar -gap:-2"
								style={ { '--unitone--sidebar-width': '25px' } }
							>
								<TextControl
									key={
										hasSavedLicenseKey &&
										! isLicenseKeyTouched
											? 'saved-license-key'
											: 'editing-license-key'
									}
									__nextHasNoMarginBottom
									help={ __(
										'If the license key entered is valid, the theme can be updated.',
										'unitone'
									) }
									type="password"
									value={
										hasSavedLicenseKey &&
										! isLicenseKeyTouched
											? ''
											: licenseKey
									}
									placeholder={
										hasSavedLicenseKey
											? '**************************************************'
											: ''
									}
									style={ { width: '100%' } }
									onChange={ ( newSetting ) => {
										setLicenseKey( newSetting );
										setIsLicenseKeyTouched( true );
									} }
								/>

								<div style={ { paddingTop: '4px' } }>
									{ undefined === licenseStatus && (
										<div
											className="unitone-loading-icon"
											style={ { margin: '4px' } }
										></div>
									) }
									{ 'boolean' === typeof licenseStatus && (
										<Icon
											style={ {
												color: licenseStatus
													? '#00d084'
													: '#cf2e2e',
											} }
											icon={
												licenseStatus ? check : close
											}
										/>
									) }
								</div>
							</div>
						</div>
					</div>
				</div>

				<div data-unitone-layout="cluster -gap:-1">
					<SaveButton
						onClick={ saveSettings }
						isSaving={ settingsSaving }
						disabled={ !! remotePatternsSaving }
						isProcessing={ 'save' === remotePatternsSaving }
					/>

					<ResetButton
						onClick={ resetSettings }
						isSaving={ settingsSaving }
						disabled={ !! remotePatternsSaving }
						isProcessing={ 'reset' === remotePatternsSaving }
					/>
				</div>
			</div>
		</div>
	);
}
