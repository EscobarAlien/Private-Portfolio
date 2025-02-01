import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

gsap.registerPlugin(ScrollTrigger);

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow mapping
renderer.setClearColor(0x222222); // Set a clear color to the renderer
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 100;
scene.add(directionalLight);

// Load 3D Model (Head)
let head;
const gltfLoader = new GLTFLoader();
gltfLoader.load('head.glb', (gltf) => {
    head = gltf.scene;
    head.scale.set(0.4, 0.4, 0.4);
    head.position.set(0, -3, -5);
    head.traverse(function (node) {
        if (node.isMesh) {
            node.castShadow = true;
             node.receiveShadow = true;
        }
    });
    scene.add(head);
},
(xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
      console.error("An error occured while loading the model: ", error);
    }
);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // For smoother camera movement
controls.dampingFactor = 0.05; // Adjust damping
controls.enableZoom = true; // Enable zoom
controls.zoomSpeed = 1.2 // Zoom speed

// Camera Position
camera.position.z = 5;

// Animation Function
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();


// Resize Listener
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// Parallax Effect
const contentOverlay = document.getElementById('content-overlay');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if(head){
     gsap.to(head.position, {
        y: -3 + scrollY * -0.01,
        duration: 0.8,
        ease: 'power2.out'
        });
    }

    gsap.to(directionalLight.position, {
       y: 10 + scrollY * 0.008,
       duration: 0.8,
        ease: 'power2.out'
    });

     gsap.to(contentOverlay,{
      y: scrollY * 0.015,
      duration: 0.8,
        ease: 'power2.out'
     });
});


// Mouse Effect
document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

    if(head){
        gsap.to(head.rotation, {
        y: mouseX * 0.1,
         x: mouseY * 0.1,
        duration: 0.8,
         ease: 'power2.out'
    });
    }
});

// Header animation
const header = document.querySelector('header');
gsap.from(header, {
    opacity: 0,
    y: -50,
    duration: 0.8,
    ease: 'power2.out'
});

let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > header.offsetHeight) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    lastScrollY = currentScrollY;
});

// Section animations
const sections = document.querySelectorAll("section");
sections.forEach(section => {
    ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => section.classList.add('show'),
        onEnterBack: () => section.classList.add('show'),
        onLeave: () => section.classList.remove('show'),
        onLeaveBack: () => section.classList.remove('show'),
    })
});


// Skill progress animations
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach(item => {
    const progressFill = item.querySelector('.progress-fill');
    const progress = item.dataset.progress;
    const skillBar = item.querySelector('.skill-bar');
     ScrollTrigger.create({
        trigger: skillBar,
        start: "top 80%",
        onEnter: () => {
            gsap.to(progressFill, {
                width: `${progress}%`,
                duration: 1.2,
                 ease: "power2.out"
            });
         },
         onEnterBack: () => {
           gsap.to(progressFill, {
                width: `${progress}%`,
                duration: 1.2,
                 ease: "power2.out"
           });
         },
         onLeave: () => {
              gsap.to(progressFill, {
                   width: 0,
                   duration: 1.2,
                   ease: "power2.out"
              });
         },
        onLeaveBack: () => {
              gsap.to(progressFill, {
                   width: 0,
                   duration: 1.2,
                   ease: "power2.out"
              });
         }
    });
});


// Contact form submission
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

     const nameInput = document.getElementById('name');
     const emailInput = document.getElementById('email');
     const messageInput = document.getElementById('message');

     // Basic email validation
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     let isValid = true;
    if(!nameInput.value.trim()){
         document.getElementById('name-error').textContent = 'Please enter your name.';
         isValid = false;
    } else {
        document.getElementById('name-error').textContent = '';
    }

    if (!emailInput.value.trim()) {
        document.getElementById('email-error').textContent = 'Please enter your email.';
        isValid = false;
      } else if (!emailRegex.test(emailInput.value)) {
          document.getElementById('email-error').textContent = 'Please enter a valid email address.';
           isValid = false;
      } else {
         document.getElementById('email-error').textContent = '';
      }

      if (!messageInput.value.trim()) {
        document.getElementById('message-error').textContent = 'Please enter your message.';
           isValid = false;
     } else {
        document.getElementById('message-error').textContent = '';
      }

    if(isValid){
         const confirmationMessage = document.getElementById('confirmation-message');
       confirmationMessage.style.display = 'block';
       confirmationMessage.classList.add('show');

     setTimeout(() => {
        confirmationMessage.classList.remove('show');
      setTimeout(() => {
         confirmationMessage.style.display = 'none';
        }, 400)
     }, 3000)

    document.getElementById('contact-form').reset();
    }
});