document.addEventListener('DOMContentLoaded', () => {

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    if (!localStorage.getItem('username')){
        document.querySelector('#userLine').innerHTML = 'Please input a username';
    }
    else {
        document.querySelector('#userLine').innerHTML = `User: ${localStorage.getItem('username')}`;
    }

    if (!localStorage.getItem('current_channel')){
        document.querySelector('#channel_title').innerHTML = 'Please select a channel';
    }
    else {
        document.querySelector('#channel_title').innerHTML = `Channel: ${localStorage.getItem('current_channel')}`;
    }

    document.querySelector('#new_users').onsubmit = () => {
        nu = document.querySelector('#new_user').value;
        document.querySelector('#userLine').innerHTML = `User: ${nu}`;
        localStorage.setItem('username', nu);
        document.querySelector('#new_user').value = '';
        return false;
    }


    socket.on('updateChannelList', data => {
        let li = document.createElement('li');
        li.className = "ch";
        li.onclick = function() {
            localStorage.setItem('current_channel', this.innerHTML);
            socket.emit('change channel', {'current_channel': localStorage.getItem('current_channel')})
            document.querySelector('#channel_title').innerHTML = `Channel: ${localStorage.getItem('current_channel')}`;
        };
        li.innerHTML = data.newChan;
        document.querySelector('#channel_list').append(li);
    })

    socket.on('initChannelList', data => {
        let exi_channels = data.existingChannels;
        for (var i = 0; i < exi_channels.length; i++) {
            const li = document.createElement('li');
            li.innerHTML = exi_channels[i];
            li.className = "ch"
            li.onclick = function() {
                localStorage.setItem('current_channel', this.innerHTML);
                socket.emit('change channel', {'current_channel': localStorage.getItem('current_channel')})
                document.querySelector('#channel_title').innerHTML = `Channel: ${localStorage.getItem('current_channel')}`;
            };
            document.querySelector('#channel_list').append(li);
        }
    })

    socket.on('initChannelContent', data => {
        let curChannelData = data.initChannel;
        for (var i = 0; i < curChannelData.length; i++) {
            const li = document.createElement("li");
            li.innerHTML = `${curChannelData[i].text} by ${curChannelData[i].user}, at ${curChannelData[i].time}`;
            document.querySelector("#messages").append(li);
        }
    })

    socket.on('connect', () => {
        document.querySelector('#text_form').onsubmit = () => {
            const text = document.querySelector('#text_input').value;
            var current_time = new Date()
            socket.emit('submit text', {'text': text, 'current_channel': localStorage.getItem('current_channel'),
                                        'current_user': localStorage.getItem('username'), 'current_time': current_time})
            text = '';
            return false;
        }

        document.querySelector("#new_channel").onsubmit = () => {
            socket.emit('submit channel', {"newChan": document.querySelector('#input_channel').value});
            document.querySelector('#input_channel').value = '';
            return false;
        }

    })

    socket.on('refresh channel', data => {
        const li = document.createElement("li");
        let message = data.newMessage;
        li.innerHTML = `${message.text} by ${message.user}, at ${message.time}`;
        document.querySelector("#messages").append(li);
    })


})
