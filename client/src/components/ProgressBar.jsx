import React from 'react';

const ProgressBar = ({ current, total }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;

    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-secondary">Progress</span>
                <span className="text-sm font-medium text-secondary">{Math.round(percentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;