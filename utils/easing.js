// acceleration until halfway, then deceleration 
export const easeInOutQuint = t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
