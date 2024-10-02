import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

const fileExist = async function ( url ) {
	try {
		const response = await fetch( url );
		return 200 === response.status;
	} catch ( error ) {
		console.error( error ); // eslint-disable-line no-console
	}
	return false;
};

const replaceUnitonePatternImages = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			const {
				name,
				canMove,
				canRemove,
				isSelectionEnabled,
				isSelected,
				block,
				attributes,
			} = props;

			const maybePreview =
				! canMove &&
				! canRemove &&
				! isSelectionEnabled &&
				! isSelected;

			if ( 'core/image' === name ) {
				if ( maybePreview ) {
					return <BlockListBlock { ...props } />;
				}

				const fileUrl = attributes.url;

				const regExpUploads = new RegExp(
					'https://unitone.2inc.org/wp-content/uploads'
				);

				const regExpTheme = new RegExp(
					'https://unitone.2inc.org/wp-content/themes/unitone'
				);

				if ( window.unitone.url.match( regExpTheme ) ) {
					return <BlockListBlock { ...props } />;
				}

				const isFileInUploads = fileUrl?.match( regExpUploads );
				const isFileInTheme = fileUrl?.match( regExpTheme );

				if ( ! isFileInUploads && ! isFileInTheme ) {
					return <BlockListBlock { ...props } />;
				}

				attributes.url = `${ window.unitone.url }/dist/img/dummy.jpg`;
				block.attributes.url = attributes.url;

				if ( isFileInTheme ) {
					const newFileUrl = fileUrl.replace(
						regExpTheme,
						window.unitone.url
					);
					fileExist( newFileUrl ).then( ( isExist ) => {
						if ( isExist ) {
							attributes.url = newFileUrl;
							block.attributes.url = attributes.url;
						}

						return (
							<BlockListBlock
								{ ...{ ...props, block, attributes } }
							/>
						);
					} );
				}
			}

			return <BlockListBlock { ...props } />;
		};
	},
	'replaceUnitonePatternImages'
);

addFilter(
	'editor.BlockListBlock',
	'unitone/replace-unitone-pattern-images',
	replaceUnitonePatternImages
);
