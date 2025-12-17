/**
 * AR Overlay Component
 * Renders AR hotspots over detected equipment
 */

import React, { useRef, useEffect } from 'react';

export default function AROverlay({ detections = [], onHotspotClick, videoElement }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !videoElement) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Match canvas size to video
        const resizeCanvas = () => {
            canvas.width = videoElement.videoWidth || videoElement.clientWidth;
            canvas.height = videoElement.videoHeight || videoElement.clientHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [videoElement]);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw scanning grid effect (Terminator style)
        drawScanningGrid(ctx, canvas.width, canvas.height);

        // Draw hotspots for each detection
        detections.forEach((detection, index) => {
            drawHotspot(ctx, detection, index);
        });
    }, [detections]);

    function drawScanningGrid(ctx, width, height) {
        ctx.strokeStyle = '#00D4FF33';
        ctx.lineWidth = 1;

        // Horizontal lines
        const gridSpacing = 50;
        for (let y = 0; y < height; y += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Vertical lines
        for (let x = 0; x < width; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Corner brackets
        const bracketSize = 100;
        ctx.strokeStyle = '#00D4FF';
        ctx.lineWidth = 3;

        // Top-left
        ctx.beginPath();
        ctx.moveTo(20, 50);
        ctx.lineTo(20, 20);
        ctx.lineTo(50, 20);
        ctx.stroke();

        // Top-right
        ctx.beginPath();
        ctx.moveTo(width - 50, 20);
        ctx.lineTo(width - 20, 20);
        ctx.lineTo(width - 20, 50);
        ctx.stroke();

        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(20, height - 50);
        ctx.lineTo(20, height - 20);
        ctx.lineTo(50, height - 20);
        ctx.stroke();

        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(width - 50, height - 20);
        ctx.lineTo(width - 20, height - 20);
        ctx.lineTo(width - 20, height - 50);
        ctx.stroke();
    }

    function drawHotspot(ctx, detection, index) {
        const { bbox, label, confidence } = detection;
        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;

        // Pulsing effect
        const pulse = Math.sin(Date.now() / 500 + index) * 5 + 15;

        // Draw outer ring (pulsing)
        ctx.strokeStyle = '#00D4FF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30 + pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Draw inner dot
        ctx.fillStyle = '#00D4FF';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw label background
        ctx.fillStyle = 'rgba(0, 212, 255, 0.9)';
        ctx.fillRect(centerX - 60, centerY - 60, 120, 30);

        // Draw label text
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px "Orbitron", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label.toUpperCase(), centerX, centerY - 40);

        // Draw confidence
        ctx.fillStyle = '#00D4FF';
        ctx.font = '10px "Roboto Mono", monospace';
        ctx.fillText(`${Math.round(confidence * 100)}%`, centerX, centerY + 60);

        // Draw bounding box
        ctx.strokeStyle = '#39FF1450';
        ctx.lineWidth = 2;
        ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);
    }

    function handleCanvasClick(event) {
        if (!canvasRef.current || !onHotspotClick) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Scale coordinates to canvas size
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;

        // Check if click is within any hotspot
        const clickedDetection = detections.find(detection => {
            const { bbox } = detection;
            const centerX = bbox.x + bbox.width / 2;
            const centerY = bbox.y + bbox.height / 2;
            const distance = Math.sqrt(
                Math.pow(scaledX - centerX, 2) + Math.pow(scaledY - centerY, 2)
            );
            return distance < 40; // Hotspot radius
        });

        if (clickedDetection) {
            onHotspotClick(clickedDetection);
        }
    }

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-auto cursor-pointer"
            onClick={handleCanvasClick}
            style={{ mixBlendMode: 'screen' }}
        />
    );
}
