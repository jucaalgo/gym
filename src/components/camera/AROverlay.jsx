/**
 * AR Overlay Component
 * Renders AR hotspots over detected equipment
 */

import React, { useRef, useEffect } from 'react';

export default function AROverlay({ detections = [], onHotspotClick, videoElement, mode = 'equipment' }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !videoElement) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Match canvas size to video
        const resizeCanvas = () => {
            const width = videoElement.videoWidth || videoElement.clientWidth;
            const height = videoElement.videoHeight || videoElement.clientHeight;

            if (width > 0 && height > 0) {
                canvas.width = width;
                canvas.height = height;
            }
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

        if (mode === 'biomechanics') {
            drawBiomechanics(ctx, canvas.width, canvas.height);
        } else {
            // Draw hotspots for each detection
            detections.forEach((detection, index) => {
                drawHotspot(ctx, detection, index);
            });
        }
    }, [detections, mode]);

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

    function drawBiomechanics(ctx, width, height) {
        // Draw Mock Skeletal Structure
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.strokeStyle = '#39FF14';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        // "Joint" points
        const joints = [
            { x: centerX, y: centerY - 100, label: 'HEAD' },
            { x: centerX - 50, y: centerY - 40, label: 'L_SHOULDER' },
            { x: centerX + 50, y: centerY - 40, label: 'R_SHOULDER' },
            { x: centerX - 60, y: centerY + 50, label: 'L_HIP' },
            { x: centerX + 60, y: centerY + 50, label: 'R_HIP' },
            { x: centerX - 70, y: centerY + 150, label: 'L_KNEE' },
            { x: centerX + 70, y: centerY + 150, label: 'R_KNEE' }
        ];

        // Draw Connections
        ctx.beginPath();
        ctx.moveTo(joints[1].x, joints[1].y);
        ctx.lineTo(joints[2].x, joints[2].y); // Shoulders
        ctx.lineTo(joints[4].x, joints[4].y); // R_Shoulder to R_Hip
        ctx.lineTo(joints[3].x, joints[3].y); // R_Hip to L_Hip
        ctx.lineTo(joints[1].x, joints[1].y); // L_Hip to L_Shoulder
        ctx.stroke();

        // Draw Limbs
        ctx.beginPath();
        ctx.moveTo(joints[3].x, joints[3].y); ctx.lineTo(joints[5].x, joints[5].y);
        ctx.moveTo(joints[4].x, joints[4].y); ctx.lineTo(joints[6].x, joints[6].y);
        ctx.stroke();

        ctx.setLineDash([]); // Reset dash

        // Draw Angle Markers & Status HUD
        joints.forEach(joint => {
            ctx.fillStyle = '#39FF14';
            ctx.beginPath();
            ctx.arc(joint.x, joint.y, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(57, 255, 20, 0.2)';
            ctx.beginPath();
            ctx.arc(joint.x, joint.y, 15, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#39FF14';
            ctx.font = '9px "Roboto Mono"';
            ctx.fillText(joint.label, joint.x + 10, joint.y - 10);
            ctx.fillText('98.4%', joint.x + 10, joint.y);
        });

        // Rep Counter / Stability Meter
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(20, height - 100, 150, 60);
        ctx.strokeStyle = '#39FF14';
        ctx.strokeRect(20, height - 100, 150, 60);

        ctx.fillStyle = '#39FF14';
        ctx.font = 'bold 12px Orbitron';
        ctx.fillText('STABILITY: OPTIMAL', 30, height - 80);
        ctx.fillText('FORM SCORE: 94', 30, height - 60);
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
