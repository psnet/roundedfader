/**
 * Rounded Fader lib
 *
 * @copyright Serge Pustovit (PSNet), 2008 - 2015
 * @author    Serge Pustovit (PSNet) <light.feel@gmail.com>
 *
 * @link      http://psnet.lookformp3.net
 */

var RoundedFader = new Class({
	
	Options: {
		FaderStructure: function(ID) {
			return '<div class="rounded-fader"><div class="internal-volume" id="js-fader-center-ball' + ID + '"><div class="volume-container" id="js-fader-center-line-container' + ID + '"><div class="volume-line"></div></div></div></div>';
		},
		ID: '',
		MouseDown: false,
		InitialValue: 0,
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
		CallBackFunction: function() {}
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
	initialize: function(WhereToPut, FromValue, ToValue, CurrentFaderValue, CallBackFunction, CustomParentClass) {
		if (! WhereToPut) return;
		/**
		 * setup
		 */
		this.Options.ID = '_' + (new Date().getTime()).toString() + (parseInt(Math.random() * 1000)).toString();
		this.Options.FromValue = FromValue;
		this.Options.ToValue = ToValue;
		this.Options.CurrentFaderValue = CurrentFaderValue;
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


	OnMouseDownUp: function(e, TThisObjFader) {
		if (e) {
			TThisObjFader.Options.InitialValue = e.event.clientY;
			TThisObjFader.Options.MouseDown = e.type == 'mousedown';
			e.stop();
			if (TThisObjFader.Options.MouseDown) {
				$('js-fader-center-ball' + TThisObjFader.Options.ID).addClass('active');
			} else {
				$('js-fader-center-ball' + TThisObjFader.Options.ID).removeClass('active');
			}
		}
	},


	_SetShadow: function() {
		this._CalculateShadowRange();
		var StyleString = '0 0 ' + this.Options.CurrentShadowPX + 'px #207CCA, 0 0 ' + this.Options.CurrentShadowPX + 'px #207CCA, 0 0 ' + this.Options.CurrentShadowPX + 'px #207CCA';
		$('js-fader-center-ball' + this.Options.ID).setStyle('box-shadow', StyleString);
	},


	_SetRotation: function() {
		this._CalculateDegree();
		var StyleString = 'rotate(' + this.Options.CurrentDegree + 'deg)';
		$('js-fader-center-line-container' + this.Options.ID).setStyle('transform', StyleString);
	},


	_CalculateShadowRange: function() {
		// from MinShadowPX to MaxShadowPX
		// ((CurrentIn - MinIn)(MaxOut - MinOut)) / (MaxIn - MinIn) + MinOut
		this.Options.CurrentShadowPX = parseInt(((this.Options.CurrentFaderValue - this.Options.FromValue) * (this.Options.MaxShadowPX - this.Options.MinShadowPX)) / (this.Options.ToValue - this.Options.FromValue) + this.Options.MinShadowPX);
	},


	_CalculateDegree: function() {
		// from 0 to 270 degrees
		// ((CurrentIn - MinIn)(MaxOut - MinOut)) / (MaxIn - MinIn) + MinOut
		this.Options.CurrentDegree = parseInt(((this.Options.CurrentFaderValue - this.Options.FromValue) * 270) / (this.Options.ToValue - this.Options.FromValue));
		this.Options.CurrentDegree += this.Options.DegreeOffset;
	},


	OnMouseMove: function(e, TThisObjFader) {
		if ((e) && (TThisObjFader.Options.MouseDown)) {
			var CurrentMouseY = TThisObjFader.Options.InitialValue - e.event.clientY;

			TThisObjFader.Options.CurrentFaderValue += CurrentMouseY;
			TThisObjFader.Options.CurrentFaderValue = (TThisObjFader.Options.CurrentFaderValue > TThisObjFader.Options.ToValue ? TThisObjFader.Options.ToValue : TThisObjFader.Options.CurrentFaderValue);
			TThisObjFader.Options.CurrentFaderValue = (TThisObjFader.Options.CurrentFaderValue < TThisObjFader.Options.FromValue ? TThisObjFader.Options.FromValue : TThisObjFader.Options.CurrentFaderValue);

			if (typeof TThisObjFader.Options.CallBackFunction == 'function') {
				TThisObjFader.Options.CallBackFunction(TThisObjFader.Options.CurrentFaderValue);
			}

			TThisObjFader._SetShadow();

			TThisObjFader._SetRotation();

			TThisObjFader.Options.InitialValue = e.event.clientY;
			e.stop();
		}
	},


	AttachDefaultEvents: function() {
		var TThisObjFader = this;
		document.addEvent('mousemove', function(e) {
			TThisObjFader.OnMouseMove(e, TThisObjFader);
		});
		$('js-fader-center-ball' + TThisObjFader.Options.ID).addEvent('mousedown', function(e) {
			TThisObjFader.OnMouseDownUp(e, TThisObjFader);
		});
		document.addEvent('mouseup', function(e) {
			TThisObjFader.OnMouseDownUp(e, TThisObjFader);
		});
	}

});
