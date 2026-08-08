import {
	Button,
	Navigator,
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';

import { NavigableRegion } from '@wordpress/admin-ui';
import { chevronLeft } from '@wordpress/icons';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ThemeProvider } from '@wordpress/theme';

import License from './panels/license';
import PatternLibrary from './panels/pattern-library';
import Brand from './panels/brand';
import Typography from './panels/typography';
import Layout from './panels/layout';
import Homepage from './panels/homepage';
import CustomTemplates from './panels/custom-templates';
import BlogCard from './panels/blog-card';
import OGP from './panels/ogp';
import GeneratedThumbnail from './panels/generated-thumbnail';
import OpenAI from './panels/openai';

export default function ( { adminThemeColors } ) {
	const [ defaultSettings, setDefaultSettings ] = useState( [] );
	const [ settings, setSettings ] = useState( [] );

	useEffect( () => {
		setDefaultSettings( window.defaultSettings );
		setSettings( window.currentSettings );
	}, [] );

	return (
		<>
			<div className="edit-site-layout">
				<div className="edit-site-layout__content">
					<ThemeProvider color={ adminThemeColors }>
						<NavigableRegion
							ariaLabel={ __( 'Navigation', 'unitone' ) }
							className="edit-site-layout__sidebar-region"
						>
							<div className="edit-site-layout__sidebar">
								<Navigator
									className="edit-site-sidebar__content"
									initialPath="/"
								>
									<Navigator.Screen path="/">
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
									</Navigator.Screen>
								</Navigator>
							</div>
						</NavigableRegion>
					</ThemeProvider>

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

										<PatternLibrary
											settings={ settings }
											defaultSettings={ defaultSettings }
											setSettings={ setSettings }
										/>

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

										<OGP
											settings={ settings }
											defaultSettings={ defaultSettings }
											setSettings={ setSettings }
										/>

										<GeneratedThumbnail
											settings={ settings }
											defaultSettings={ defaultSettings }
											setSettings={ setSettings }
										/>

										<OpenAI />
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
