import {
	Button,
	__experimentalNavigatorProvider as NavigatorProvider,
	__experimentalNavigatorScreen as NavigatorScreen,
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';

import { NavigableRegion } from '@wordpress/interface';
import { chevronLeft, wordpress, external, Icon } from '@wordpress/icons';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import License from './panels/license';
import PatternLibrary from './panels/pattern-library';
import Brand from './panels/brand';
import Typography from './panels/typography';
import Layout from './panels/layout';
import Homepage from './panels/homepage';
import CustomTemplates from './panels/custom-templates';
import BlogCard from './panels/blog-card';

export default function () {
	const [ defaultSettings, setDefaultSettings ] = useState( [] );
	const [ settings, setSettings ] = useState( [] );

	useEffect( () => {
		setDefaultSettings( window.defaultSettings );
		setSettings( window.currentSettings );
	}, [] );

	return (
		<>
			<div className="edit-site-layout">
				<div className="edit-site-layout__header-container">
					<div className="edit-site-site-hub edit-site-layout__hub">
						<HStack
							justify="space-between"
							alignment="center"
							className="edit-site-site-hub__container"
						>
							<HStack
								justify="flex-start"
								className="edit-site-site-hub__text-content"
								spacing="0"
							>
								<div className="edit-site-site-hub__view-mode-toggle-container">
									<Button
										href={ settings.adminUrl }
										label={ __(
											'Go to the Dashboard',
											'unitone'
										) }
										className="edit-site-layout__view-mode-toggle"
										showTooltip={ false }
									>
										<div
											style={ {
												transform: 'scale(0.5)',
											} }
										>
											<div className="edit-site-site-icon__icon edit-site-layout__view-mode-toggle-icon">
												<Icon
													className="edit-site-site-icon__icon"
													size="48px"
													icon={ wordpress }
												/>
											</div>
										</div>
									</Button>
								</div>

								<div className="edit-site-site-hub__site-title">
									{ settings.siteTitle }
								</div>

								<Button
									href={ settings.homeUrl }
									target="_blank"
									label={ __(
										'View site (opens in a new tab)',
										'unitone'
									) }
									aria-label={ __(
										'View site (opens in a new tab)',
										'unitone'
									) }
									icon={ external }
									className="edit-site-site-hub__site-view-link"
								/>
							</HStack>
						</HStack>
					</div>
				</div>

				<div className="edit-site-layout__content">
					<NavigableRegion
						ariaLabel={ __( 'Navigation', 'unitone' ) }
						className="edit-site-layout__sidebar-region"
					>
						<div className="edit-site-layout__sidebar">
							<NavigatorProvider
								className="edit-site-sidebar__content"
								initialPath="/"
							>
								<NavigatorScreen path="/">
									<VStack
										className="edit-site-sidebar-navigation-screen__main"
										spacing={ 0 }
										justify="flex-start"
									>
										<HStack
											spacing={ 4 }
											alignment="flex-start"
											className="edit-site-sidebar-navigation-screen__title-icon"
										>
											<Button
												href={ settings.adminUrl }
												label={ __(
													'Go to the Dashboard',
													'unitone'
												) }
												className="edit-site-sidebar-button"
												icon={ chevronLeft }
											/>

											<Heading
												className="edit-site-sidebar-navigation-screen__title"
												color={
													'#e0e0e0' /* $gray-200 */
												}
												level={ 1 }
												size={ 20 }
											>
												{ __(
													'unitone Setup',
													'unitone'
												) }
											</Heading>
										</HStack>
									</VStack>
								</NavigatorScreen>
							</NavigatorProvider>
						</div>
					</NavigableRegion>

					<div className="edit-site-layout__canvas-container">
						<div className="edit-site-layout__canvas">
							<div className="unitone-settings">
								<div>
									<div data-unitone-layout="stack">
										<License
											settings={ settings }
											defaultSettings={ defaultSettings }
											setSettings={ setSettings }
										/>

										<PatternLibrary settings={ settings } />

										<Brand
											settings={ settings }
											defaultSettings={ defaultSettings }
											setSettings={ setSettings }
										/>

										<Typography
											settings={ settings }
											defaultSettings={ defaultSettings }
											setSettings={ setSettings }
										/>

										<Layout
											settings={ settings }
											defaultSettings={ defaultSettings }
											setSettings={ setSettings }
										/>

										<Homepage
											settings={ settings }
											defaultSettings={ defaultSettings }
											setSettings={ setSettings }
										/>

										<CustomTemplates
											settings={ settings }
											defaultSettings={ defaultSettings }
											setSettings={ setSettings }
										/>

										<BlogCard
											settings={ settings }
											defaultSettings={ defaultSettings }
											setSettings={ setSettings }
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
