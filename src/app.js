// Basic state management without modules for now
const state = {
    coins: 0,
    displayName: 'Avatar',
    avatarURL: '',
    orbs: []
};

// DOM Elements
const coinValueEl = document.getElementById('coinValue');
const avatarCenter = document.getElementById('avatar-center');
const avatarPopup = document.getElementById('avatar-popup');
const displayNameInput = document.getElementById('displayName');
const avatarImageInput = document.getElementById('avatarImage');
const saveAvatarBtn = document.getElementById('saveAvatar');

// Avatar Management
function updateAvatar() {
    if (state.avatarURL) {
        avatarCenter.innerHTML = `<img src="${state.avatarURL}" alt="Avatar">`;
    } else {
        avatarCenter.innerHTML = `<span id="avatar-initials">${getInitials(state.displayName)}</span>`;
    }
}

function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
}

// Event Listeners
avatarCenter.addEventListener('click', () => {
    avatarPopup.classList.toggle('show');
    displayNameInput.value = state.displayName;
    avatarImageInput.value = state.avatarURL;
});

saveAvatarBtn.addEventListener('click', () => {
    state.displayName = displayNameInput.value || state.displayName;
    state.avatarURL = avatarImageInput.value;
    updateAvatar();
    avatarPopup.classList.remove('show');
    saveUserData();
});

// Backend Integration
async function saveUserData() {
    try {
        const response = await fetch('http://localhost:3000/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                did: 'test-user',
                displayName: state.displayName,
                avatarURL: state.avatarURL
            })
        });
        
        if (!response.ok) throw new Error('Failed to save user data');
        
        const data = await response.json();
        console.log('User data saved:', data);
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

// Initialize
window.addEventListener('load', () => {
    updateAvatar();
});