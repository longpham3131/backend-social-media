module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    debugScreens: {
      position: ["top", "left"],
    },
    boxShadow: {
      "primary-shadow": "var(--color-primary-shadow)",
      "color-box-shadow": "var(--color-box-shadow)",
      sm: "0px 4px 20px rgba(0, 0, 0, 0.03)",
      default: "0px 4px 10px var(--color-green-5)",
      1: "0px 4px 20px rgba(0, 0, 0, 0.03)",
      2: "0px 6px 16px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12)",
      "only-top": "0px -5px 10px rgba(0, 0, 0, 0.05)",
      none: "none",
      modal:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      "style-1":
        "0px 6px 16px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12)",
    },
    maxWidth: {
      modal: "510px",
    },
    minHeight: {
      "fit-content": "fit-content",
      screen: "100vh",
      full: "100%",
      "80%": "80%",
    },
    extend: {
      backgroundImage: {
        "welcome-page": "url('images/background.jpg')",
      },
      fontFamily: {
        quicksand: "'Quicksand', serif",
        primary: "'Rajdhani', sans-serif",
        secondary: "'Titillium Web', sans-serif",
      },
      lineHeight: {
        "0px": "0rem",
        "60px": "6rem",
      },
      spacing: {
        42: "42px",
        "8px": "0.8rem",
        "24px": "2.4rem",
        "36px": "3.6rem",
        "48px": "4.8rem",
        "56px": "5.6rem",
        "60px": "6rem",
        "300px": "30rem",
        "menu-item": "calc(50% - 2.4rem / 2)",
        "fit-content": "fit-content",
      },
      borderRadius: {
        none: "0",
        sm: "4px",
        md: "8px",
        xl: "12px",
        xxl: "50px",
        full: "9999px",
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        md: "18px",
        lg: "20px",
        xl: "24px",
        xxl: "32px",
      },

      colors: {
        "color-text-alt-2": "var(--color-text-alt-2)",
        "color-primary": "var(--color-primary)",
        "color-text": "var(--color-text)",
        "color-header-background": "var(--color-header-background)",
        "color-header-text": "var(--color-header-text)",
        "color-header-input-background": "var(--color-header-input-background)",
        "color-header-icon": "var(--color-header-icon)",
        "color-icon": "var(--color-icon)",
        "color-background": "var(--color-background)",
        "color-default-background": "var(--color-default-background)",
        "color-login-background": "var(--color-login-background)",
        "color-primary-linear": "var(--color-primary-linear-green)",

        "rgba-1": "var(--color-rgba-1)",
        "gray-0": "var(--color-gray-0)",
        "gray-1": "var(--color-gray-1)",
        "gray-2": "var(--color-gray-2)",
        "gray-3": "var(--color-gray-3)",
        "gray-4": "var(--color-gray-4)",
        "gray-5": "var(--color-gray-5)",
        "gray-6": "var(--color-gray-6)",
        "green-primary": "var(--color-primary-green)",
        "green-1": "var(--color-green-1)",
        "green-2": "var(--color-green-2)",
        "green-3": "var(--color-green-3)",
        "green-4": "var(--color-green-4)",
        "green-5": "var(--color-green-5)",
        "red-1": "var(--color-red-1)",
        "red-2": "var(--color-red-2)",
        "purple-1": "var(--color-purple-1)",
        "purple-2": "var(--color-purple-2)",
        "purple-3": "var(--color-purple-3)",
        "orange-1": "var(--color-orange-1)",
        "orange-2": "var(--color-orange-2)",
        "pink-1": "var(--color-pink-1)",
        "pink-2": "var(--color-pink-2)",
        "blue-1": "var(--color-blue-1)",
        "blue-2": "var(--color-blue-2)",
        "blue-3": "var(--color-blue-3)",
        "blue-4": "var(--color-blue-4)",
        "blue-5": "var(--color-blue-5)",
        "blue-6": "var(--color-blue-6)",
        inherit: "inherit",
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.645, 0.045, 0.355, 1)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },

      padding: {
        "7px": "0.7rem",
        "12px": "1.2rem",
      },
      margin: {
        "8px": "0.8rem",
        "16px": "1.6rem",
      },
      animation: {
        "left-to-right": "left-to-right 1s ease-in-out infinite alternate",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        "left-to-right": {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(200%)",
          },
        },
        spin: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
      },
      zIndex: {
        "action-modal": "16",
        tooltip: "15",
        "ele-modal": "14",
        modal: "13",
        "input-search-task": "12",
        "overplay-modal": "11",
      },
    },
  },
  plugins: [
    require("tailwindcss-debug-screens"),
    // require("@tailwindcss/line-clamp"),
  ],
};
