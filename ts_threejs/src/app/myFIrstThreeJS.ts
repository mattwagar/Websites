/// <reference path="../../typings/globals/three/three.d.ts" />

class Cube{
    geometry: THREE.BoxGeometry; 
    material: THREE.MeshBasicMaterial;
    object: THREE.Mesh;
    constructor(x: number, y: number, z: number, c: number) {
        const vm = this;
        vm.geometry = new THREE.BoxGeometry(x, y, z);
        vm.material = new THREE.MeshBasicMaterial({ color: c });
        vm.object = new THREE.Mesh(vm.geometry, vm.material);
    }
}


class Renderer {
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    cube: Cube;

    constructor() {
        const vm = this;

        //setting up renderer

        vm.scene = new THREE.Scene();
        vm.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        vm.renderer = new THREE.WebGLRenderer();
        vm.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(vm.renderer.domElement);

        //lights

        //objects

        vm.cube = new Cube(1, 1, 1, 0xff00ff);

        
        vm.scene.add(vm.cube.object);


        //camera settings

        vm.camera.position.z = 5;

        //initial functions and events
        window.requestAnimationFrame((t) => { vm.draw(t); });
    }
    draw(t: any) {
        const vm = this;
        window.requestAnimationFrame((t) => { this.draw(t); });
        
        vm.cube.object.rotateX(0.02);
        vm.cube.object.rotateY(0.03);
        vm.cube.object.rotateZ(0.05);

        vm.renderer.render(vm.scene, vm.camera);
    }
}

const r = new Renderer();