/**
.Untitled {
  --background: #ffffff;
  --Gray100: #8d95a9;
  --Gray200: #707687;
  --Gray300: #636977;
  --Gray400: #585d6b;
  --Gray500: #505460;
  --Blue100: #7f93ce;
  --Blue200: #5571d1;
  --Blue300: #415dd9;
  --Blue400: #3953c6;
  --Blue500: #364caa;
}


const Blue = {
  '100': '#7f93ce',
  '200': '#5571d1',
  '300': '#415dd9',
  '400': '#3953c6',
  '500': '#364caa'
}

const Gray = {
  '100': '#8d95a9',
  '200': '#707687',
  '300': '#636977',
  '400': '#585d6b',
  '500': '#505460'
};
 */
const colors = {
  Gray: {
    100: '#8d95a9',
    200: '#707687',
    300: '#636977',
    400: '#585d6b',
    500: '#505460',
  },
  Blue: {
    100: '#7f93ce',
    200: '#5571d1',
    300: '#415dd9',
    400: '#3953c6',
    500: '#364caa',
  },
};


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/*.html",
  ],
  theme: {
    extend: {
      //colors: {
      // themeColor: Blue,//'#3c57dd', //"hsl(230, 70%, 55%)",
      // secondaryText: Gray,
      // textColor: "#ffffff",
      // tertiaryTextColor: "#5a6173",
      // dividerColor: "#454a58",
      // secondaryBackgroundColor: "hsl(227, 16%, 22%)",
      // backgroundColor: "hsl(228, 16%, 18%)",
      // pianoKeyBlack: "#272a36",
      // pianoKeyWhite: "#fbfcff",
      // pianoBlackKeyLaneColor: "hsl(228, 16%, 15%)",
      // ghostNoteColor: "#444444",
      // recordColor: "#dd3c3c",
      // shadowColor: "rgba(0, 0, 0, 0.2)",
      // highlightColor: "#8388a51a",
      // redColor: "#DE5267",
      // greenColor: "#31DE53",



      // backgroundColor: {
      //   default: "hsl(230, 70%, 55%)", // Using themeColor as the default background
      // },
      colors: {
        gray: colors.Gray,
        blue: colors.Blue,
        backgroundColor: theme => ({
          ...theme('colors'),
          'page': colors.Gray[100],   // Default background color for pages
          'card': colors.Gray[200],   // Default background color for cards
          'highlight': colors.Blue[100], // Highlight background color
        }),
        textColor: theme => ({
          ...theme('colors'),
          'primary': colors.Gray[500],  // Default primary text color
          'secondary': colors.Gray[400], // Default secondary text color
          'link': colors.Blue[300],     // Default link text color
        }),
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Avenir, Lato",
          },
        },
        canvas: {
          css: {
          },
          fontFamily: "Arial",
        },
      },
      plugins: [],
    },
  }
