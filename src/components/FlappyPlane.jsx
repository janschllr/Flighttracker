import React, { useEffect, useRef, useState } from 'react';
import { X, Plane } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useLanguage } from '../i18n/LanguageContext';

export function FlappyPlane({ onClose }) {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('start'); // start, playing, gameover
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [planeImg, setPlaneImg] = useState(null);
    const { t } = useLanguage();

    // Game constants
    const GRAVITY = 0.15;
    const JUMP = -4.5;
    const PIPE_SPEED = 3;
    const PIPE_SPAWN_RATE = 150; // Frames
    const PIPE_GAP = 200;

    // Game state refs (for loop)
    const planeRef = useRef({ x: 50, y: 200, velocity: 0, width: 40, height: 40 });
    const pipesRef = useRef([]);
    const frameRef = useRef(0);
    const requestRef = useRef();

    // Load Plane Icon
    useEffect(() => {
        const svgComponentString = renderToStaticMarkup(<Plane size={48} color="#0f172a" fill="#0f172a" />);

        const img = new Image();
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgComponentString)}`;
        img.onload = () => setPlaneImg(img);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Resize canvas
        canvas.width = window.innerWidth > 600 ? 600 : window.innerWidth - 40;
        canvas.height = 600;

        const drawCloud = (x, y, width, height) => {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            // Simple cloud shape using circles
            const r = width / 3;
            ctx.arc(x + r, y + height / 2, r, 0, Math.PI * 2);
            ctx.arc(x + width / 2, y + height / 2 - r / 2, r, 0, Math.PI * 2);
            ctx.arc(x + width - r, y + height / 2, r, 0, Math.PI * 2);
            ctx.fill();
            // Fill rect to make it solid for collision
            ctx.fillRect(x + r / 2, y + height / 2, width - r, height / 2);
        };

        const drawPlane = (x, y, angle) => {
            if (!planeImg) return;

            ctx.save();
            ctx.translate(x + 20, y + 20); // Center pivot
            ctx.rotate(angle);
            ctx.drawImage(planeImg, -20, -20, 40, 40);
            ctx.restore();
        };

        const loop = () => {
            if (gameState === 'gameover') return;

            // Clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background (Sky)
            ctx.fillStyle = '#bae6fd'; // sky-200
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (gameState === 'playing') {
                // Update Plane
                planeRef.current.velocity += GRAVITY;
                planeRef.current.y += planeRef.current.velocity;

                // Rotation based on velocity
                const angle = 0;

                // Spawn Pipes
                frameRef.current++;
                if (frameRef.current % PIPE_SPAWN_RATE === 0) {
                    const minHeight = 50;
                    const maxHeight = canvas.height - PIPE_GAP - minHeight;
                    const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

                    pipesRef.current.push({
                        x: canvas.width,
                        topHeight: height,
                        passed: false
                    });
                }

                // Update Pipes
                pipesRef.current.forEach(pipe => {
                    pipe.x -= PIPE_SPEED;
                });

                // Remove off-screen pipes
                if (pipesRef.current.length > 0 && pipesRef.current[0].x < -60) {
                    pipesRef.current.shift();
                }

                // Collision Detection
                // Ground/Ceiling
                if (planeRef.current.y + planeRef.current.height > canvas.height || planeRef.current.y < 0) {
                    gameOver();
                }

                // Pipes
                pipesRef.current.forEach(pipe => {
                    // Check collision
                    const plane = planeRef.current;
                    // Hitbox slightly smaller than visual
                    const pLeft = plane.x + 5;
                    const pRight = plane.x + plane.width - 5;
                    const pTop = plane.y + 5;
                    const pBottom = plane.y + plane.height - 5;

                    // Top Pipe (Cloud)
                    if (
                        pRight > pipe.x &&
                        pLeft < pipe.x + 60 &&
                        pTop < pipe.topHeight
                    ) {
                        gameOver();
                    }

                    // Bottom Pipe (Cloud)
                    if (
                        pRight > pipe.x &&
                        pLeft < pipe.x + 60 &&
                        pBottom > pipe.topHeight + PIPE_GAP
                    ) {
                        gameOver();
                    }

                    // Score
                    if (!pipe.passed && pLeft > pipe.x + 60) {
                        pipe.passed = true;
                        setScore(s => s + 1);
                    }
                });

                // Draw Pipes (Clouds)
                pipesRef.current.forEach(pipe => {
                    // Top Cloud
                    // Draw a rect for the "pipe" part, but styled as cloud stack
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(pipe.x, 0, 60, pipe.topHeight);
                    // Bottom Cloud
                    ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, 60, canvas.height - (pipe.topHeight + PIPE_GAP));

                    // Add "fluff" details
                    ctx.beginPath();
                    ctx.arc(pipe.x + 10, pipe.topHeight, 20, 0, Math.PI * 2);
                    ctx.arc(pipe.x + 50, pipe.topHeight, 20, 0, Math.PI * 2);
                    ctx.arc(pipe.x + 30, pipe.topHeight + 10, 20, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(pipe.x + 10, pipe.topHeight + PIPE_GAP, 20, 0, Math.PI * 2);
                    ctx.arc(pipe.x + 50, pipe.topHeight + PIPE_GAP, 20, 0, Math.PI * 2);
                    ctx.arc(pipe.x + 30, pipe.topHeight + PIPE_GAP - 10, 20, 0, Math.PI * 2);
                    ctx.fill();
                });

                drawPlane(planeRef.current.x, planeRef.current.y, angle);

            } else if (gameState === 'start') {
                // Draw Static Plane
                drawPlane(planeRef.current.x, planeRef.current.y, 0);

                // Instructions
                ctx.fillStyle = '#0f172a';
                ctx.font = 'bold 24px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(t('clickToFly'), canvas.width / 2, canvas.height / 2);
            }

            requestRef.current = requestAnimationFrame(loop);
        };

        const gameOver = () => {
            setGameState('gameover');
            cancelAnimationFrame(requestRef.current);
            setHighScore(prev => Math.max(prev, score));
        };

        requestRef.current = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, score]);

    const handleJump = () => {
        if (gameState === 'start') {
            setGameState('playing');
            setScore(0);
            planeRef.current = { x: 50, y: 200, velocity: JUMP, width: 40, height: 30 };
            pipesRef.current = [];
            frameRef.current = 0;
        } else if (gameState === 'playing') {
            planeRef.current.velocity = JUMP;
        } else if (gameState === 'gameover') {
            setGameState('start');
            planeRef.current = { x: 50, y: 200, velocity: 0, width: 40, height: 30 };
            pipesRef.current = [];
            setScore(0);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                handleJump();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
            <div className="relative bg-white p-4 rounded-3xl shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 transition-colors z-10"
                >
                    <X className="h-6 w-6 text-slate-900" />
                </button>

                <canvas
                    ref={canvasRef}
                    onClick={handleJump}
                    className="rounded-2xl cursor-pointer shadow-inner border-4 border-slate-200"
                />

                {gameState === 'gameover' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white/90 p-8 rounded-2xl text-center shadow-xl backdrop-blur">
                            <h2 className="text-3xl font-black text-slate-900 mb-2">{t('gameOver')}</h2>
                            <p className="text-slate-500 font-bold mb-4">{t('score')}: {score}</p>
                            <p className="text-slate-400 text-sm">{t('restartHint')}</p>
                        </div>
                    </div>
                )}

                <div className="absolute top-8 left-8 pointer-events-none">
                    <div className="text-4xl font-black text-white drop-shadow-lg stroke-black">
                        {score}
                    </div>
                </div>
            </div>
        </div>
    );
}
