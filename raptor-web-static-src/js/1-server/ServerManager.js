var ServerManager = function()
{};

ServerManager.prototype.sendRequest = function(action,data,successCallback,errorCallback)
{
	$.ajax({
		url: 'api.php',
		method: 'POST',
		data: {
			action: action,
			data: ($.isDefined(data)) ? data : ''
		},
		success: function(res){
			if ($.isDefined(successCallback))
			{
				if (res != '')
				{
					successCallback(JSON.parse(res));
				}
				else
				{
					successCallback('');
				}
			}
		},
		error: function(err){
			if ($.isDefined(errorCallback))
			{
				if (err != '')
				{
					errorCallback(JSON.parse(err));
				}
				else
				{
					errorCallback('');
				}
			}
		}
	});
};
