import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AVS } from '../types/avs';
import { useState, useEffect } from 'react';
import '../styles/glitch.css';

interface AVSBubbleChartProps {
    data: AVS[];
    selectedId?: string;
}

const AVSBubbleChart = ({ data, selectedId }: AVSBubbleChartProps) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setIsGlitching(true);
        const timer = setTimeout(() => {
            setIsGlitching(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [selectedId]);

    const selectedAVS = selectedId
        ? data.find(avs => avs.id === selectedId)
        : data[0];

    if (!selectedAVS) return null;

    const chartData = [
        {
            x: 1,
            y: selectedAVS.operatorCount,
            z: selectedAVS.operatorCount,
            name: 'Operators',
            color: '#3B82F6',
            value: selectedAVS.operatorCount
        },
        {
            x: 2,
            y: selectedAVS.strategyCount,
            z: selectedAVS.strategyCount,
            name: 'Strategies',
            color: '#10B981',
            value: selectedAVS.strategyCount
        },
        {
            x: 3,
            y: selectedAVS.stakerCount,
            z: selectedAVS.stakerCount,
            name: 'Stakers',
            color: '#8B5CF6',
            value: selectedAVS.stakerCount
        },
        {
            x: 4,
            y: selectedAVS.slashingCount,
            z: selectedAVS.slashingCount,
            name: 'Slashes',
            color: '#EF4444',
            value: selectedAVS.slashingCount
        }
    ];

    return (
        <div className="h-[450px] w-full bg-white/70 rounded-lg shadow p-4 backdrop-blur-sm border border-gray-200">
            <h3 className="text-lg font-mono font-bold mb-4 text-center">
                <span
                    className={isGlitching ? 'glitch-text' : 'gradient-text'}
                    data-text={`AVS Metrics: ${selectedAVS.id.slice(0, 4)}...${selectedAVS.id.slice(-4)}`}
                >
                    AVS Metrics: {`${selectedAVS.id.slice(0, 4)}...${selectedAVS.id.slice(-4)}`}
                </span>
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={isMobile
                        ? { top: 20, right: -20, bottom: 60, left: -20 }
                        : { top: 20, right: 20, bottom: 60, left: 20 }
                    }
                >
                    <XAxis
                        type="number"
                        dataKey="x"
                        domain={[0, 5]}
                        tick={false}
                        axisLine={false}
                        padding={{ left: 30, right: 30 }}
                    />
                    <YAxis
                        type="number"
                        dataKey="y"
                        label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: -30 }}
                        padding={{ top: 20, bottom: 20 }}
                        allowDecimals={false}
                        domain={[0, 'auto']}
                        tickFormatter={(value) => Math.round(value).toString()}
                    />
                    <ZAxis
                        type="number"
                        dataKey="z"
                        range={[50, 300]}
                    />
                    <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ payload }) => {
                            if (!payload?.length) return null;
                            const data = payload[0].payload;
                            return (
                                <div className="bg-white p-2 shadow rounded border border-gray-200">
                                    <p className="font-mono text-sm" style={{ color: data.color }}>
                                        {data.name}: {data.value}
                                    </p>
                                </div>
                            );
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={4}
                        iconSize={8}
                        wrapperStyle={{
                            fontSize: isMobile ? '0.6rem' : '0.75rem'
                        }}
                        formatter={(value) => <span className="font-mono">{value}</span>}
                        iconType="circle"
                        layout="horizontal"

                        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    />
                    {chartData.map((entry, index) => (
                        <Scatter
                            key={entry.name}
                            name={entry.name}
                            data={[entry]}
                            fill={entry.color}
                            fillOpacity={0.6}
                        />
                    ))}
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AVSBubbleChart; 