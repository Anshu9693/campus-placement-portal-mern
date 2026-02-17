// Centralized logging utility

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const getTimestamp = () => {
  return new Date().toISOString();
};

export const logger = {
  info: (message, data = null) => {
    console.log(
      `${colors.blue}[INFO]${colors.reset} ${getTimestamp()} - ${message}`,
      data || ""
    );
  },

  success: (message, data = null) => {
    console.log(
      `${colors.green}[SUCCESS]${colors.reset} ${getTimestamp()} - ${message}`,
      data || ""
    );
  },

  error: (message, error = null) => {
    console.error(
      `${colors.red}[ERROR]${colors.reset} ${getTimestamp()} - ${message}`
    );
    if (error) {
      if (error.message) console.error(`  Message: ${error.message}`);
      if (error.stack) console.error(`  Stack: ${error.stack}`);
    }
  },

  warn: (message, data = null) => {
    console.warn(
      `${colors.yellow}[WARN]${colors.reset} ${getTimestamp()} - ${message}`,
      data || ""
    );
  },

  debug: (message, data = null) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `${colors.cyan}[DEBUG]${colors.reset} ${getTimestamp()} - ${message}`,
        data || ""
      );
    }
  },

  request: (method, path, status = null) => {
    const statusColor =
      status >= 400
        ? colors.red
        : status >= 300
          ? colors.yellow
          : colors.green;
    console.log(
      `${colors.cyan}[REQUEST]${colors.reset} ${method} ${path} ${statusColor}${status || "..."}${colors.reset}`
    );
  },
};

export default logger;
