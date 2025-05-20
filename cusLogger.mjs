import { transports, format, createLogger } from "winston";

// const logDir = "log/";

const cusLoggerFormat = format.printf(({level, message, timestamp, filename, meta, })=>{
  const metadata = (meta) ? `, ${JSON.stringify(meta)} `: "";
  return `${timestamp.substring(0, 19)} [${level}] ${(filename) ? filename : ""}: ${message}${metadata}`
})

// let logTransports = [
//   new transports.File({
//     level: "error",
//     filename: `${logDir}error.log`,
//   }),
// ]

let requestLogTransports = [
  new transports.Console(),
  // new transports.File({
  //   level: "warn",
  //   filename: `${logDir}requestWarn.log`,
  // }),
  // new transports.File({
  //   level: "error",
  //   filename: `${logDir}requestError.log`,
  // }),
]

// if (process.env.NOND_ENC !== "production") {
//   logTransports = [...logTransports,
//     new transports.Console(),
    // new transports.File({
    //   level: "info",
    //   filename: `${logDir}info.log`,
    // }),
    // new transports.File({
    //   level: "debug",
    //   filename: `${logDir}debug.log`,
    // }),
//   ]
// }

export const cusLogger = createLogger({
//   transports: logTransports,
  transports: requestLogTransports,
  format: format.combine(
      format.json(),
      format.timestamp(),
      // format.prettyPrint(),
      cusLoggerFormat, 
      ),
});

export const requestLogger = createLogger({
  transports: requestLogTransports,
  format: format.combine(
      format.json(),
      format.timestamp(),
      format.prettyPrint(),
      // cusLoggerFormat, 
      ),
});

