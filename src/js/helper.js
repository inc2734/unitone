export function physicalToLogical( $value ) {
	if ( 'left' === $value || 'top' === $value ) {
		return 'start';
	} else if ( 'right' === $value || 'bottom' === $value ) {
		return 'end';
	}
	return $value;
}

export function logicalToPhysical( $value, $direction = 'horizontal' ) {
	if ( 'start' === $value ) {
		return 'vertical' === $direction ? 'top' : 'left';
	} else if ( 'end' === $value ) {
		return 'vertical' === $direction ? 'bottom' : 'right';
	}
	return $value;
}
