export function cropImage(imageData, left, top, width, height) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 計算設備像素比和缩放比例
        const dpr = window.devicePixelRatio || 1;
        const scaleX = img.naturalWidth / window.innerWidth;
        const scaleY = img.naturalHeight / window.innerHeight;

        // 计算在原图中的实际坐标和尺寸
        const scaledLeft = left * scaleX;
        const scaledTop = top * scaleY;
        const scaledWidth = width * scaleX;
        const scaledHeight = height * scaleY;

        // 設置畫布尺寸
        canvas.width = Math.round(scaledWidth);
        canvas.height = Math.round(scaledHeight);

        // 從原圖裁剪指定區域
        ctx.drawImage(
          img,
          Math.round(scaledLeft),
          Math.round(scaledTop),
          Math.round(scaledWidth),
          Math.round(scaledHeight),
          0, 0,
          canvas.width,
          canvas.height
        );

        // 轉換為base64
        const croppedDataURL = canvas.toDataURL('image/png', 1.0);
        resolve(croppedDataURL);
      };

      img.onerror = () => {
        reject(new Error('圖片處理失敗'));
      };

      img.src = imageData;
    } catch (error) {
      reject(error);
    }
  });
}

export function stitchImages(images, width, height) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // 預加載所有圖片
    const imagePromises = images.map(src => {
      return new Promise((imgResolve, imgReject) => {
        const img = new Image();
        img.onload = () => imgResolve(img);
        img.onerror = () => imgReject(new Error('圖片加載失敗'));
        img.src = src;
      });
    });

    Promise.all(imagePromises).then(loadedImages => {
      const firstImage = loadedImages[0];
      const scaledWidth = firstImage.naturalWidth;
      const scaledHeight = firstImage.naturalHeight;
      const viewportToNaturalRatio = scaledHeight / window.innerHeight;

      canvas.width = scaledWidth;
      canvas.height = height * viewportToNaturalRatio;

      let currentY = 0;
      loadedImages.forEach((img, index) => {
        const h = img.naturalHeight;
        ctx.drawImage(img, 0, currentY);
        currentY += h;
      });

      // 裁剪掉多餘的底部空白
      const finalCanvas = document.createElement('canvas');
      const finalCtx = finalCanvas.getContext('2d');
      const finalHeight = height * viewportToNaturalRatio;
      finalCanvas.width = scaledWidth;
      finalCanvas.height = finalHeight;
      finalCtx.drawImage(canvas, 0, 0, scaledWidth, finalHeight, 0, 0, scaledWidth, finalHeight);

      resolve(finalCanvas.toDataURL('image/png'));

    }).catch(reject);
  });
}
