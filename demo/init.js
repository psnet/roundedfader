/**
 * Rounded Fader lib demo
 *
 * @copyright Serge Pustovit (PSNet), 2008 - 2015
 * @author    Serge Pustovit (PSNet) <light.feel@gmail.com>
 *
 * @link      http://psnet.lookformp3.net
 */

RoundedFaderDemo = {
	/**
	 * Опции для фильтра изображения
	 */
	aFilterOptions: {
		grayscale: '',
		blur: ''
	},

	/**
	 * Задать значение фильтра
	 *
	 * @param sType
	 * @param sValue
	 */
	setFilterValue: function(sType, sValue) {
		if (!(sType in this.aFilterOptions)) {
			throw new Error('No filter "' + sType + '" allowed in aFilterOptions');
			return;
		}
		this.aFilterOptions[sType] = sValue;
	},

	/**
	 * Использовать фильтр
	 */
	processFilter: function() {
		var sFilterLine = '';
		for (var sKey in this.aFilterOptions) {
			/**
			 * если свойство не задано
			 */
			if (!this.aFilterOptions.hasOwnProperty(sKey) || !this.aFilterOptions[sKey]) {
				continue;
			}
			/**
			 * для всех заданных свойств построить ксс строку фильтра
			 */
			sFilterLine += sKey + '(' + this.aFilterOptions[sKey] + ') ';
		}
		$$('.js-bg-image')
			.setStyle('filter', sFilterLine)
			.setStyle('-webkit-filter', sFilterLine);
	},

	/**
	 * Отображение текущего значения фейдера на табло
	 *
	 * @param sMsg
	 */
	showRawValue: function(sMsg) {
		$('js-display-value-wrapper').set('html', sMsg);
	},

	last_elem_wo_separator: true
};

window.addEvent('domready', function () {
	new RoundedFader($('js-fader-wrapper-1'), 0, 100, 0, function(value) {
		RoundedFaderDemo.showRawValue('left fader value: ' + value);
		RoundedFaderDemo.setFilterValue('grayscale', value + '%');
		RoundedFaderDemo.processFilter();
	});
	new RoundedFader($('js-fader-wrapper-2'), 0, 50, 0, function(value) {
		RoundedFaderDemo.showRawValue('right fader value: ' + value);
		RoundedFaderDemo.setFilterValue('blur', value + 'px');
		RoundedFaderDemo.processFilter();
	});
	/**
	 * появляющаяся форма
	 */
	$$('.js-inner-container').addClass('show');
});
