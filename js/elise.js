/*
 * Grupo de Desarrollo de Software Calumet
 * Elise Library, Functionality
 * Duvan Vargas, @DuvanJamid; Romel Perez, @prhonedev
 * Octubre del 2012 - Noviembre del 2013
 * CODIFICACIÓN UTF-8
 **/


 var Elise = e$ = {};

 Elise.init = function(){
 	$(document).ready(function(){
 		var self, value;
		// Validators
		var val = function($input, validator){
			$input.on('keyup', function(){
				if(validator($input.val()))
					$input.removeClass('invalid').addClass('valid');
				else
					$input.removeClass('valid').addClass('invalid');
			});
		}
		$('input[type=text]').each(function(){
			self = $(this);
			value = self.data('val');
			if(value == undefined  ||  value == '')
				return;
			// Email
			if(value == 'email')
				val(self, Elise.val.email);
			// Number
			else if(value == 'number')
				val(self, Elise.val.number);
			// Account
			else if(value  &&  value.indexOf('account') >= 0){
				var account = value.replace('account','').replace('(','').replace(')','');
				var starts = account.split(',')[0] ? account.split(',')[0] : Elise.val.accountInit;
				var ends = account.split(',')[1] ? account.split(',')[1] : Elise.val.accountEnds;
				val(self, function(text){
					return Elise.val.account(text, starts, ends);
				});
			}
			// Text
			else if(value == 'text')
				val(self, Elise.val.text);
			// Words
			else if(value == 'words')
				val(self, Elise.val.words);
		});
		// iCkeck
		$('input[type=checkbox], input[type=radio]').each(function(){
			if( $(this).data('visual') == 'yes' )
				$(this).iCheck()
			.on('ifClicked', function(){$(this).trigger('click')})
			.on('ifChecked', function(){$(this).trigger('change')})
			.on('ifUnchecked', function(){$(this).trigger('change')});
		});
	});
};
Elise.init();
Elise.val = {

	// dot, comma, whitespace, letters, numbers
	textSecure: "., áéíóúabcdefghijklmnñopqrstuvwxyz0123456789",
	wordsSecure: "., áéíóúabcdefghijklmnñopqrstuvwxyz",

	email: function(text){
		if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text)) return true;
		return false;
	},

	number: function(text){
		return $.isNumeric(text);
	},

	accountInit: 6,
	accountEnds: 15,
	account: function(text, starts, ends){
		starts = starts ? starts : Elise.val.accountInit;
		ends = ends ? ends : Elise.val.accountEnds;
		var re = new RegExp("^[0-9a-zA-Z\*]{"+ starts +","+ ends +"}$");
		if(re.test(text)) return true;
		return false;
	},

	text: function(text){
		for(var i=0; i<text.length; i++)
			if(utf8_decode(Elise.val.textSecure).indexOf(text.charAt(i).toLowerCase()) == -1)
				return false;
			return true;
		},

		words: function(text){
			for(var i=0; i<text.length; i++)
				if(utf8_decode(Elise.val.wordsSecure).indexOf(text.charAt(i).toLowerCase()) == -1)
					return false;
				return true;
			},

			filename: function(text){
				var text = text.toLowerCase();
				text = replaceAll(text,utf8_decode("á"),"a");
				text = replaceAll(text,utf8_decode("é"),"e");
				text = replaceAll(text,utf8_decode("í"),"i");
				text = replaceAll(text,utf8_decode("ó"),"o");
				text = replaceAll(text,utf8_decode("ú"),"u");
				text = replaceAll(text,utf8_decode("á"),"a");
				text = replaceAll(text,utf8_decode("ñ"),"n");
				text = replaceAll(text," ", "_");
				text = replaceAll(text,"'", "");
				text = replaceAll(text,utf8_decode("´"), "");
				text = replaceAll(text,",", "");
				text = replaceAll(text,utf8_decode("¨"), "");
				text = replaceAll(text,":", "");
				text = replaceAll(text,";", "");
				return text;
			}

		};
		Elise.win = {

	// Reset the height of the iframe by its content height
	// @level = { top | top2 | self }
	fitIframe: function(iframe, level, min, plus){
		if(level == undefined  ||  level == 'self')
			level = window;
		else if(level == 'top')
			level = window.parent;
		else if(level == 'top2')
			level = window.parent.parent;

		if(typeof(iframe) == "string")
			iframe = level.document.getElementById(iframe);
		min = Elise.val.number(min) ? min : 300;
		plus = Elise.val.number(plus) ? plus : 0;
		$(iframe).height('auto');

		var win = {
			scroll: $(window.top).scrollTop(),  // Actual window scroll
			height: Elise.win.contentHeight(iframe),  // Content height in the iframe
			res: 0  // Total height to apply
		};
		
		win.res = win.height > min ? win.height : min;

		$(iframe).add($(iframe).parent('.centro')).height(win.res + plus);

		$(window.top).scrollTop(win.scroll);
	},

	// Get the content height of an element, like a iframe
	contentHeight: function(obj){
		var height = 0;
		if(obj.Document && obj.Document.body.scrollWidth){
			height = obj.contentWindow.document.body.scrollHeight;
		}else if(obj.contentDocument && obj.contentDocument.body.scrollWidth){
			height = obj.contentDocument.body.scrollHeight;
		}else if(obj.contentDocument && obj.contentDocument.body.offsetWidth){
			height = obj.contentDocument.body.offsetWidthHeight;
		}
		return height;
	},

	// Get the useable window size like a JSON object
	dims: function(){
		var dim = {
			width: 0,
			height: 0
		};
		if(typeof window.top.innerWidth != "undefined"){
			dim.width = window.top.innerWidth;
			dim.height = window.top.innerHeight;
		}
		else if(typeof window.top.document.documentElement != "undefined" && typeof window.top.document.documentElement.clientWidth != 'undefined' && window.top.document.documentElement.clientWidth != 0){
			dim.width = window.top.document.documentElement.clientWidth;
			dim.height = window.top.document.documentElement.clientHeight;
		}
		else{
			dim.width = window.top.document.getElementsByTagName("body")[0].clientWidth;
			dim.height = window.top.document.getElementsByTagName("body")[0].clientHeight;
		}
		return dim;
	}

};
Elise.popup = function(config){
	var props = '';

	// Name
	config.name = config.name ? config.name : '_blank';

	// Dimensions
	config.width = config.width ? config.width : 900;
	config.height = config.height ? config.height : 500;

	// Position
	if(config.position === 'normal'){
		config.left = config.top = 0;
	}else if(config.position === 'top'){
		config.left = screen.availWidth / 2 - config.width / 2;
		config.top = 0;
	}else if(config.position === 'full'){
		config.left = config.top = 0;
		config.width = screen.availWidth;
		config.height = screen.availHeight;
	}else{
		config.left = screen.availWidth / 2 - config.width / 2;
		config.top = screen.availHeight / 2 - config.height / 2;
	}

	// Parse data
	props += 'width='+ config.width;
	props += ',height='+ config.height;
	props += ',left='+ config.left;
	props += ',top='+ config.top;
	props += ',scrollbars=yes';

	// Return the new window object
	return window.open(config.url, config.name, props);
};

Elise.modal = function(data){

		// Configuration
		var WIN = window.top;
		var MODAL = {};

		MODAL.config = $.extend({
			container: null,
			url: '',
			title: 'Modal Title',
			modalWidth: 600,
			modalContentHeight: 300,
			delay: 100,
			fadeIn: 500,
			fadeOut: 500,
			onEscKeyClose: true,
			onOpen: function(){},
			onClose: function(){},
			buttons: [
			{
				btnId: 'emodal_hide',
		            btnClass: 'emodal_hide',  // modal_hide, clase que se utiliza para cerrar
		            btnText: 'Cerrar',
		            btnColor: 'rojo',  // verde | rojo | azul | azuloscuro | naranja | celeste | negro 
		            btnPosition: 'right',  // right | left | center
		            btnClick: function(){}
		        }
		        ]
		    }, data);
		MODAL.container = typeof(MODAL.config.container) == 'string' ? $('#'+ MODAL.config.container) : MODAL.config.container;
		MODAL.url = MODAL.config.url == '' ? false : true;

		// Create or Recreate the modal structure
		MODAL.structure = function(){
			var config = MODAL.config;

			// Initialization
			if(WIN.ModalElement)
				WIN.ModalElement.remove();

			var modal_hold = $('<div/>', {
				id: 'emodal_hold',
				'class': 'emodal_hold hide'
			});
			var modal = $('<div/>', {
				id: 'emodal',
				'class': 'emodal hide'
			});
			var modal_header_elements = $('<button/>', {
				id: 'emodal_close',
				'class': 'emodal_close emodal_hide',
				type: 'button',
				html: '&times;',
				title: 'Presione Esc para cerrar',
				toolTip: {
					defaultPosition: 'bottom'
				}
			}).add('<h3/>', {
				id: 'emodal_title',
				'class': 'emodal_title'
			});
			var modal_header = $('<div/>', {
				id: 'emodal_header',
				'class': 'emodal_header',
				html: modal_header_elements
			});
			var modal_footer = $('<div/>', {
				id: 'emodal_footer',
				'class': 'emodal_footer'
			});
			if(MODAL.url){
				var modal_content = $('<iframe/>', {
					id: 'emodal_content',
					'class': 'emodal_content emodal_content_url'
				});
			}else{
				var modal_content = $('<div/>', {
					id: 'emodal_content',
					'class': 'emodal_content'
				});
			}

			modal.html(modal_header).append(modal_content).append(modal_footer);
			WIN.$("body").after(modal_hold.html(modal));

			// Save cache
			MODAL.modal = WIN.ModalElement = modal_hold;


			// Apply configuration and chache variables
			modal_header.find("#emodal_title").html(config.title);
			modal.css('width', config.modalWidth);
			modal_content.css('height', config.modalContentHeight);
			if(MODAL.url){
				modal_content.attr('src', config.url);
			}else{
				modal_content.html(MODAL.container.html());
			}
			modal_footer.empty();
			$.each(config.buttons, function(i, item) {
				item.btnPosition = item.btnPosition == 'center' ? 'none' : item.btnPosition;
				var boton = $('<button/>', {
					id: item.btnId,
					'class': 'boton '+ item.btnClass +' '+ item.btnColor,
					text: item.btnText,
					css: {
						'float': item.btnPosition
					},
					'click': item.btnClick
				});
				modal_footer.append(boton);
			});


	        // Others functionalities
	        modal.find('.emodal_hide').on('click', MODAL.hide);
	        if(config.onEscKeyClose){
	        	$(document).on('keydown', function(e){
	        		if(e.which == 27)
	        			MODAL.hide();
	        	});
	        }
	    };

		// Fit the MODAL centered on window
		MODAL.autoPosition = function(){
			var modal = MODAL.modal.find('#emodal');
			var dim = Elise.win.dims();
			var _width = modal.outerWidth()/2;
			_width = _width > (dim.width/2) ? -(dim.width/2)+20 : -_width;
			var _height = dim.height/2 - modal.outerHeight()/2;
			_height = _height < 10 ? 10 : _height;
			modal.css({
				'margin-left': _width,
				'margin-top': _height
			});
		};

        // Structure and show the MODAL
        MODAL.show = function(){
        	if(!MODAL.showed){
        		MODAL.overflow = WIN.$('body').css('overflow');
        		WIN.$('body').css('overflow', 'hidden');
        		setTimeout(function(){
        			MODAL.structure();
        			MODAL.modal.fadeIn(MODAL.config.fadeIn);
        			MODAL.autoPosition();
        			MODAL.config.onOpen();
        			MODAL.showed = true;
        		}, MODAL.config.delay);
        	}
        };

        // Hide the eModal
        MODAL.hide = function(){
        	if(MODAL.showed){
        		setTimeout(function(){
        			MODAL.modal.fadeOut(MODAL.config.fadeOut);
        			MODAL.config.onClose();
        			MODAL.showed = false;
        			WIN.$('body').css('overflow', MODAL.overflow);
        		}, MODAL.config.delay);
        	}
        };

        // Start
        $(WIN).on('resize', function(){
        	if(!MODAL.modal.is(":visible"))
        		return;
        	MODAL.autoPosition();
        });
        MODAL.showed = false;
        MODAL.show();
        
        return MODAL;

    };
    Elise.hope = function(data) {

        // Configuration
        var WIN = window.top;
        var HOPE = {};
        var interval = null;

        HOPE.config = $.extend({
        	hopeWidth: 300,
        	delay: 100,
            animation: 'slideDown', // fadeIn, slideDown,
            animationIn: 500,
            animationOut: 500,
            onOpen: function() {
            },
            onClose: function() {
            },
            loader: {
            	type: "spinner",
            	text: 'Guardando<br>Por favor espere',
            	textPosition: "bottom"
            }
        }, data);


        // Create or Recreate the hope structure
        HOPE.structure = function() {
        	var config = HOPE.config;
            // Initialization
            if (WIN.hopeElement)
            	WIN.hopeElement.remove();

            var hope_hold = $('<div/>', {
            	id: 'hope_hold',
            	'class': 'hope_hold hide'
            });
            var hope = $('<div/>', {
            	id: 'hope',
            	'class': 'hope hide'
            });
            hope.loader({
            	text: config.loader.text,
            	textPosition: config.loader.textPosition,
            	type: config.loader.type
            });
            WIN.$("body").after(hope_hold.html(hope));
            // Save cache
            HOPE.hope = WIN.hopeElement = hope_hold;
            // Apply configuration and chache variables
            hope.css({'width': config.hopeWidth});

        };

        // Fit the hope centered on window
        HOPE.autoPosition = function() {
        	var hope = HOPE.hope.find('#hope');
        	var dim = Elise.win.dims();
        	var _width = hope.outerWidth() / 2;
        	_width = _width > (dim.width / 2) ? -(dim.width / 2) + 20 : -_width;
        	var _height = dim.height / 2 - hope.outerHeight() / 2;
        	_height = _height < 10 ? 10 : _height;
        	hope.css({
        		'margin-left': _width,
        		'margin-top': _height
        	});
        };

        // Structure and show the hope
        HOPE.show = function() {
        	if (!HOPE.showed) {
        		HOPE.overflow = WIN.$('body').css('overflow');
        		WIN.$('body').css('overflow', 'hidden');
        		setTimeout(function() {
        			HOPE.structure();
        			if (HOPE.config.animation.toLowerCase() == 'fadein') {
        				HOPE.hope.fadeIn(HOPE.config.animationIn);
        				HOPE.autoPosition();
        			} else if (HOPE.config.animation.toLowerCase() == 'slidedown') {
        				HOPE.hope.find('#hope').hide();
        				HOPE.hope.find('#hope').slideDown(HOPE.config.animationIn, HOPE.autoPosition());
        			}
        			HOPE.config.onOpen();
        			HOPE.showed = true;
        		}, HOPE.config.delay);
        		var x = 0;
        		interval = window.setInterval(function() {
        			x++;
        			HOPE.hope.find('#hope').css({'background-position': x + 'px 0px, ' + x + 'px 100%'});
        		}, 15);
        	}
        };

        // Hide the hope
        HOPE.hide = function() {
        	if (HOPE.showed) {
        		setTimeout(function() {
        			if (HOPE.config.animation.toLowerCase() == 'fadein') {
        				HOPE.hope.fadeOut(HOPE.config.animationOut);
        			} else if (HOPE.config.animation.toLowerCase() == 'slidedown') {
        				HOPE.hope.find('#hope').slideUp(HOPE.config.animationOut);
        				HOPE.hope.fadeOut(HOPE.config.animationOut);
        			}
        			HOPE.config.onClose();
        			HOPE.showed = false;
        			WIN.$('body').css('overflow', HOPE.overflow);
        		}, HOPE.config.delay);
        	}
        	clearInterval(interval);
        };

        // Change the eHope text
        HOPE.log = function(text) {
        	if (HOPE.showed) {
        		var textCont = HOPE.hope.find('.loader-cont-text');
        		var width = textCont.outerWidth();
        		textCont.css({'width': width + 'px'});
        		textCont.animate({'margin-left': '-' + width + 'px'}, 200, function() {
        			textCont.hide().css({'width': width + 'px', 'margin-left': width + 'px'});
        			textCont.html(text);
        			textCont.show().stop().animate({'margin-left': '0px'}, 200);
        		});
        		HOPE.autoPosition();
        	}
        };
        // Start
        $(WIN).on('resize', function() {
        	if (!HOPE.hope.is(":visible"))
        		return;
        	HOPE.autoPosition();
        });
        HOPE.showed = false;
        HOPE.show();

        return HOPE;

    };