import React, { useEffect, useState } from 'react'
import Baner from '../../assets/Baner.jpg'

function Banner() {
  const initialTime = 10 * 60 * 60;
  const [time,setTime] = useState(() => {
    const storage = localStorage.getItem('timer')
    return storage && parseInt(storage,10) > 0 ? parseInt(storage,10) : initialTime
  })

  const timer = (timming) => {
    const hour = Math.floor(timming / 3600);
    const minutes = Math.floor((timming % 3600) / 60);
    const seconds = timming % 60

    useEffect(() => {
      if(time <= 1) return
      const setTimming = setInterval(() => {
        setTime(prev => {
          if(prev < 1) {
            clearInterval(setTimming)
            localStorage.setItem('timer', 0)
            return 0;
          }
          const remainingTime = prev - 1
          localStorage.setItem('timer', remainingTime)
          return remainingTime
        })
      }, 1000)

      return () => clearInterval(setTimming)
    }, [time])

    return {
      hour: String(hour).padStart(2,'0'),
      minutes: String(minutes).padStart(2,'0'),
      seconds: String(seconds).padStart(2,'0')
    }
  }

  const {hour,minutes,seconds} = timer(time)

  return (
    <section
      className='h-[28rem] sm:h-[32rem] md:h-[40rem] bg-cover bg-top mt-20 flex items-center'
      style={{backgroundImage: `url(${Baner})`}}
    >
      <div className='p-4 sm:p-8 md:p-16 space-y-4 sm:space-y-6 md:space-y-8 text-center md:text-left w-full max-w-5xl mx-auto'>
        <h1 className='text-4xl sm:text-6xl md:text-9xl font-bold'>BIG SALE!</h1>
        <h2 className='text-xl sm:text-2xl md:text-2xl font-light'>
          Upto 50% Off - Limited Time Only
        </h2>
        <div className='text-3xl sm:text-4xl md:text-6xl flex justify-center md:justify-start gap-2'>
          <span className='bg-white text-2xl sm:text-3xl md:text-4xl p-2 sm:p-3 md:p-3 rounded-full'>{hour}</span>:
          <span className='bg-white text-2xl sm:text-3xl md:text-4xl p-2 sm:p-3 md:p-3 rounded-full'>{minutes}</span>:
          <span className='bg-white text-2xl sm:text-3xl md:text-4xl p-2 sm:p-3 md:p-3 rounded-full'>{seconds}</span>
        </div>
      </div>
    </section>
  )
}

export default Banner
