/// <reference path="../../typings/globals/three/three.d.ts" />
var Cube = (function () {
    function Cube(x, y, z, c) {
        var vm = this;
        vm.geometry = new THREE.BoxGeometry(x, y, z);
        vm.material = new THREE.MeshBasicMaterial({ color: c });
        vm.object = new THREE.Mesh(vm.geometry, vm.material);
    }
    return Cube;
}());
var Renderer = (function () {
    function Renderer() {
        var vm = this;
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
        window.requestAnimationFrame(function (t) { vm.draw(t); });
    }
    Renderer.prototype.draw = function (t) {
        var _this = this;
        var vm = this;
        window.requestAnimationFrame(function (t) { _this.draw(t); });
        vm.cube.object.rotateX(0.02);
        vm.cube.object.rotateY(0.03);
        vm.cube.object.rotateZ(0.05);
        vm.renderer.render(vm.scene, vm.camera);
    };
    return Renderer;
}());
var r = new Renderer();

//# sourceMappingURL=myFIrstThreeJS.js.map
