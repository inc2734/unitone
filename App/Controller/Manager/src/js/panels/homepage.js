import { RadioControl, SelectControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { sprintf, __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import { ResetButton, SaveButton } from '../components/buttons';
import { withMinDelay } from '../utils/utils';

export default function ( { settings, setSettings } ) {
	const [ pages, setPages ] = useState( [] );
	const [ isCreatedHomepage, setIsCreatedHomepage ] = useState( false );
	const [ isCreatedPostsPage, setIsCreatedPostsPage ] = useState( false );
	const [ homepagePattern, setHomepagePattern ] = useState( undefined );
	const [ shouldCreatePostsPage, setShouldCreatePostsPage ] =
		useState( false );
	const [ settingsSaving, setSettingsSaving ] = useState( false );

	const loadPages = () => {
		apiFetch( {
			path: addQueryArgs( '/wp/v2/pages', { parent: 0, per_page: -1 } ),
		} ).then( ( response ) => {
			setPages( response );
		} );
	};

	async function saveSettings() {
		setSettingsSaving( 'save' );

		const saveOperation = ( async () => {
			const newSettings = { ...settings };

			if ( !! homepagePattern && ! isCreatedHomepage ) {
				try {
					const responseHomepage = await apiFetch( {
						path: '/unitone/v1/homepage',
						method: 'POST',
						data: { pattern: homepagePattern },
					} );

					if ( !! responseHomepage?.ID ) {
						setIsCreatedHomepage( true );

						setPages( [
							...[
								{
									id: responseHomepage.ID,
									title: {
										rendered: responseHomepage.post_title,
									},
								},
							],
							...pages,
						] );

						setSettings( {
							...settings,
							'page-on-front': responseHomepage.ID,
						} );

						newSettings[ 'page-on-front' ] = responseHomepage.ID;
					}
				} catch ( error ) {
					console.error( error ); // eslint-disable-line no-console
				}
			}

			if ( shouldCreatePostsPage && ! isCreatedPostsPage ) {
				try {
					const responsePostsPage = await apiFetch( {
						path: '/unitone/v1/posts-page',
						method: 'POST',
					} );

					if ( !! responsePostsPage?.ID ) {
						setIsCreatedPostsPage( true );

						setPages( [
							...[
								{
									id: responsePostsPage.ID,
									title: {
										rendered: responsePostsPage.post_title,
									},
								},
							],
							...pages,
						] );

						setSettings( {
							...settings,
							'page-for-posts': responsePostsPage.ID,
						} );

						newSettings[ 'page-for-posts' ] = responsePostsPage.ID;
					}
				} catch ( error ) {
					console.error( error ); // eslint-disable-line no-console
				}
			}

			await apiFetch( {
				path: '/unitone/v1/settings',
				method: 'POST',
				data: {
					'show-on-front': newSettings?.[ 'show-on-front' ] ?? null,
					'page-on-front': newSettings?.[ 'page-on-front' ] ?? null,
					'page-for-posts': newSettings?.[ 'page-for-posts' ] ?? null,
				},
			} );
		} )();

		withMinDelay( saveOperation ).then( () => {
			setSettingsSaving( false );
		} );
	}

	const resetSettings = () => {
		setSettingsSaving( 'reset' );

		setSettings( {
			...settings,
			'show-on-front': 'posts',
			'page-on-front': undefined,
			'page-for-posts': undefined,
		} );

		withMinDelay(
			apiFetch( {
				path: '/unitone/v1/settings',
				method: 'POST',
				data: {
					'show-on-front': 'posts',
					'page-on-front': null,
					'page-for-posts': null,
				},
			} )
		).then( () => {
			setSettingsSaving( false );
		} );
	};

	useEffect( () => {
		loadPages();
		setIsCreatedHomepage( settings?.hasHomepage );
		setIsCreatedPostsPage( settings.hasPostsPage );
	}, [ settings?.hasHomepage, settings.hasPostsPage ] );

	return (
		<div
			data-unitone-layout="decorator -padding:2"
			style={ {
				'--unitone--background-color': 'white',
				'--unitone--color': '#111',
			} }
		>
			<div data-unitone-layout="stack -gap:2">
				<h2>{ __( 'Your Homepage Displays', 'unitone' ) }</h2>
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
							<h3>{ __( 'Homepage Type', 'unitone' ) }</h3>
						</div>
						<div data-unitone-layout="stack">
							<RadioControl
								label={ __(
									'Your Homepage Displays',
									'unitone'
								) }
								selected={ settings?.[ 'show-on-front' ] }
								options={ [
									{
										label: __( 'Latest Posts', 'unitone' ),
										value: 'posts',
									},
									{
										label: __( 'Static Page', 'unitone' ),
										value: 'page',
									},
								] }
								onChange={ ( newSetting ) => {
									if ( 'posts' === newSetting ) {
										setHomepagePattern( undefined );
										setShouldCreatePostsPage( false );
									}
									setSettings( {
										...settings,
										'show-on-front': newSetting,
									} );
								} }
							/>
						</div>
					</div>

					{ settings?.[ 'show-on-front' ] === 'page' && (
						<>
							<div
								data-unitone-layout="with-sidebar -sidebar:left"
								style={ { '--unitone--sidebar-width': '20em' } }
							>
								<div data-unitone-layout="stack">
									<h3>{ __( 'Homepage', 'unitone' ) }</h3>
								</div>
								<div data-unitone-layout="stack">
									{ ! isCreatedHomepage && (
										<>
											<RadioControl
												selected={ homepagePattern }
												options={ [
													{
														value: 'blank',
														label: __(
															'Create a new blank page',
															'unitone'
														),
													},
												] }
												onChange={ ( newSetting ) => {
													setSettings( {
														...settings,
														'page-on-front': 0,
													} );
													setHomepagePattern(
														newSetting
													);
												} }
											/>

											<div className="unitone-settings-or">
												or
											</div>
										</>
									) }

									<SelectControl
										__next40pxDefaultSize
										__nextHasNoMarginBottom
										label={ __(
											'Select existing page for the homepage',
											'unitone'
										) }
										value={ settings?.[ 'page-on-front' ] }
										options={ [
											...[
												{
													label: __(
														'— Select —',
														'unitone'
													),
													value: 0,
												},
											],
											...pages.map( ( page ) => {
												return {
													label:
														page?.title?.rendered ||
														sprintf(
															/* translators: %1$s: Post ID */
															__(
																`#%1$s (No title)`,
																'unitone'
															),
															page.id
														),
													value: page.id,
												};
											} ),
										] }
										onChange={ ( newSetting ) => {
											setHomepagePattern( undefined );
											setSettings( {
												...settings,
												'page-on-front': newSetting,
											} );
										} }
									/>
								</div>
							</div>

							<div
								data-unitone-layout="with-sidebar -sidebar:left"
								style={ { '--unitone--sidebar-width': '20em' } }
							>
								<div data-unitone-layout="stack">
									<h3>{ __( 'Posts Page', 'unitone' ) }</h3>
								</div>
								<div data-unitone-layout="stack">
									{ ! isCreatedPostsPage && (
										<>
											<RadioControl
												selected={
													!! shouldCreatePostsPage
												}
												options={ [
													{
														value: true,
														label: __(
															'Create new page for the posts page',
															'unitone'
														),
													},
												] }
												onChange={ ( newSetting ) => {
													setSettings( {
														...settings,
														'page-for-posts': 0,
													} );
													setShouldCreatePostsPage(
														newSetting
													);
												} }
											/>

											<div className="unitone-settings-or">
												or
											</div>
										</>
									) }

									<SelectControl
										__next40pxDefaultSize
										__nextHasNoMarginBottom
										label={ __(
											'Select existing page for the posts page',
											'unitone'
										) }
										value={ settings?.[ 'page-for-posts' ] }
										options={ [
											...[
												{
													label: __(
														'— Select —',
														'unitone'
													),
													value: 0,
												},
											],
											...pages.map( ( page ) => {
												return {
													label:
														page?.title?.rendered ||
														sprintf(
															/* translators: %1$s: Post ID */
															__(
																`#%1$s (No title)`,
																'unitone'
															),
															page.id
														),
													value: page.id,
												};
											} ),
										] }
										onChange={ ( newSetting ) => {
											setShouldCreatePostsPage( false );
											setSettings( {
												...settings,
												'page-for-posts': newSetting,
											} );
										} }
									/>
								</div>
							</div>
						</>
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
