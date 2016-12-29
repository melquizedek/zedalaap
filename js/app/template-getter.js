var Template = (function($) {

	return {
		get: get,
	};

	function get (template, domContainer, jsonData, type) {
		
        var renderedTemp = _.template($(template).html());
        
        var domContainer = (typeof domContainer === "object") ?
        	domContainer : $(domContainer);

        if (type === 'append') {

		      domContainer.append(renderedTemp(jsonData));
              
              return null;
        }

        if (type === 'prepend') {

		      domContainer.prepend(renderedTemp(jsonData));
              
              return null;
        }
//console.log(jsonData);
        domContainer.html(renderedTemp(jsonData));
	}

})($);