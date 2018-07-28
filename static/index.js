document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('username')){
        document.querySelector('#userLine').innerHTML = 'Please input a username';
    }
    else {
        document.querySelector('#userLine').innerHTML = `User: ${localStorage.getItem('username')}`;
    }

    document.querySelector('#new_users').onsubmit = () => {
        nu = document.querySelector('#new_user').value;
        document.querySelector('#userLine').innerHTML = `User: ${nu}`;
        localStorage.setItem('username', nu);
        document.querySelector('#new_user').value = '';
        return false;
    }

    document.querySelector("#new_channel").onsubmit = () => {
        const li = document.createElement('li');
        li.innerHTML = document.querySelector('#input_channel').value;
        li.className = 'ch';
        li.setAttribute('onclick', 'changeChannel()')
        document.querySelector('#channel_list').append(li);
        document.querySelector('#input_channel').value = '';
        return false;
    }
    

})

function changeChannel() {
    alert('you did it');
    return;
}
