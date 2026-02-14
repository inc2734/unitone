import { Notice, SelectControl, TextControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import { ResetButton, SaveButton } from '../components/buttons';
import { withMinDelay } from '../utils/utils';

export default function () {
	const [ settingsSaving, setSettingsSaving ] = useState( false );

	const [ apiKey, setApiKey ] = useEntityProp(
		'root',
		'site',
		'unitone_openai_api_key'
	);

	const [ model, setModel ] = useEntityProp(
		'root',
		'site',
		'unitone_openai_model'
	);

	const savedApiKey = useSelect( ( select ) => {
		const { getEntityRecord } = select( 'core' );
		const site = getEntityRecord( 'root', 'site' );
		return site?.unitone_openai_api_key;
	}, [] );

	const isApiKeyDirty = ( apiKey ?? '' ) !== ( savedApiKey ?? '' );

	const [ models, setModels ] = useState( [] );
	const [ modelsLoading, setModelsLoading ] = useState( false );
	const [ modelsError, setModelsError ] = useState( null );

	useEffect( () => {
		const hasApiKey = !! ( savedApiKey ?? '' );

		if ( ! hasApiKey ) {
			setModels( [] );
			setModelsLoading( false );
			setModelsError( null );
			return;
		}

		setModelsLoading( true );
		setModelsError( null );

		apiFetch( { path: '/unitone/v1/openai-models' } )
			.then( ( response ) => {
				const fetchedModels = response?.models ?? [];
				setModels( fetchedModels );
			} )
			.catch( ( fetchError ) => {
				const errorMessage =
					fetchError?.data?.message ||
					fetchError?.message ||
					__( 'Failed to load models.', 'unitone' );
				setModelsError( errorMessage );
				setModels( [] );
			} )
			.finally( () => {
				setModelsLoading( false );
			} );
	}, [ savedApiKey ] );

	const saveSettings = () => {
		setSettingsSaving( 'save' );

		withMinDelay(
			Promise.all( [
				apiFetch( {
					path: '/unitone/v1/openai-api-key',
					method: 'POST',
					data: {
						key: apiKey,
					},
				} ),
				apiFetch( {
					path: '/unitone/v1/openai-model',
					method: 'POST',
					data: {
						model,
					},
				} ),
			] )
		).finally( () => {
			setSettingsSaving( false );
		} );
	};

	const resetSettings = () => {
		setSettingsSaving( 'reset' );
		setApiKey( undefined );
		setModel( undefined );

		withMinDelay(
			Promise.all( [
				apiFetch( {
					path: '/unitone/v1/openai-api-key',
					method: 'POST',
					data: {
						key: undefined,
					},
				} ),

				apiFetch( {
					path: '/unitone/v1/openai-model',
					method: 'POST',
					data: {
						model: undefined,
					},
				} ),
			] )
		).finally( () => {
			setSettingsSaving( false );
		} );
	};

	const filteredModels = models.filter( ( value ) => {
		if ( ! value || 'string' !== typeof value ) {
			return false;
		}

		if ( ! value.match( '^gpt-[\\d]' ) ) {
			return false;
		}

		if ( value.includes( 'codex' ) ) {
			return false;
		}

		const suffixes = [ 'mini', 'nano', 'pro' ];
		const dashCount = ( value.match( /-/g ) || [] ).length;
		const isBase = dashCount <= 1;
		const hasAllowedSuffix = suffixes.some( ( suffix ) =>
			value.endsWith( `-${ suffix }` )
		);

		return isBase || hasAllowedSuffix;
	} );

	const modelOptions = [
		{ label: '', value: '' },
		...filteredModels.map( ( value ) => ( {
			label: value,
			value,
		} ) ),
	];

	return (
		<div
			data-unitone-layout="decorator -padding:2"
			style={ {
				'--unitone--background-color': 'white',
				'--unitone--color': '#111',
			} }
		>
			<div data-unitone-layout="stack -gap:2">
				<h2>{ __( 'OpenAI', 'unitone' ) }</h2>
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
						<div data-unitone-layout="stack">
							<h3>{ __( 'API Key', 'unitone' ) }</h3>
						</div>
						<div data-unitone-layout="stack">
							<div data-unitone-layout="stack -gap:-2">
								<TextControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									value={ apiKey ?? '' }
									onChange={ ( newSetting ) =>
										setApiKey( newSetting )
									}
									type="password"
								/>
							</div>
						</div>
					</div>

					{ !! ( savedApiKey ?? '' ) && (
						<div
							data-unitone-layout="with-sidebar -sidebar:left"
							style={ { '--unitone--sidebar-width': '20em' } }
						>
							<div data-unitone-layout="stack">
								<h3>{ __( 'Model to use', 'unitone' ) }</h3>
							</div>
							<div data-unitone-layout="stack">
								<div data-unitone-layout="stack -gap:-2">
									<SelectControl
										__next40pxDefaultSize
										__nextHasNoMarginBottom
										value={ model }
										onChange={ ( newSetting ) =>
											setModel( newSetting )
										}
										options={ modelOptions }
										disabled={
											modelsLoading || isApiKeyDirty
										}
									/>

									<div>
										<span
											dangerouslySetInnerHTML={ {
												__html: sprintf(
													// translators: %1$s: <a>, %2$s: </a>
													__(
														'Using the API incurs charges. Please check the %1$sAPI pricing%2$s page for details.',
														'unitone'
													),
													'<a href="https://openai.com/api/pricing/" target="_blank" rel="noopener noreferrer">',
													'</a>'
												),
											} }
										/>
									</div>

									{ modelsError && (
										<Notice
											status="warning"
											isDismissible={ false }
										>
											{ modelsError }
										</Notice>
									) }
								</div>
							</div>
						</div>
					) }
				</div>

				<div data-unitone-layout="cluster -gap:-1">
					<SaveButton
						onClick={ saveSettings }
						isSaving={ settingsSaving }
					/>

					<ResetButton
						onClick={ resetSettings }
						isSaving={ settingsSaving }
					/>
				</div>
			</div>
		</div>
	);
}
