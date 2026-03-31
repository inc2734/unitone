const queryBlockPostSelectors = [
	'.wp-block-query[data-unitone-layout~="-block-link"] .wp-block-post',
	'.wp-block-query[class*="is-style-block-link"] .wp-block-post',
];

const outerQueryBlockPostSelectors = [
	'.wp-block-query[data-unitone-layout~="-block-link"][data-unitone-layout~="-has-outer-block-link"] .wp-block-post',
	'.wp-block-query[class*="is-style-block-link"][data-unitone-layout~="-has-outer-block-link"] .wp-block-post',
];

const interactiveTags = [ 'A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA' ];

const initializeBlockLinks = () => {
	document
		.querySelectorAll( queryBlockPostSelectors.join( ',' ) )
		.forEach( ( blockPost ) => {
			let downTimestamp = 0;
			const link = blockPost.querySelector(
				':scope .wp-block-post-title > a'
			);

			if ( ! link ) {
				return;
			}

			blockPost.addEventListener( 'pointerdown', ( event ) => {
				event.stopPropagation();
				downTimestamp = event.timeStamp;
			} );

			blockPost.addEventListener( 'pointerup', ( event ) => {
				event.stopPropagation();

				if ( 0 !== event.button ) {
					return false;
				}

				if ( interactiveTags.includes( event.target?.tagName ) ) {
					return false;
				}

				if ( event.timeStamp - downTimestamp >= 200 ) {
					return false;
				}

				const pressedKeys =
					event.shiftKey || event.ctrlKey || event.metaKey;

				if ( pressedKeys ) {
					const originalTarget = link.getAttribute( 'target' );
					const originalRel = link.getAttribute( 'rel' );

					link.setAttribute( 'target', '_blank' );
					link.setAttribute( 'rel', 'noopener noreferrer' );
					link.click();
					link.setAttribute( 'target', originalTarget || '' );
					link.setAttribute( 'rel', originalRel || '' );

					return false;
				}

				link.click();
				return false;
			} );
		} );
};

const initializeOuterBlockLinks = () => {
	document
		.querySelectorAll( outerQueryBlockPostSelectors.join( ',' ) )
		.forEach( ( blockPost ) => {
			blockPost.querySelectorAll( 'a' ).forEach( ( link ) => {
				const span = document.createElement( 'span' );

				for ( let i = 0; i < link.attributes.length; i++ ) {
					const attr = link.attributes[ i ];
					span.setAttribute( attr.name, attr.value );
				}

				while ( link.firstChild ) {
					span.appendChild( link.firstChild );
				}

				link.parentNode.replaceChild( span, link );
			} );

			const link = blockPost.querySelector(
				':scope .wp-block-post-title > span'
			);

			if ( ! link ) {
				return;
			}

			const outerLink = document.createElement( 'a' );
			outerLink.setAttribute(
				'data-unitone-layout',
				'-outer-block-link'
			);

			Array.from( link.attributes ).forEach( ( attribute ) => {
				const { nodeName, nodeValue } = attribute;

				if ( [ 'href', 'target', 'rel' ].includes( nodeName ) ) {
					outerLink.setAttribute( nodeName, nodeValue ?? '' );
				}
			} );

			Array.from( blockPost.children ).forEach( ( element ) => {
				outerLink.appendChild( element );
			} );

			blockPost.insertBefore( outerLink, blockPost.children[ 0 ] );
		} );
};

export default function initQueryFeatures() {
	initializeBlockLinks();
	initializeOuterBlockLinks();
}
