import { useState, useEffect } from 'react';

interface WorkStatus {
  isWorking: boolean;
  startTime: Date | null;
  duration: string;
}

export const useWorkStatus = () => {
  const [workStatus, setWorkStatus] = useState<WorkStatus>({
    isWorking: false,
    startTime: null,
    duration: '00:00:00'
  });

  const clockIn = () => {
    const now = new Date();
    setWorkStatus({
      isWorking: true,
      startTime: now,
      duration: '00:00:00'
    });
  };

  const clockOut = () => {
    setWorkStatus({
      isWorking: false,
      startTime: null,
      duration: '00:00:00'
    });
  };

  useEffect(() => {
    if (!workStatus.isWorking || !workStatus.startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - workStatus.startTime!.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      const duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      setWorkStatus(prev => ({ ...prev, duration }));
    }, 1000);

    return () => clearInterval(interval);
  }, [workStatus.isWorking, workStatus.startTime]);

  return {
    ...workStatus,
    clockIn,
    clockOut
  };
};
