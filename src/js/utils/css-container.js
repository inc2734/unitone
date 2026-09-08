// Accept legacy string values; only values changed through the UI are saved as booleans.
export const isContainerQueryContext = ( value ) =>
	true === value || 'container' === value;

// Keep these selectors aligned with unitone-css's responsive-query mixin and
// unitone_get_responsive_query_selectors(). A paired context affects descendants only.
export const getResponsiveQuerySelectors = ( selector ) => {
	const containerContext =
		'[data-unitone-layout~="@container"], :is([data-unitone-layout~="-responsive-context:container"], .-responsive-context\\:container):where([data-unitone-layout~="-container-type:inline-size"], .-container-type\\:inline-size) *';

	return {
		media: `${ selector }:where(:not(${ containerContext }))`,
		container: `${ selector }:where(${ containerContext })`,
	};
};
