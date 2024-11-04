<!-- wp:unitone/stack {"unitone":{"gap":"2"}} -->
<div data-unitone-layout="stack">
	<!-- wp:woocommerce/order-confirmation-status {"fontSize":"large"} /-->

	<!-- wp:woocommerce/order-confirmation-summary /-->

	<!-- wp:woocommerce/order-confirmation-totals-wrapper {"align":"wide"} -->
		<!-- wp:heading {"level":3,"fontSize":"unitone-xl"} -->
		<h3 class="wp-block-heading has-unitone-xl-font-size">
			<?php
			// phpcs:disable WordPress.WP.I18n.TextDomainMismatch
			esc_html_e( 'Order details', 'woocommerce' );
			// phpcs:enable
			?>
		</h3>
		<!-- /wp:heading -->

		<!-- wp:woocommerce/order-confirmation-totals {"lock":{"remove":true}} /-->
	<!-- /wp:woocommerce/order-confirmation-totals-wrapper -->

	<!-- wp:woocommerce/order-confirmation-downloads-wrapper {"align":"wide"} -->
		<!-- wp:heading {"level":3,"fontSize":"unitone-xl"} -->
		<h3 class="wp-block-heading has-unitone-xl-font-size">
			<?php
			// phpcs:disable WordPress.WP.I18n.TextDomainMismatch
			esc_html_e( 'Downloads', 'woocommerce' );
			// phpcs:enable
			?>
		</h3>
		<!-- /wp:heading -->

		<!-- wp:woocommerce/order-confirmation-downloads {"lock":{"remove":true}} /-->
	<!-- /wp:woocommerce/order-confirmation-downloads-wrapper -->

	<!-- wp:unitone/responsive-grid {"columnMinWidth":"500px"} -->
	<div data-unitone-layout="responsive-grid" style="--unitone--column-min-width:500px">
		<!-- wp:woocommerce/order-confirmation-shipping-wrapper {"align":"wide"} -->
			<!-- wp:heading {"level":3,"fontSize":"unitone-xl"} -->
			<h3 class="wp-block-heading has-unitone-xl-font-size">
				<?php
				// phpcs:disable WordPress.WP.I18n.TextDomainMismatch
				esc_html_e( 'Shipping Address', 'woocommerce' );
				// phpcs:enable
				?>
			</h3>
			<!-- /wp:heading -->

			<!-- wp:woocommerce/order-confirmation-shipping-address {"lock":{"remove":true}} /-->
		<!-- /wp:woocommerce/order-confirmation-shipping-wrapper -->

		<!-- wp:woocommerce/order-confirmation-billing-wrapper {"align":"wide"} -->
			<!-- wp:heading {"level":3,"fontSize":"unitone-xl"} -->
			<h3 class="wp-block-heading has-unitone-xl-font-size">
				<?php
				// phpcs:disable WordPress.WP.I18n.TextDomainMismatch
				esc_html_e( 'Billing Address', 'woocommerce' );
				// phpcs:enable
				?>
			</h3>
			<!-- /wp:heading -->

			<!-- wp:woocommerce/order-confirmation-billing-address {"lock":{"remove":true}} /-->
		<!-- /wp:woocommerce/order-confirmation-billing-wrapper -->
	</div>
	<!-- /wp:unitone/responsive-grid -->

	<!-- wp:woocommerce/order-confirmation-additional-information /-->
</div>
<!-- /wp:unitone/stack -->
