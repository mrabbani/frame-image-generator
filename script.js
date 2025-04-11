
document.addEventListener('DOMContentLoaded', () => {
    const imageLoader = document.getElementById('imageLoader');
    const frameSelector = document.getElementById('frameSelector');
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const downloadButton = document.getElementById('downloadButton');
    const instructions = document.getElementById('instructions');
  
    const cropModal = document.getElementById('cropModal');
    const cropperImage = document.getElementById('cropperImage');
    const cropConfirmButton = document.getElementById('cropConfirmButton');
    const rotateButton = document.getElementById('rotateButton');
    const closeButton = document.querySelector('.close-button');
  
    const CANVAS_WIDTH = canvas.width;
    const CANVAS_HEIGHT = canvas.height;
  
    let cropper;
    let uploadedImage = null;
    let selectedFrame = null;
    let selectedFrameElement = null;
  
    const frameSources = [
      'frames/frame1.png',
      'frames/frame2.png',
      'frames/frame3.png',
    ];
  
    function loadFrames() {
      frameSelector.innerHTML = '';
      frameSources.forEach(src => {
        const frameOption = document.createElement('div');
        frameOption.classList.add('frame-option');
        frameOption.style.backgroundImage = `url(${src})`;
        frameOption.dataset.frameSrc = src;
        frameOption.addEventListener('click', () => {
          selectFrame(src, frameOption);
        });
        frameSelector.appendChild(frameOption);
      });
  
      if (frameSources.length === 0) {
        frameSelector.innerHTML = '<p>No frames found.</p>';
      }
    }
  
    function selectFrame(frameSrc, frameElement) {
      if (selectedFrameElement) {
        selectedFrameElement.classList.remove('selected');
      }
  
      selectedFrameElement = frameElement;
      selectedFrameElement.classList.add('selected');
  
      const frameImg = new Image();
      frameImg.onload = () => {
        selectedFrame = frameImg;
        drawCanvas();
      };
      frameImg.onerror = () => {
        console.error("Error loading frame:", frameSrc);
        alert(`Error loading frame: ${frameSrc}. Check the path and file.`);
        selectedFrame = null;
        drawCanvas();
      };
      frameImg.src = frameSrc;
    }
  
    imageLoader.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        cropperImage.src = e.target.result;
        cropModal.style.display = 'block';
        if (cropper) cropper.destroy();
        cropper = new Cropper(cropperImage, {
          viewMode: 1,
          aspectRatio: 1,
          autoCropArea: 1,
        });
      };
      reader.readAsDataURL(file);
    });
  
    cropConfirmButton.addEventListener('click', () => {
      const croppedCanvas = cropper.getCroppedCanvas({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
      const img = new Image();
      img.onload = () => {
        uploadedImage = img;
        cropper.destroy();
        cropModal.style.display = 'none';
        drawCanvas();
      };
      img.src = croppedCanvas.toDataURL();
    });
  
    rotateButton.addEventListener('click', () => {
      cropper.rotate(90);
    });
  
    closeButton.addEventListener('click', () => {
      cropper.destroy();
      cropModal.style.display = 'none';
    });
  
    function drawCanvas() {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#eee';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
      let imageDrawn = false;
      let frameDrawn = false;
  
      if (uploadedImage) {
        ctx.drawImage(uploadedImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        imageDrawn = true;
      }
  
      if (selectedFrame) {
        ctx.drawImage(selectedFrame, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        frameDrawn = true;
      }
  
      downloadButton.disabled = !(imageDrawn && frameDrawn);
      instructions.style.display = downloadButton.disabled ? 'block' : 'none';
    }
  
    downloadButton.addEventListener('click', () => {
      if (!uploadedImage || !selectedFrame) {
        alert("Please upload an image and select a frame first.");
        return;
      }
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'profile-picture-with-frame.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  
    loadFrames();
    drawCanvas();
  });
    