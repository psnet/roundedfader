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
	 * изменение размера двух верхних регуляторов
	 */
	new RoundedFader($('js-size-fader'), 90, 280, 90, function(value) {
		RoundedFaderDemo.showRawValue('size fader value: ' + value);
		$$ ('#js-fader-wrapper-1 .rounded-fader, #js-fader-wrapper-2 .rounded-fader').setStyles({'width': value + 'px', 'height': value + 'px'});
		$$ ('.js-inner-container').setStyles({
			'width': 782 + 2 * (value - this.Options.FromValue) + 'px',
			/**
			 * Поднимать от 3% до 12%
			 */
			'margin-top': ((value - this.Options.FromValue)*(3 - 12)) / (this.Options.ToValue - this.Options.FromValue) + 12 + '%'
		});
	}, 'sizer');
	/**
	 * появляющаяся форма и регулятор размера
	 */
	$$('.js-inner-container').addClass('show');
	$$('.js-size-fader').addClass('show');
});
