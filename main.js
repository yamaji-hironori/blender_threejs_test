import * as THREE from './libs/three.module.min.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 環境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// ディレクショナルライト
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// カメラの初期位置を設定
camera.position.set(5, 5, 5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

let mixer;
const clock = new THREE.Clock();

// GLTFLoaderを使ってbuilding.glbを読み込む
const loader = new GLTFLoader();
const glb = 'building.glb';
loader.load(
    glb,
    function (gltf) {
        const model = gltf.scene;
        scene.add(model);
        model.position.set(0, 0, 0);

        const animations = gltf.animations;
        if (animations && animations.length) {
            mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(animations[0]);
            action.play();
        }
    },
    undefined,
    function (error) {
        console.error('An error happened', error);
    }
);

function animate() {
    requestAnimationFrame(animate);

    if (mixer) {
        mixer.update(clock.getDelta());
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();

// ウィンドウリサイズに対応
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
