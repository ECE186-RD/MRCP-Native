AFRAME.registerComponent('panel', {
    init: function () {
      this.parent = document.querySelector('a-marker').object3D;
      this.shadow = document.querySelector('#test-panel');
      this.canvas = document.querySelector('canvas');
    },
    tick: function(time, timeDelta){
    this.el.object3D.rotation = this.el.object3D.lookAt(camera.object3D.position);
      
    const screenPos = toScreenPosition(this.el.object3D, this.canvas)
    const scale = getScreenScale(1/this.parent.position.length())*4;
  
    this.shadow.style.transform = `translate(-50%, -50%) translate(${screenPos.x}px,${screenPos.y}px) scale(${scale})`;
    if(this.parent.visible == true){
      this.shadow.style.display="flex";
    }else{
      this.shadow.style.display="none";
    }
      },
  });

  //toScreenPosition from https://stackoverflow.com/questions/27409074/converting-3d-position-to-2d-screen-position-r69

  function toScreenPosition(obj,  canvas)
{
    var vector = new THREE.Vector3();

    var widthHalf = 0.5*canvas.clientWidth;
    var heightHalf = 0.5*canvas.clientHeight;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(AFRAME.scenes[0].camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return { 
        x: vector.x,
        y: vector.y
    };

};

//getScreenScale from https://stackoverflow.com/questions/13350875/three-js-width-of-view/13351534#13351534
function getScreenScale(dist){
  var camera = AFRAME.scenes[0].camera;
  var vFOV = THREE.Math.degToRad( camera.fov ); // convert vertical fov to radians
  var height = 2 * Math.tan( vFOV / 2 ) * dist; // visible height
  var width = height * camera.aspect;           // visible width

  return width;
}