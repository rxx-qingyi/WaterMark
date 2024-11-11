import React, { useEffect, useState } from 'react';

interface WaterMarkProps {
  watermarkText: string;
}

const WaterMark = ({ watermarkText }: WaterMarkProps) => {
  const [text, setText] = useState<string>("")
  const maxZIndex = 2 ** 31 - 1;

  useEffect(() => {
    setText(watermarkText)
  }, [watermarkText])

  // 生成水印图片 URL
  const generateWatermarkImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200; // 调整大小以控制水印间距
    canvas.height = 200;
    const ctx: any = canvas.getContext('2d');

    // 设置透明背景
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制水印文字
    ctx.font = '20px Arial';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // 设置透明度的水印颜色
    ctx.rotate(-Math.PI / 6); // 设置旋转角度
    ctx.fillText(text || '', 50, 100); // 文字位置

    return canvas.toDataURL();
  };

  const createWatermarkLayer = () => {
    const watermarkLayer = document.createElement('div');
    watermarkLayer.style.position = 'absolute';
    watermarkLayer.style.top = '0';
    watermarkLayer.style.left = '0';
    watermarkLayer.style.width = '100%';
    watermarkLayer.style.height = '100%';
    watermarkLayer.style.pointerEvents = 'none'; // 确保水印不影响子元素的交互
    watermarkLayer.style.backgroundImage = `url(${generateWatermarkImage()})`;
    watermarkLayer.style.backgroundRepeat = 'repeat';
    watermarkLayer.style.opacity = '0.3'; // 设置透明度
    watermarkLayer.style.zIndex = maxZIndex.toString();

    return watermarkLayer;
  };

  useEffect(() => {
    // 创建并添加水印层
    let watermarkLayer = createWatermarkLayer();
    const container: any = document.body
    if (container) {
      container.insertBefore(watermarkLayer, container.firstChild);
    }

    // 监听 DOM 变化，确保水印不被删除
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          if (mutation.type === 'childList' && !document.body.contains(watermarkLayer)) {
            watermarkLayer = createWatermarkLayer();
            if (container) {
              container.insertBefore(watermarkLayer, container.firstChild);
            }
            observer.observe(document.body, {
              childList: true,
              attributes: true,
              subtree: true,
            });
          }
        } else if (mutation.type === 'attributes') {
          if (mutation.target === watermarkLayer) {
            container.removeChild(mutation.target);
            watermarkLayer = createWatermarkLayer();
            if (container) {
              container.insertBefore(watermarkLayer, container.firstChild);
            }
            observer.observe(document.body, {
              childList: true,
              attributes: true,
              subtree: true,
            });
          }
          // 如果发现 z-index 被修改了，将其设置回最高值
          if (parseInt((mutation.target as HTMLElement).style.zIndex) >= maxZIndex) {
            (mutation.target as HTMLElement).style.zIndex = (maxZIndex - 1).toString();
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
    });

    // 组件卸载时移除水印和观察器
    return () => {
      if (watermarkLayer) {
        document.body.removeChild(watermarkLayer);
      }
      observer.disconnect();
    };
  }, [text])

  return (
    <></>
  );
};

export default WaterMark;
