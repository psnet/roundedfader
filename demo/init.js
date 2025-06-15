/**
 * Rounded Fader lib demo
 *
 * @copyright Serhii Pustovit (PSNet), 2008 - 2015
 * @author    Serhii Pustovit (PSNet) <light.feel@gmail.com>
 *
 * @link      https://github.com/psnet
 */

var RoundedFaderDemo = {
	/**
	 * Options for image filter
	 */
	aFilterOptions: {
		grayscale: '',
		blur: ''
	},

	/**
	 * Set filter value
	 *
	 * @param sType
	 * @param sValue
	 */
	setFilterValue: function (sType, sValue) {
		if (!(sType in this.aFilterOptions)) {
			throw new Error('No filter "' + sType + '" allowed in aFilterOptions');
		}

		this.aFilterOptions[sType] = sValue;
	},

	/**
	 * Use filter
	 */
	processFilter: function () {
		var sFilterLine = '';

		for (var sKey in this.aFilterOptions) {
			/**
			 * if the property is not set
			 */
			if (!this.aFilterOptions.hasOwnProperty(sKey) || !this.aFilterOptions[sKey]) {
				continue;
			}

			/**
			 * for all given properties build a CSS filter string
			 */
			sFilterLine += sKey + '(' + this.aFilterOptions[sKey] + ') ';
		}

		$$('.js-bg-image')
			.setStyle('filter', sFilterLine)
			.setStyle('-webkit-filter', sFilterLine);
	},

	/**
	 * Displaying the current fader value on the scoreboard
	 *
	 * @param sMsg
	 */
	showRawValue: function (sMsg) {
		$('js-display-value-wrapper').set('html', sMsg);
	},
};

window.addEvent('domready', function () {
	new RoundedFader($('js-fader-wrapper-1'), 0, 100, 0, function (value) {
		RoundedFaderDemo.showRawValue('left fader value: ' + value);
		RoundedFaderDemo.setFilterValue('grayscale', value + '%');
		RoundedFaderDemo.processFilter();
	});

	new RoundedFader($('js-fader-wrapper-2'), 0, 50, 0, function (value) {
		RoundedFaderDemo.showRawValue('right fader value: ' + value);
		RoundedFaderDemo.setFilterValue('blur', value + 'px');
		RoundedFaderDemo.processFilter();
	});

	/**
	 * change the size of the two upper controls
	 */
	new RoundedFader(
		$('js-size-fader'),
		90,
		280,
		90,
		function (value) {
			RoundedFaderDemo.showRawValue('size fader value: ' + value);

			$$('#js-fader-wrapper-1 .rounded-fader, #js-fader-wrapper-2 .rounded-fader').setStyles({ 'width': value + 'px', 'height': value + 'px' });
			$$('.js-inner-container').setStyles({
				'width': 782 + 2 * (value - this.Options.FromValue) + 'px',
				/**
				 * Raise from 3% to 12%
				 */
				'margin-top': ((value - this.Options.FromValue) * (3 - 12)) / (this.Options.ToValue - this.Options.FromValue) + 12 + '%'
			});
		},
		'sizer'
	);

	/**
	 * emerging shape and size regulator
	 */
	$$('.js-inner-container').addClass('show');
	$$('.js-size-fader').addClass('show');
});
