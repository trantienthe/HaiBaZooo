'use client';
import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

export default function Home() {
  const [points, setPoints] = useState(0);
  const [numbers, setNumbers] = useState([]);
  const [positions, setPositions] = useState<any>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [nextNumber, setNextNumber] = useState(1);
  const numberParentRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: any) => {
    setPoints(parseInt(e.target.value));
  };

  const handlePlayClick = () => {
    setIsPlaying(false);
    setNumbers([]);
    setPositions([]);

    setTime(0);
    setNextNumber(1);

    const numberList = [];
    for (let i = 1; i <= points; i++) {
      numberList.push(i);
    }
    const shuffledNumbers = shuffleArray(numberList);
    setNumbers(shuffledNumbers);

    const generatedPositions = shuffledNumbers.map(() => ({
      top: `${Math.random() * 91}%`,
      left: `${Math.random() * 91}%`,
    }));
    setPositions(generatedPositions);

    resetNumberDisplay();
    setIsPlaying(true);
  };

  const resetNumberDisplay = () => {
    if (numberParentRef.current) {
      const spans = numberParentRef.current.querySelectorAll('span');

      spans.forEach((span: any) => {
        span.style.display = 'block';
      });
    }
  };

  const shuffleArray = (array: any) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    let interval: any;

    if (isPlaying) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNumberClick = (e: any, number: number) => {
    if (number < nextNumber) return;
    if (number > nextNumber) {
      Swal.fire({
        icon: 'error',
        title: 'You lose!',
        text: 'You need to sort in ascending order. Press the play button to try again.',
      });
      setIsPlaying(false);
      return;
    }

    e.target.style.transition = 'all 1s ease-in-out, transform 1s ease-in-out';
    e.target.style.opacity = '0';
    e.target.style.transform = 'scale(0.5)';
    setTimeout(() => {
      e.target.style.display = 'none';
      e.target.style.opacity = '1';
      e.target.style.transform = 'scale(1)';
      e.target.style.transition = '';
    }, 1000);

    if (nextNumber === points) {
      Swal.fire({
        icon: 'success',
        title: 'Congratulations!',
        text: `You win the game in ${time} seconds!`,
      });
      setIsPlaying(false);
      return;
    }

    setNextNumber(nextNumber + 1);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24n bg-white">
      <div className="w-[95%] mt-4 rounded-sm border-[4px] border-black h-full ">
        <h2 className="text-center mt-5 text-[18px] md:text-[24px] font-bold text-red-500">HABAZO - Entrance Test - Trần Tiến Thế - React JS</h2>
        <div className="flex justify-between ml-[20px] mr-[20px] md:ml-[250px] md:mr-[250px]">
          <div className="flex">
            <h2 className="mt-5 text-[18px] font-bold text-red-500">Points :</h2>
            <input
              type="number"
              className="border-[2px] border-red-500 ml-5 mt-5 font-bold w-[100px] text-center "
              value={points === 0 ? '' : points}
              onChange={handleInputChange}
              // disabled={isPlaying}
            />
          </div>
          <div className="flex text-red-500">
            <h2 className="mt-5 text-[18px] font-bold">Time :</h2>
            <h2 className="mt-5 text-[18px] font-bold ml-5">{time} s</h2>
          </div>
        </div>
        <div className="flex justify-center">
          <button className="text-red-500 mt-3 text-[18px] font-bold border-[2px] border-red-500 rounded-full w-[120px] h-[50px] hover:bg-red-500 hover:text-white" onClick={handlePlayClick}>
            {isPlaying ? 'Reset' : 'Play'}
          </button>
        </div>
        <div ref={numberParentRef} className="md:w-[98%] md:ml-4 mt-4 rounded-sm border-[2px] border-black h-[500px] mb-5 relative bg-slate-200">
          {numbers.map((number, index) => (
            <span
              key={number}
              className={`absolute text-[24px] font-bold text-red-400 border-2 border-red-400 cursor-pointer bg-white hover:bg-red-700 hover:text-white transition-transform duration-150 ease-in-out`}
              onClick={(e) => handleNumberClick(e, number)}
              style={{
                top: positions[index]?.top,
                left: positions[index]?.left,
                borderRadius: '50px',
                padding: '5px 20px',
                zIndex: `${points - number}`,
              }}
            >
              {number}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
