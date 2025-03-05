import winston from 'winston'
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.cli(),
  transports: [new winston.transports.Console()]
})

export default logger