import { BoxGeometry, Mesh, MeshNormalMaterial, Scene } from 'three';
import Camera from './components/Camera';
import Renderer from './components/Renderer';
import { domResizeManager, tickerManager } from './managers';
import './style.css';

const scene = new Scene();
const camera = new Camera(75, domResizeManager.aspectRatio, 0.1, 1000);
const renderer = new Renderer(scene, camera, { antialias: true });

const cube = new Mesh(
    new BoxGeometry(1, 1, 1, 1),
    new MeshNormalMaterial()
);
scene.add(cube);

domResizeManager.init();
tickerManager.init();
