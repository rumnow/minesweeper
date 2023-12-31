import React, { useEffect, useState } from 'react';

const Timer = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(time => time + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return <div>Время: {time}</div>;
};

export default Timer;
