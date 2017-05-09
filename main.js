jQuery(function($, undefined) {
    // constants
    var unsplashClientId = 'd01bab0e7417e32771dedec3b0dbb3deb3552395d80b864c2b37110dac6f9473';
    var digMicro = 'https://digit-micro-qktvbldqvc.now.sh';
    var greeting = 'Try `dig <recordType> <hostname>`';

    // photo background
    $.get('https://api.unsplash.com/photos/random?w=1920&h=1080&client_id=' + unsplashClientId)
    .then(function (data) {
        var photo = data.urls.regular;
        $.backstretch(photo);
    }).catch(function (err) {
        $.backstretch('https://farm9.staticflickr.com/8178/8069618571_c00259220c_k_d.jpg');
    });

    // shell processing
    $('#shell').terminal(function(command) {
        if (command === 'hello') {
            this.echo(greeting);
        } else if (command.indexOf('dig') === 0) {
            var term = this;

            var commandParts = command.split(' ');

            $.ajax(digMicro,
            {
                type: 'POST',
                async: false,
                data: JSON.stringify({
                    host: commandParts[2],
                    rrtype: commandParts[1]
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            }).done(function (data) {
                term.echo(JSON.stringify(data));
            }).catch(function (err) {
                term.error(err.responseText);
            })
        } else if (command !== '') {
            try {
                var result = window.eval(command);
                if (result !== undefined) {
                    this.echo(new String(result));
                }
            } catch(e) {
                this.error(new String(e));
            }
        } else {
           this.echo('');
        }
    }, {
        greetings: greeting,
        name: 'terminal',
        prompt: '> '
    });
});