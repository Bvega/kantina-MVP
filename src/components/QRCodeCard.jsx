import React, { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Printer, Check } from 'lucide-react';

/**
 * QRCodeCard renders a scannable QR Code linking to the vendor's mobile ordering menu.
 */
export default function QRCodeCard({ vendorId }) {
  const { t } = useLanguage();
  const qrRef = useRef(null);
  
  // Construct customer menu URL
  // If local: http://localhost:5173/menu/mock-vendor-123
  const menuUrl = `${window.location.origin}/menu/${vendorId || 'demo'}`;

  const handleDownload = () => {
    // Select the SVG element
    const svgElement = document.getElementById('vendor-qr-code');
    if (!svgElement) return;

    // Convert SVG to data URL
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    // Create an image element
    const image = new Image();
    image.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext('2d');
      
      // Draw a clean white background
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR code image onto canvas
      context.drawImage(image, 32, 32, 448, 448);
      
      // Trigger download
      const pngURL = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngURL;
      downloadLink.download = `kantina-qr-menu-${vendorId || 'vendor'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    image.src = blobURL;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Kantina Menu',
        text: t('qr_frame_subtitle'),
        url: menuUrl,
      })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Copy to clipboard fallback
      navigator.clipboard.writeText(menuUrl);
      alert(t('qr_copied_alert'));
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">{t('qr_title')}</h2>
        <p className="text-sm text-gray-500">{t('qr_subtitle')}</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col items-center">
        {/* Poster Frame Mockup */}
        <div className="w-full bg-gradient-to-br from-orange-500 to-terracotta-600 rounded-2xl p-6 text-white text-center shadow-inner flex flex-col items-center">
          <span className="text-2xl font-black tracking-wider mb-1">🍽️ {t('qr_frame_title')}</span>
          <p className="text-xs font-semibold opacity-90 mb-5">{t('qr_frame_subtitle')}</p>
          
          {/* QR Container */}
          <div className="bg-white p-4 rounded-xl shadow-md inline-block">
            <QRCodeSVG
              id="vendor-qr-code"
              value={menuUrl}
              size={180}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: "/vite.svg", // Embed the small icon in the center
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>
          
          <p className="text-xxs font-bold mt-4 tracking-wider opacity-75 uppercase">{t('qr_frame_spot')}</p>
        </div>

        {/* Link display */}
        <div className="w-full bg-gray-50 rounded-xl p-3 border border-gray-100 text-center select-all cursor-pointer mt-5">
          <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider mb-0.5">{t('qr_link_label')}</span>
          <span className="text-xs font-bold text-gray-700 break-all">{menuUrl}</span>
        </div>

        {/* Action button options */}
        <div className="grid grid-cols-2 gap-3 w-full mt-5">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl transition shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            {t('qr_btn_download')}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center py-2.5 px-4 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-xl transition"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {t('qr_btn_share')}
          </button>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-orange-50/50 border border-orange-100/80 rounded-2xl p-5 space-y-3.5">
        <h3 className="font-bold text-orange-950 text-sm">{t('qr_how_title')}</h3>
        <ul className="space-y-2.5 text-xs text-orange-900 font-medium">
          <li className="flex items-start">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-200 text-orange-800 text-[10px] font-black mr-2 shrink-0">1</span>
            <span>{t('qr_how_step_1')}</span>
          </li>
          <li className="flex items-start">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-200 text-orange-800 text-[10px] font-black mr-2 shrink-0">2</span>
            <span>{t('qr_how_step_2')}</span>
          </li>
          <li className="flex items-start">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-200 text-orange-800 text-[10px] font-black mr-2 shrink-0">3</span>
            <span>{t('qr_how_step_3')}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
