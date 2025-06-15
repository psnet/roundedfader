/**
 * Rounded Fader lib
 *
 * @copyright Serhii Pustovit (PSNet), 2008 - 2015
 * @author    Serhii Pustovit (PSNet) <light.feel@gmail.com>
 *
 * @link      https://github.com/psnet
 */

var RoundedFader = new Class({

	Options: {
		FaderStructure: function (ID) {
			return '<div class="rounded-fader"><div class="internal-volume" id="js-fader-center-ball' + ID + '"><div class="volume-container" id="js-fader-center-line-container' + ID + '"><div class="volume-line"></div></div></div></div>';
		},
		ID: '',
		MouseDown: false,
		InitialValue: 0,
		PreviousValue: null,
		/**
		 * circle
		 */
		CurrentDegree: 0,     // same #1
		DegreeOffset: - 45,
		/**
		 * shadow
		 */
		MinShadowPX: 5,       // same #2
		MaxShadowPX: 20,
		CurrentShadowPX: 5,   // same #2
		/**
		 * defined by user
		 */
		CurrentFaderValue: 0, // same #1
		FromValue: 0,
		ToValue: 100,
		CallBackFunction: function () { }
	},

	/**
	 * Constructor
	 *
	 * @param WhereToPut
	 * @param FromValue
	 * @param ToValue
	 * @param CurrentFaderValue
	 * @param CallBackFunction
	 * @param CustomParentClass
	 */
	initialize: function (WhereToPut, FromValue, ToValue, CurrentFaderValue, CallBackFunction, CustomParentClass) {
		if (!WhereToPut) {
			return;
		}

		/**
		 * setup
		 */
		this.Options.ID = '_' + (new Date().getTime()).toString() + (Math.floor(Math.random() * 1000)).toString();
		this.Options.FromValue = FromValue;
		this.Options.ToValue = ToValue;
		this.Options.CurrentFaderValue = this.Options.PreviousValue = CurrentFaderValue;
		this.Options.CallBackFunction = CallBackFunction;

		/**
		 * document injection
		 */
		var newDiv = new Element('div');

		/**
		 * for custom design
		 */
		if (CustomParentClass) {
			newDiv.set('class', 'rounded-fader-custom-' + CustomParentClass);
		}

		newDiv.set('html', this.Options.FaderStructure(this.Options.ID));
		newDiv.inject(WhereToPut);

		/**
		 * init
		 */
		this._SetRotation();
		this._SetShadow();
		this.AttachDefaultEvents();
	},

	OnMouseDownUp: function (e, thisObjFader) {
		if (e) {
			thisObjFader.Options.InitialValue = e.event.clientY;
			thisObjFader.Options.MouseDown = e.type == 'mousedown';

			e.stop();

			if (thisObjFader.Options.MouseDown) {
				$('js-fader-center-ball' + thisObjFader.Options.ID).addClass('active');
			} else {
				$('js-fader-center-ball' + thisObjFader.Options.ID).removeClass('active');
			}
		}
	},

	_SetShadow: function () {
		this._CalculateShadowRange();

		var styleString = '0 0 ' + this.Options.CurrentShadowPX + 'px #207CCA, 0 0 ' + this.Options.CurrentShadowPX + 'px #207CCA, 0 0 ' + this.Options.CurrentShadowPX + 'px #207CCA';

		$('js-fader-center-ball' + this.Options.ID).setStyle('box-shadow', styleString);
	},

	_SetRotation: function () {
		this._CalculateDegree();

		var styleString = 'rotate(' + this.Options.CurrentDegree + 'deg)';

		$('js-fader-center-line-container' + this.Options.ID).setStyle('transform', styleString);
	},

	_CalculateShadowRange: function () {
		// from MinShadowPX to MaxShadowPX
		// ((CurrentIn - MinIn)(MaxOut - MinOut)) / (MaxIn - MinIn) + MinOut
		this.Options.CurrentShadowPX = Math.floor(((this.Options.CurrentFaderValue - this.Options.FromValue) * (this.Options.MaxShadowPX - this.Options.MinShadowPX)) / (this.Options.ToValue - this.Options.FromValue) + this.Options.MinShadowPX);
	},

	_CalculateDegree: function () {
		// from 0 to 270 degrees
		// ((CurrentIn - MinIn)(MaxOut - MinOut)) / (MaxIn - MinIn) + MinOut
		this.Options.CurrentDegree = Math.floor(((this.Options.CurrentFaderValue - this.Options.FromValue) * 270) / (this.Options.ToValue - this.Options.FromValue));
		this.Options.CurrentDegree += this.Options.DegreeOffset;
	},

	OnMouseMove: function (e, thisObjFader) {
		if (e && thisObjFader.Options.MouseDown) {
			var CurrentMouseY = thisObjFader.Options.InitialValue - e.event.clientY;

			thisObjFader.Options.CurrentFaderValue += CurrentMouseY;
			thisObjFader.Options.CurrentFaderValue = (thisObjFader.Options.CurrentFaderValue > thisObjFader.Options.ToValue ? thisObjFader.Options.ToValue : thisObjFader.Options.CurrentFaderValue);
			thisObjFader.Options.CurrentFaderValue = (thisObjFader.Options.CurrentFaderValue < thisObjFader.Options.FromValue ? thisObjFader.Options.FromValue : thisObjFader.Options.CurrentFaderValue);

			/**
			 * fire events if only value is really changed
			 */
			if (thisObjFader.Options.CurrentFaderValue !== thisObjFader.Options.PreviousValue) {
				if (typeof thisObjFader.Options.CallBackFunction == 'function') {
					thisObjFader.Options.CallBackFunction.call(this, thisObjFader.Options.CurrentFaderValue);
				}

				thisObjFader._SetShadow();

				thisObjFader._SetRotation();
			}

			thisObjFader.Options.InitialValue = e.event.clientY;
			thisObjFader.Options.PreviousValue = thisObjFader.Options.CurrentFaderValue;
			e.stop();
		}
	},

	AttachDefaultEvents: function () {
		var thisObjFader = this;

		document.addEvent('mousemove', function (e) {
			thisObjFader.OnMouseMove(e, thisObjFader);
		});

		$('js-fader-center-ball' + thisObjFader.Options.ID).addEvent('mousedown', function (e) {
			thisObjFader.OnMouseDownUp(e, thisObjFader);
		});

		document.addEvent('mouseup', function (e) {
			thisObjFader.OnMouseDownUp(e, thisObjFader);
		});
	}

});
