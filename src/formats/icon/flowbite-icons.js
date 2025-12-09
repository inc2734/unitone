import flowbite from '@iconify/json/json/flowbite.json';

const iconsArray = Object.entries( flowbite.icons )
	.filter( ( [ name ] ) => {
		return name.match( '-outline' );
	} )
	.map( ( [ name, data ] ) => {
		return {
			name,
			svg: ( { strokeWidth = 2 } ) => `<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				stroke-width="${ strokeWidth }"
			>${ data.body.replace( ' stroke-width="2"', '' ) }</svg>`,
		};
	} );

export default iconsArray;
