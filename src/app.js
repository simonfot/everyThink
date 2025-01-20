import * as THREE from 'three';
import { testFrontend } from './test.js';

// State management
const state = {
    coins: 0,
    displayName: 'Avatar',
    avatarURL: '',
    orbs: [],
    games: []
};

// DOM Elements
const coinValueEl = document.getElementById('coinValue');
const avatarCenter = document.getElementById('avatar-center');
const avatarPopup = document.getElementById('avatar-popup');
const displayNameInput = document.getElementById('displayName');
const avatarImageInput = document.getElementById('avatarImage');
const saveAvatarBtn = document.getElementById('saveAvatar');

// Three.js Setup
let scene, camera, renderer;

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    camera.position.z = 5;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Create orbs
    createOrbs();
    
    // Start animation loop
    animate();
}

function createOrbs() {
    // Create project orbs
    const orbGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const orbMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
    
    // CueUp Orb
    const cueupOrb = new THREE.Mesh(orbGeometry, orbMaterial.clone());
    cueupOrb.position.set(2, 1, 0);
    scene.add(cueupOrb);
    state.orbs.push({ mesh: cueupOrb, name: 'CueUp' });
    
    // UNIT3 Orb
    const unit3Orb = new THREE.Mesh(orbGeometry, orbMaterial.clone());
    unit3Orb.position.set(-2, -1, 0);
    scene.add(unit3Orb);
    state.orbs.push({ mesh: unit3Orb, name: 'UNIT3' });
    
    // FoT Orb
    const fotOrb = new THREE.Mesh(orbGeometry, orbMaterial.clone());
    fotOrb.position.set(0, 2, 0);
    scene.add(fotOrb);
    state.orbs.push({ mesh: fotOrb, name: 'FoT' });
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate orbs
    state.orbs.forEach(orb => {
        orb.mesh.rotation.x += 0.01;
        orb.mesh.rotation.y += 0.01;
    });
    
    renderer.render(scene, camera);
}

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
    
    // Save to backend
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
                did: 'test-user', // Placeholder DID
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
    initThreeJS();
    updateAvatar();
    
    // Run tests in development
    if (process.env.NODE_ENV !== 'production') {
        console.log('Running frontend tests...');
        testFrontend();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});