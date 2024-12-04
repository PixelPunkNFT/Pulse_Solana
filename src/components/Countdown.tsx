'use client';

import { useState, useEffect } from 'react';
import countdownConfig from '../config/countdown.json';

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        if (!countdownConfig.show) return;

        const targetDate = new Date(countdownConfig.date);

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                return {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                };
            }

            return {
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            };
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Calcolo iniziale
        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, []);

    const padNumber = (num: number): string => {
        return num.toString().padStart(2, '0');
    };

    if (!countdownConfig.show) {
        return null;
    }

    return (
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-white/10 shadow-xl">
            <div className="flex gap-8">
                <div className="text-center">
                    <div className="text-4xl font-bold text-white">{padNumber(timeLeft.days)}</div>
                    <div className="text-sm text-white/70 uppercase tracking-wider mt-2">Giorni</div>
                </div>
                <div className="text-4xl font-light text-white/50">:</div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-white">{padNumber(timeLeft.hours)}</div>
                    <div className="text-sm text-white/70 uppercase tracking-wider mt-2">Ore</div>
                </div>
                <div className="text-4xl font-light text-white/50">:</div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-white">{padNumber(timeLeft.minutes)}</div>
                    <div className="text-sm text-white/70 uppercase tracking-wider mt-2">Minuti</div>
                </div>
                <div className="text-4xl font-light text-white/50">:</div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-white">{padNumber(timeLeft.seconds)}</div>
                    <div className="text-sm text-white/70 uppercase tracking-wider mt-2">Secondi</div>
                </div>
            </div>
        </div>
    );
}
